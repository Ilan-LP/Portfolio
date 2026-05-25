function hexToHsl(hex: string): [number, number, number] {
    let h = hex.slice(1);
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];

    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let hue = 0;
    let sat = 0;

    if (max !== min) {
        const d = max - min;
        sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                hue = ((b - r) / d + 2) / 6;
                break;
            case b:
                hue = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return [Math.round(hue * 360), Math.round(sat * 100), Math.round(l * 100)];
}

export function adaptColorToTheme(color: string | undefined, isDark: boolean): string | undefined {
    if (!color) return undefined;

    const clean = color.trim();
    if (!clean.startsWith('#') || (clean.length !== 4 && clean.length !== 7)) return clean;

    const [h, s, l] = hexToHsl(clean);

    let newL = l;
    if (isDark && l < 45) {
        newL = 65;
    } else if (!isDark && l > 60) {
        newL = 35;
    }

    if (newL === l) return clean;

    return `hsl(${h}, ${s}%, ${newL}%)`;
}

export function getIconFilter(color: string | undefined, isDark: boolean): string | undefined {
    if (!color) {
        return isDark ? 'brightness(1.6)' : undefined;
    }

    const clean = color.trim();
    if (!clean.startsWith('#') || (clean.length !== 4 && clean.length !== 7)) {
        return isDark ? 'brightness(1.6)' : undefined;
    }

    const [, , l] = hexToHsl(clean);

    if (isDark && l < 45) {
        return 'brightness(0) invert(1)';
    }

    if (!isDark && l > 65) {
        return l > 85 ? 'brightness(0)' : 'brightness(0.3)';
    }

    return undefined;
}
