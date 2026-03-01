import { useState } from 'react';
import { SEO, PageHeader } from '@/components/index.ts';
import { sendContact } from '@/services/api.ts';
import './Contact.css';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        const payload = {
            name: String(data.get('name') ?? ''),
            email: String(data.get('email') ?? ''),
            subject: String(data.get('subject') ?? ''),
            message: String(data.get('message') ?? ''),
        };

        setStatus('loading');
        setErrorMessage('');

        try {
            await sendContact(payload);
            setStatus('success');
            form.reset();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer';
            setErrorMessage(message);
            setStatus('error');
        }
    };

    return (
        <div className="page contact">
            <SEO title="Contact" description="Contacter Ilan LP" />
            <PageHeader title="Contact" subtitle="Un projet, une mission ou une opportunité de stage ? Écrivez-moi, je vous répondrai avec plaisir !" />

            {status === 'success' && (
                <div className="contact__success">
                    Votre message a bien été envoyé ! Je vous répondrai dans les plus brefs délais
                </div>
            )}

            {status === 'error' && (
                <div className="contact__error">
                    {errorMessage}
                </div>
            )}

            <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__field">
                    <label className="contact__label" htmlFor="name">
                        Nom
                    </label>
                    <input
                        className="contact__input"
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Votre nom"
                    />
                </div>

                <div className="contact__field">
                    <label className="contact__label" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="contact__input"
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="votre@email.com"
                    />
                </div>

                <div className="contact__field">
                    <label className="contact__label" htmlFor="subject">
                        Sujet
                    </label>
                    <input
                        className="contact__input"
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        placeholder="Sujet du message"
                    />
                </div>

                <div className="contact__field">
                    <label className="contact__label" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        className="contact__input contact__textarea"
                        id="message"
                        name="message"
                        required
                        rows={6}
                        placeholder="Votre message..."
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn--primary contact__submit"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
                </button>
            </form>
        </div>
    );
}
