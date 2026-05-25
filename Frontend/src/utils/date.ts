export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
    });
}

export function formatDateRange(start: string, end: string | null): string {
    const s = formatDate(start);
    const e = end ? formatDate(end) : 'Présent';
    return `${s} — ${e}`;
}
