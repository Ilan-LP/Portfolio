/**
 * Parses a hex color string (#RRGGBB or #RGB) into HSL components.
 * Returns [hue (0-360), saturation (0-100), lightness (0-100)].
 */
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

/**
 * Adapts a hex color so it remains legible against the current theme background.
 *
 * - Dark theme  : if the color is too dark (L < 45) it is lightened to L = 65.
 * - Light theme : if the color is too light (L > 60) it is darkened to L = 35.
 *
 * The hue and saturation are preserved so the color identity stays the same.
 */
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

    if (newL === l) return clean; // no change needed

    return `hsl(${h}, ${s}%, ${newL}%)`;
}

/**
 * Returns a CSS filter string to make an icon image legible against the
 * current theme background, using the icon's associated brand color as a hint.
 *
 * - Dark theme + dark color (L < 45) : brighten the icon (brightness + invert-aware)
 * - Light theme + light color (L > 65): darken the icon
 * - Otherwise: no filter needed
 *
 * Falls back to a generic theme-based filter when no color is provided.
 */
export function getIconFilter(color: string | undefined, isDark: boolean): string | undefined {
    if (!color) {
        // No color hint: apply a conservative generic filter
        return isDark ? 'brightness(1.6)' : undefined;
    }

    const clean = color.trim();
    if (!clean.startsWith('#') || (clean.length !== 4 && clean.length !== 7)) {
        return isDark ? 'brightness(1.6)' : undefined;
    }

    const [, , l] = hexToHsl(clean);

    if (isDark && l < 45) {
        // Very dark icon on dark background → brighten strongly
        return l < 15 ? 'brightness(0) invert(1)' : 'brightness(2)';
    }

    if (!isDark && l > 65) {
        // Very light icon on light background → darken
        return l > 85 ? 'brightness(0)' : 'brightness(0.3)';
    }

    return undefined; // icon already legible
}
