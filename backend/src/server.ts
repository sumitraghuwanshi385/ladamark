import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

import admin from 'firebase-admin';
import { GoogleGenAI, Type } from '@google/genai';

const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// -------------------- FIREBASE ADMIN --------------------
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_PATH in backend/.env');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// -------------------- GEMINI --------------------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in backend/.env');

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// -------------------- CLOUDINARY --------------------
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY?.trim();
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Missing Cloudinary env vars in backend/.env');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer: Buffer, folder: string) => {
  return new Promise<{ secureUrl: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Cloudinary upload failed'));
        resolve({ secureUrl: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};
const EXPORT_LIMITS: Record<'free' | 'pro', { daily: number }> = {
  free: { daily: 5 },
  pro: { daily: 999999 }, // unlimited-ish for now
};

const toCsvSafe = (val: any) => {
  const s = String(val ?? '');
  return `"${s.replace(/"/g, '""')}"`;
};

// -------------------- PLAN + QUOTA --------------------
const PLAN_LIMITS: Record<'free' | 'pro', { daily: number; monthly: number }> = {
  free: { daily: 5, monthly: 150 },
  pro: { daily: 20, monthly: 600 },
};

function getTodayStr() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}
function getMonthStr() {
  return getTodayStr().slice(0, 7); // YYYY-MM
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// -------------------- APP SETUP --------------------
const app = express();
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

// -------------------- AUTH MIDDLEWARE --------------------
async function requireAuth(req: any, res: any, next: any) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ ok: false, error: 'Missing Authorization Bearer token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Invalid/expired token' });
  }
}

// -------------------- ROUTES --------------------
app.get('/health', (_req, res) => res.json({ ok: true, service: 'ladamark-backend' }));

