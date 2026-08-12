import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const router = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
    name: 120,
    email: 254,
    subject: 150,
    message: 5000,
};

function sanitize(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

// For fields that end up in email headers (From display name, Subject),
// strip CR/LF/TAB so a crafted value can't inject extra headers.
function sanitizeSingleLine(value: unknown): string {
    return sanitize(value).replace(/[\r\n\t]+/g, ' ');
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Stricter limit than the general /api rate limiter: this endpoint sends
// real emails through SMTP, so it needs its own ceiling to avoid spam /
// SMTP-provider throttling from a burst of submissions.
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

router.post('/contact', contactLimiter, async (req: Request, res: Response) => {
    const name = sanitizeSingleLine(req.body?.name);
    const email = sanitize(req.body?.email);
    const subject = sanitizeSingleLine(req.body?.subject);
    const message = sanitize(req.body?.message);
    // Honeypot: a hidden form field real users never fill in. Bots that
    // auto-fill every field will trip it.
    const website = sanitize(req.body?.website);

    if (website) {
        return res.json({ message: 'Your message has been sent successfully!' });
    }

    if (
        !name ||
        !email ||
        !subject ||
        !message ||
        !emailRegex.test(email) ||
        name.length > LIMITS.name ||
        email.length > LIMITS.email ||
        subject.length > LIMITS.subject ||
        message.length > LIMITS.message
    ) {
        return res.status(400).json({ error: 'Invalid contact payload.' });
    }

    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
        SMTP_FROM,
        CONTACT_TO,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        console.error('SMTP configuration is missing from environment variables');
        return res.status(500).json({ error: 'Email service is not configured' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: Number(SMTP_PORT) === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Portfolio Contact" <${SMTP_FROM ?? SMTP_USER}>`,
            to: CONTACT_TO ?? SMTP_USER,
            replyTo: email,
            subject: `[Contact Portfolio] ${subject}`,
            text: `De : ${name}\nEmail : ${email}\n\n${message}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px;">
                    <h2 style="color: #333;">Nouveau message de contact</h2>
                    <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
                    <p><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
                    <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
                    <hr style="border: 1px solid #eee;" />
                    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
                </div>
            `,
        });

        res.json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ error: 'Failed to send the email. Please try again later' });
    }
});

export default router;
