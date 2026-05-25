import { useState } from 'react';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';
import { SEO, PageHeader } from '@/components/index.ts';
import { sendContact } from '@/services/api.ts';
import './Contact.css';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const contactItems = [
    { icon: Mail,     label: 'Email',      value: 'ilanlp.pro@gmail.com',           href: 'mailto:ilanlp.pro@gmail.com',          external: false },
    { icon: Phone,    label: 'Téléphone',  value: '06 14 57 49 84',                 href: 'tel:+33614574984',                     external: false },
    { icon: Linkedin, label: 'LinkedIn',   value: 'ilan-lp',                        href: 'https://www.linkedin.com/in/ilan-lp',  external: true  },
    { icon: Github,   label: 'GitHub',     value: 'Ilan-LP',                        href: 'https://github.com/Ilan-LP',           external: true  },
    { icon: Globe,    label: 'Entreprise', value: 'nexus-i.fr',                     href: 'https://nexus-i.fr',                   external: true  },
] as const;

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

            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1">
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

                <div className="flex-1 flex flex-col gap-6">
                    <h2 className="text-[2rem] font-bold tracking-[-0.03em] leading-[1.2] text-[var(--color-text)]">
                        Me contacter
                    </h2>
                    <div className="flex flex-col gap-4">
                        {contactItems.map(({ icon: Icon, label, value, href, external }) => (
                            <a
                                key={label}
                                href={href}
                                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className="flex items-center gap-4 !p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] no-underline transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-text-tertiary)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                            >
                                <Icon size={20} className="shrink-0 text-[var(--color-text-secondary)]" />
                                <div>
                                    <p className="text-xs font-medium text-[var(--color-text-tertiary)]">{label}</p>
                                    <p className="text-sm font-medium text-[var(--color-text)]">{value}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