// 1) LABEL (Gemini + quota)
app.post('/api/label', requireAuth, upload.single('image'), async (req: any, res) => {
  const uid = req.user.uid as string;

  if (!req.file) return res.status(400).json({ ok: false, error: 'Missing image file (field name: image)' });
  if (!req.file.mimetype?.startsWith('image/')) return res.status(400).json({ ok: false, error: 'Only image files allowed' });

  const requestedSpeedMode: 'normal' | 'fast' = req.body?.speedMode === 'fast' ? 'fast' : 'normal';
  const todayStr = getTodayStr();
  const monthStr = getMonthStr();

  try {
    // --- QUOTA RESERVE ---
    const userRef = db.doc(`users/${uid}`);

    const quotaResult = await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const data = snap.exists ? (snap.data() as any) : {};

      const plan: 'free' | 'pro' = data.plan === 'pro' ? 'pro' : 'free';
      const limits = PLAN_LIMITS[plan];

      const usage = data.usage ?? {};
      const daily = usage.daily ?? { date: '', count: 0 };
      const monthly = usage.monthly ?? { month: '', count: 0 };

      const dailyCount = daily.date === todayStr ? Number(daily.count || 0) : 0;
      const monthlyCount = monthly.month === monthStr ? Number(monthly.count || 0) : 0;

      if (dailyCount + 1 > limits.daily) throw new HttpError(429, `Daily quota exceeded for ${plan} plan (${limits.daily}/day).`);
      if (monthlyCount + 1 > limits.monthly) throw new HttpError(429, `Monthly quota exceeded for ${plan} plan (${limits.monthly}/month).`);

      const newDailyCount = dailyCount + 1;
      const newMonthlyCount = monthlyCount + 1;

      tx.set(
        userRef,
        {
          plan,
          usage: {
            daily: { date: todayStr, count: newDailyCount },
            monthly: { month: monthStr, count: newMonthlyCount },
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const remainingDaily = Math.max(0, limits.daily - newDailyCount);
      const remainingMonthly = Math.max(0, limits.monthly - newMonthlyCount);
      const remaining = Math.min(remainingDaily, remainingMonthly);

      return {
        plan,
        limits,
        usage: { dailyUsed: newDailyCount, monthlyUsed: newMonthlyCount },
        remaining,
      };
    });

    const userPlan = quotaResult.plan;
    const finalSpeedMode: 'normal' | 'fast' =
      userPlan === 'pro' && requestedSpeedMode === 'fast' ? 'fast' : 'normal';

    // --- GEMINI ---
    const buffer: Buffer = req.file.buffer;
    const base64 = buffer.toString('base64');
    const imageHash = crypto.createHash('sha256').update(buffer).digest('hex');

    const prompt =
      "Analyze this e-commerce product image. Return a comprehensive set of data points in JSON format. The data should include: 1. A compelling, SEO-friendly 'productName'. 2. A detailed 'description' that highlights key features and benefits, up to 3 sentences. 3. A 'priceRange' object with 'min' and 'max' suggested prices as numbers, and 'currency' as 'USD'. 4. A main 'category' object with the broadest, most general category for the product (e.g., 'Watch', 'Dress', 'Skincare') as a string 'value', and a 'confidence' score. 5. A list of 'attributes'. Include a 'Subcategory' attribute (e.g., 'Wristwatch', 'Midi Dress'), a 'Gender' attribute if applicable (e.g., \"Men's\", \"Women's\", \"Unisex\"), and other relevant attributes like color, material, style, etc. Each attribute should be an object with a unique 'id', 'key', 'value', and 'confidence' score. Generate at least 6 attributes including Subcategory and Gender. 6. A list of 5-7 relevant 'seoKeywords' as an array of strings.";

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        productName: { type: Type.STRING },
        description: { type: Type.STRING },
        priceRange: {
          type: Type.OBJECT,
          properties: {
            min: { type: Type.NUMBER },
            max: { type: Type.NUMBER },
            currency: { type: Type.STRING },
          },
          required: ['min', 'max', 'currency'],
        },
        category: {
          type: Type.OBJECT,
          properties: { value: { type: Type.STRING }, confidence: { type: Type.NUMBER } },
          required: ['value', 'confidence'],
        },
        attributes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              key: { type: Type.STRING },
              value: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
            },
            required: ['id', 'key', 'value', 'confidence'],
          },
        },
        seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['productName', 'description', 'priceRange', 'category', 'attributes', 'seoKeywords'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: req.file.mimetype } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        thinkingConfig: finalSpeedMode === 'fast' ? { thinkingBudget: 0 } : undefined,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');

    const data = JSON.parse(text.trim());

    if (data?.priceRange) data.priceRange.currency = 'USD';
    if (Array.isArray(data?.attributes)) {
      data.attributes = data.attributes.map((a: any, idx: number) => ({ ...a, id: Date.now() + idx }));
    }

    return res.json({
      ok: true,
      plan: userPlan,
      speedMode: finalSpeedMode,
      quota: {
        remaining: quotaResult.remaining,
        dailyUsed: quotaResult.usage.dailyUsed,
        monthlyUsed: quotaResult.usage.monthlyUsed,
        dailyLimit: quotaResult.limits.daily,
        monthlyLimit: quotaResult.limits.monthly,
      },
      imageHash,
      data,
    });
  } catch (err: any) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ ok: false, error: err.message });
    }

    console.error(err);

    // Best-effort refund (only if failure after reserve)
    try {
      const userRef = db.doc(`users/${uid}`);
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(userRef);
        if (!snap.exists) return;

        const data = snap.data() as any;
        const usage = data.usage ?? {};
        const daily = usage.daily ?? { date: '', count: 0 };
        const monthly = usage.monthly ?? { month: '', count: 0 };

        const curDailyCount = daily.date === todayStr ? Number(daily.count || 0) : 0;
        const curMonthlyCount = monthly.month === monthStr ? Number(monthly.count || 0) : 0;

        tx.set(
          userRef,
          {
            usage: {
              daily: { date: todayStr, count: Math.max(0, curDailyCount - 1) },
              monthly: { month: monthStr, count: Math.max(0, curMonthlyCount - 1) },
            },
          },
          { merge: true }
        );
      });
    } catch (refundErr) {
      console.error('Quota refund failed:', refundErr);
    }

    return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
  }
});

