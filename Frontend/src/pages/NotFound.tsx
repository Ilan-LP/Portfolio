import { SEO, ErrorState } from '@/components/index.ts';

export default function NotFound() {
    return (
        <div className="page">
            <SEO title="404" description="Page non trouvée" />
            <ErrorState status={404} />
        </div>
    );
}
