import { useState } from 'react';
import { SEO, PageHeader } from '@/components/index.ts';
import './Contact.css';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);

        // Build a mailto link as a simple contact mechanism (no backend route needed)
        const subject = encodeURIComponent(String(data.get('subject') ?? 'Contact'));
        const body = encodeURIComponent(
            `De : ${data.get('name')}\nEmail : ${data.get('email')}\n\n${data.get('message')}`,
        );

        window.location.href = `mailto:ilanlp.pro@gmail.com?subject=${subject}&body=${body}`;
        setSubmitted(true);
        form.reset();
    };

    return (
        <div className="page contact">
            <SEO title="Contact" description="Contacter Ilan LP" />
            <PageHeader title="Contact" subtitle="Un projet, une mission ou une opportunité de stage ? Écrivez-moi, je vous répondrai avec plaisir !" />

            {submitted && (
                <div className="contact__success">
                    Votre client mail s'est ouvert avec le message pré-rempli. Merci !
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

                <button type="submit" className="btn btn--primary contact__submit">
                    Envoyer
                </button>
            </form>
        </div>
    );
}