// 2) SAVE LABELED (Cloudinary upload + Firestore save)
app.post('/api/save-labeled', requireAuth, upload.single('image'), async (req: any, res) => {
  try {
    const uid = req.user.uid as string;

    if (!req.file) return res.status(400).json({ ok: false, error: 'Missing image file (field name: image)' });
    if (!req.file.mimetype?.startsWith('image/')) return res.status(400).json({ ok: false, error: 'Only image files allowed' });

    const rawData = req.body?.data;
    if (!rawData) return res.status(400).json({ ok: false, error: 'Missing "data" field (JSON)' });

    const aiData = JSON.parse(rawData);

    const fileName = (req.body?.fileName as string) || req.file.originalname || 'image';
    const date = (req.body?.date as string) || new Date().toISOString();

    const buffer: Buffer = req.file.buffer;
    const imageHash = crypto.createHash('sha256').update(buffer).digest('hex');

    const { secureUrl, publicId } = await uploadBufferToCloudinary(buffer, `ladamark/${uid}`);

    const id = crypto.randomUUID();

    await db.doc(`users/${uid}/labeledImages/${id}`).set({
      fileName,
      imageHash,
      imageUrl: secureUrl,
      imagePublicId: publicId,
      data: aiData,
      date,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({
      ok: true,
      item: {
        id,
        fileName,
        imageHash,
        imageUrl: secureUrl,
        imagePublicId: publicId,
        data: aiData,
        date,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
  }
});

// 3) DELETE SELECTED ITEMS (Firestore + Cloudinary)
app.post('/api/delete-items', requireAuth, async (req: any, res) => {
  try {
    const uid = req.user.uid as string;
    const ids = req.body?.ids as string[];

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ ok: false, error: 'Missing ids[]' });
    }

    let deletedDocs = 0;
    let deletedImages = 0;

    for (const id of ids) {
      const ref = db.doc(`users/${uid}/labeledImages/${id}`);
      const snap = await ref.get();
      if (!snap.exists) continue;

      const data = snap.data() as any;
      const publicId = data?.imagePublicId as string | undefined;

      await ref.delete();
      deletedDocs++;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
          deletedImages++;
        } catch (e) {
          console.error('Cloudinary destroy failed:', publicId, e);
        }
      }
    }

    return res.json({ ok: true, deletedDocs, deletedImages });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
  }
});

