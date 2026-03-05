import React from 'react';

export const AboutContent: React.FC = () => (
    <div className="space-y-4 text-[var(--text-secondary)] prose dark:prose-invert max-w-none">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Our Mission</h3>
        <p>Ladamark was founded on a simple principle: e-commerce data should be intelligent, effortless, and a driver of growth, not a manual chore. We are a team of AI researchers, engineers, and e-commerce veterans passionate about solving the complex challenge of product data management.</p>
        <p>Our cutting-edge vision AI technology is designed to understand products like a human expert, providing rich, accurate, and structured data that empowers businesses to enhance discoverability, personalize shopping experiences, and unlock their true catalog potential.</p>
        <p>We believe in building tools that are not only powerful but also intuitive and accessible, enabling teams of all sizes to compete on a level playing field. Welcome to the future of product tagging.</p>
    </div>
);

export const ContactContent: React.FC = () => (
    <div className="space-y-6 text-[var(--text-secondary)]">
        <p>We'd love to hear from you! Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.</p>
        <div className="space-y-4">
            <p><strong>General Inquiries:</strong> <a href="mailto:hello@ladamark.ai" className="text-[var(--accent-primary)] hover:underline">hello@ladamark.ai</a></p>
            <p><strong>Support:</strong> <a href="mailto:support@ladamark.ai" className="text-[var(--accent-primary)] hover:underline">support@ladamark.ai</a></p>
            <p><strong>Address:</strong> 123 AI Avenue, Tech City, 12345</p>
        </div>
        <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="block w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
            <input type="email" placeholder="Your Email" className="block w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]" />
            <textarea placeholder="Your Message" rows={4} className="block w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-md py-3 px-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"></textarea>
            <button type="submit" className="w-full text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] px-4 py-3 rounded-lg font-semibold transition-colors">Send Message</button>
        </form>
    </div>
);

export const TermsContent: React.FC = () => (
    <div className="prose prose-sm dark:prose-invert max-w-none text-[var(--text-secondary)]">
        <p className="text-sm">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h4>1. Introduction</h4>
        <p>Welcome to Ladamark! These Terms of Service ("Terms") govern your use of our website and services ("Service"). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
        <h4>2. User Accounts</h4>
        <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
        <h4>3. Use of Service</h4>
        <p>You are granted a non-exclusive, non-transferable, revocable license to access and use our Service strictly in accordance with these Terms. You may not use the service for any purpose that is unlawful or prohibited by these Terms, and you may not use the Service in any manner that could damage, disable, overburden, or impair the Service.</p>
        <h4>4. Intellectual Property</h4>
        <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Ladamark, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Ladamark, Inc.</p>
        <h4>5. Termination</h4>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
        <h4>6. Usage Quotas</h4>
        <p>Use of the Service is subject to the following quotas based on your plan:</p>
        <ul>
            <li><strong>Free users:</strong> are allowed to label up to 5 images per day (resetting every 24 hours), with a monthly cap of 150 images.</li>
            <li><strong>Pro users:</strong> can label up to 20 images per day, with a monthly cap of 600 images.</li>
        </ul>
        <p>Daily quotas do not roll over. Unused quota for a given day expires at midnight (UTC) and does not accumulate.</p>
        <h4>7. Personal AI Usage Enabled</h4>
        <p>Each user’s AI labeling is powered securely through their own Gmail-based Gemini API. This means:</p>
        <ul>
            <li>Your quota and usage is based on your Google account.</li>
            <li>We never share your token or data with others.</li>
            <li>Labeling is performed in your own Gemini environment.</li>
        </ul>
        <p><strong>Note:</strong> You must be logged in via Gmail to enable AI labeling.</p>
    </div>
);

export const PrivacyContent: React.FC = () => (
    <div className="space-y-6 text-[var(--text-secondary)]">
        <p className="text-sm text-[var(--text-muted)]">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <p>Your privacy is our priority. We are committed to transparency and protecting your data. This policy outlines our key practices in simple terms.</p>
        
        <div className="space-y-5">
            <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Data Ownership & Our Promise</h4>
                <p className="mt-1 text-sm">You retain <strong>100% ownership</strong> of your uploaded images ("Your Content") and the AI-generated data. We will <strong>never</strong> use Your Content to train our global AI models without your explicit, opt-in consent. Your data is not used to benefit other customers.</p>
            </div>
            <div>
                <h4 className="font-semibold text-[var(--text-primary)]">What We Collect</h4>
                <p className="mt-1 text-sm">We collect your account info (name, email), Your Content, and the resulting AI-data, solely to operate and improve the service for you.</p>
            </div>
            <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Usage Quotas and Data Processing</h4>
                <p className="mt-1 text-sm">To provide our AI labeling services, we process your images subject to the usage limits of your plan. These are:</p>
                <ul className="list-disc list-inside mt-2 text-sm pl-4 space-y-1">
                    <li><strong>Free users:</strong> are allowed to label up to 5 images per day (resetting every 24 hours), with a monthly cap of 150 images.</li>
                    <li><strong>Pro users:</strong> can label up to 20 images per day, with a monthly cap of 600 images.</li>
                </ul>
                <p className="mt-2 text-sm">Daily quotas do not roll over. Unused quota for a given day expires at midnight (UTC) and does not accumulate.</p>
            </div>
            <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Personal AI Usage Enabled</h4>
                <p className="mt-1 text-sm">Each user’s AI labeling is powered securely through their own Gmail-based Gemini API. This means:</p>
                <ul className="list-disc list-inside mt-2 text-sm pl-4 space-y-1">
                    <li>Your quota and usage is based on your Google account.</li>
                    <li>We never share your token or data with others.</li>
                    <li>Labeling is performed in your own Gemini environment.</li>
                </ul>
                <p className="mt-2 text-sm"><strong>Note:</strong> You must be logged in via Gmail to enable AI labeling.</p>
            </div>
            <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Data Sharing & Security</h4>
                <p className="mt-1 text-sm">We do not sell your data. It is only shared with trusted service providers (e.g., for cloud hosting) for operational purposes or when legally required. We employ robust security, including end-to-end encryption, to protect your data from unauthorized access.</p>
            </div>
             <div>
                <h4 className="font-semibold text-[var(--text-primary)]">Your Control</h4>
                <p className="mt-1 text-sm">You can access, edit, and delete your content and account information at any time through your dashboard.</p>
            </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-primary)] pt-6">
            <p className="text-sm">For any questions about this policy or your data, please contact us. We're here to help.</p>
            <p className="text-sm mt-2"><strong>Email:</strong> <a href="mailto:privacy@ladamark.ai" className="font-semibold text-[var(--accent-primary)] hover:underline">privacy@ladamark.ai</a></p>
        </div>
    </div>
);