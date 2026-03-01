import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

/**
 * @openapi
 * /contact:
 *   post:
 *     tags: [Contact]
 *     summary: Send a contact email
 *     description: Sends an email to the portfolio owner using the submitted contact form data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               subject:
 *                 type: string
 *                 example: Stage en développement
 *               message:
 *                 type: string
 *                 example: Bonjour, je souhaite...
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/contact', async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body as {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
    };

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required: name, email, subject, message' });
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
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.sendMail({
            from: `"Portfolio – ${name}" <${SMTP_FROM ?? SMTP_USER}>`,
            to: CONTACT_TO ?? SMTP_USER,
            replyTo: email,
            subject: `[Contact Portfolio] ${subject}`,
            text: `De : ${name}\nEmail : ${email}\n\n${message}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px;">
                    <h2 style="color: #333;">Nouveau message de contact</h2>
                    <p><strong>Nom :</strong> ${name}</p>
                    <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Sujet :</strong> ${subject}</p>
                    <hr style="border: 1px solid #eee;" />
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        });

        res.json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ error: 'Failed to send the email. Please try again later.' });
    }
});

export default router;