// 4) CLEAR HISTORY (Firestore + Cloudinary)
app.post('/api/clear-history', requireAuth, async (req: any, res) => {
  try {
    const uid = req.user.uid as string;

    const colRef = db.collection(`users/${uid}/labeledImages`);
    const snap = await colRef.get();

    let deletedDocs = 0;
    let deletedImages = 0;

    for (const d of snap.docs) {
      const data = d.data() as any;
      const publicId = data?.imagePublicId as string | undefined;

      await d.ref.delete();
      deletedDocs++;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
          deletedImages++;
        } catch (e) {
          console.error('Cloudinary destroy failed:', publicId, e);
        }
      }
    }

    return res.json({ ok: true, deletedDocs, deletedImages });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
  }
});
// 5) UPDATE PROFILE (name + optional avatar upload)
app.post('/api/update-profile', requireAuth, upload.single('avatar'), async (req: any, res) => {
  try {
    const uid = req.user.uid as string;
    const name = (req.body?.name as string | undefined)?.trim();

    let profilePic: string | undefined;
    let avatarPublicId: string | undefined;

    // If avatar file provided, upload to Cloudinary (overwrite same public_id)
    if (req.file) {
      const buffer: Buffer = req.file.buffer;

      const uploadResult = await new Promise<{ secureUrl: string; publicId: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `ladamark/${uid}`,
            public_id: 'avatar',
            overwrite: true,
            resource_type: 'image',
            invalidate: true,
          },
          (err, result) => {
            if (err || !result) return reject(err || new Error('Cloudinary avatar upload failed'));
            resolve({ secureUrl: result.secure_url, publicId: result.public_id });
          }
        );
        stream.end(buffer);
      });

      profilePic = uploadResult.secureUrl;
      avatarPublicId = uploadResult.publicId;
    }

    // Update Firestore user doc
    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (name) updateData.name = name;
    if (profilePic) updateData.profilePic = profilePic;
    if (avatarPublicId) updateData.avatarPublicId = avatarPublicId;

    await db.doc(`users/${uid}`).set(updateData, { merge: true });

    return res.json({
      ok: true,
      profile: {
        name,
        profilePic,
        avatarPublicId,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
  }
});
app.post('/api/export-csv', requireAuth, async (req: any, res) => {
  const uid = req.user.uid as string;

  try {
    const ids = req.body?.ids as string[] | undefined;

    // 1) Load items to export
    let docs: FirebaseFirestore.QueryDocumentSnapshot[] = [];

    if (Array.isArray(ids) && ids.length > 0) {
      const refs = ids.map((id) => db.doc(`users/${uid}/labeledImages/${id}`));
      const snaps = await db.getAll(...refs);
      docs = snaps.filter((s) => s.exists) as any;
    } else {
      const snap = await db.collection(`users/${uid}/labeledImages`).orderBy('createdAt', 'desc').get();
      docs = snap.docs;
    }

    const itemCount = docs.length;

    // 2) Enforce export quota + write export log (transaction)
    const today = getTodayStr();
    const userRef = db.doc(`users/${uid}`);
    const logRef = db.collection(`users/${uid}/exportLogs`).doc();

    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);
      const userData = userSnap.exists ? (userSnap.data() as any) : {};

      const plan: 'free' | 'pro' = userData.plan === 'pro' ? 'pro' : 'free';
      const limit = EXPORT_LIMITS[plan].daily;

      const exportUsage = userData.exportUsage ?? {};
      const daily = exportUsage.daily ?? { date: '', count: 0 };

      const dailyCount = daily.date === today ? Number(daily.count || 0) : 0;

      if (plan === 'free' && dailyCount + 1 > limit) {
        throw new HttpError(429, `Daily export limit reached (5/day) on Free plan.`);
      }

      tx.set(
        userRef,
        {
          exportUsage: {
            daily: { date: today, count: dailyCount + 1 },
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      tx.set(logRef, {
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        format: 'csv',
        itemCount,
      });
    });

    // 3) Build CSV
    const headers = [
      'fileName',
      'imageUrl',
      'productName',
      'description',
      'category',
      'price_min',
      'price_max',
      'attributes',
      'seo_keywords',
      'date',
    ];

    const rows = docs.map((d) => {
      const x = d.data() as any;
      const data = x.data || {};
      const attrs = Array.isArray(data.attributes)
        ? data.attributes.map((a: any) => `${a.key}:${a.value}`).join(';')
        : '';

      const seo = Array.isArray(data.seoKeywords) ? data.seoKeywords.join(',') : '';

      return [
        toCsvSafe(x.fileName),
        toCsvSafe(x.imageUrl),
        toCsvSafe(data.productName),
        toCsvSafe(data.description),
        toCsvSafe(data.category?.value || ''),
        toCsvSafe(data.priceRange?.min ?? ''),
        toCsvSafe(data.priceRange?.max ?? ''),
        toCsvSafe(attrs),
        toCsvSafe(seo),
        toCsvSafe(x.date),
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ladamark_export.csv"');
    return res.status(200).send(csv);
  } catch (err: any) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ ok: false, error: err.message });
    }
    console.error(err);
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`CORS origin allowed: ${CORS_ORIGIN}`);
});