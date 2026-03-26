/**
 * Color utilities module
 * Конвертация между форматами и генерация цветовых гармоний
 */

const ColorUtils = {
    /**
     * Конвертирует HEX в RGB
     * @param {string} hex - HEX цвет (например #ff0000)
     * @returns {{r: number, g: number, b: number}}
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return null;
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    },

    /**
     * Конвертирует RGB в HEX
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {string}
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    /**
     * Конвертирует HEX в HSL
     * @param {string} hex - HEX цвет
     * @returns {{h: number, s: number, l: number}}
     */
    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return null;

        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s;
        const l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    /**
     * Конвертирует HSL в HEX
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {string}
     */
    hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
    },

    /**
     * Конвертирует RGB в HSL
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {{h: number, s: number, l: number}}
     */
    rgbToHsl(r, g, b) {
        const hex = this.rgbToHex(r, g, b);
        return this.hexToHsl(hex);
    },

    /**
     * Конвертирует HSL в RGB
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {{r: number, g: number, b: number}}
     */
    hslToRgb(h, s, l) {
        const hex = this.hslToHex(h, s, l);
        return this.hexToRgb(hex);
    },

    /**
     * Парсит строку RGB в объект
     * @param {string} rgbString - Строка вида "rgb(255, 0, 0)" или "255, 0, 0"
     * @returns {{r: number, g: number, b: number} | null}
     */
    parseRgbString(rgbString) {
        const match = rgbString.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (!match) return null;
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10)
        };
    },

    /**
     * Парсит строку HSL в объект
     * @param {string} hslString - Строка вида "hsl(360, 100%, 50%)" или "360, 100, 50"
     * @returns {{h: number, s: number, l: number} | null}
     */
    parseHslString(hslString) {
        const match = hslString.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
        if (!match) return null;
        return {
            h: parseInt(match[1], 10),
            s: parseInt(match[2], 10),
            l: parseInt(match[3], 10)
        };
    },

    /**
     * Проверяет валидность HEX цвета
     * @param {string} hex
     * @returns {boolean}
     */
    isValidHex(hex) {
        return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
    },

    /**
     * Нормализует HEX (добавляет # и расширяет краткую форму)
     * @param {string} hex
     * @returns {string | null}
     */
    normalizeHex(hex) {
        hex = hex.trim();
        if (!hex.startsWith('#')) {
            hex = '#' + hex;
        }
        if (!this.isValidHex(hex)) return null;
        
        // Краткая форма #fff -> #ffffff
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        return hex.toLowerCase();
    },

    /**
     * Генерирует случайный HEX цвет
     * @returns {string}
     */
    randomHex() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    },

    /**
     * Определяет, светлый ли цвет (для выбора цвета текста)
     * @param {string} hex
     * @returns {boolean}
     */
    isLight(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return false;
        // Формула воспринимаемой яркости
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128;
    },

    /**
     * Получает контрастный цвет текста для фона
     * @param {string} hex
     * @returns {string}
     */
    getContrastColor(hex) {
        return this.isLight(hex) ? '#1a1d23' : '#ffffff';
    },

    /**
     * Поворачивает hue на заданный угол
     * @param {number} h - Hue (0-360)
     * @param {number} degrees - Угол поворота
     * @returns {number}
     */
    rotateHue(h, degrees) {
        return ((h + degrees) % 360 + 360) % 360;
    },

    // === ГЕНЕРАЦИЯ ЦВЕТОВЫХ ГАРМОНИЙ ===

    /**
     * Генерирует комплементарную гармонию (2 цвета)
     * @param {string} baseHex - Базовый цвет
     * @returns {string[]}
     */
    complementary(baseHex) {
        const hsl = this.hexToHsl(baseHex);
        if (!hsl) return [baseHex];
        
        return [
            baseHex,
            this.hslToHex(this.rotateHue(hsl.h, 180), hsl.s, hsl.l)
        ];
    },

    /**
     * Генерирует аналоговую гармонию (3 цвета)
     * @param {string} baseHex - Базовый цвет
     * @returns {string[]}
     */
    analogous(baseHex) {
        const hsl = this.hexToHsl(baseHex);
        if (!hsl) return [baseHex];
        
        return [
            this.hslToHex(this.rotateHue(hsl.h, -30), hsl.s, hsl.l),
            baseHex,
            this.hslToHex(this.rotateHue(hsl.h, 30), hsl.s, hsl.l)
        ];
    },

    /**
     * Генерирует триадную гармонию (3 цвета)
     * @param {string} baseHex - Базовый цвет
     * @returns {string[]}
     */
    triadic(baseHex) {
        const hsl = this.hexToHsl(baseHex);
        if (!hsl) return [baseHex];
        
        return [
            baseHex,
            this.hslToHex(this.rotateHue(hsl.h, 120), hsl.s, hsl.l),
            this.hslToHex(this.rotateHue(hsl.h, 240), hsl.s, hsl.l)
        ];
    },

    /**
     * Генерирует квадратную гармонию (4 цвета)
     * @param {string} baseHex - Базовый цвет
     * @returns {string[]}
     */
    square(baseHex) {
        const hsl = this.hexToHsl(baseHex);
        if (!hsl) return [baseHex];
        
        return [
            baseHex,
            this.hslToHex(this.rotateHue(hsl.h, 90), hsl.s, hsl.l),
            this.hslToHex(this.rotateHue(hsl.h, 180), hsl.s, hsl.l),
            this.hslToHex(this.rotateHue(hsl.h, 270), hsl.s, hsl.l)
        ];
    },

    /**
     * Генерирует монохромную гармонию (5 оттенков)
     * @param {string} baseHex - Базовый цвет
     * @returns {string[]}
     */
    monochromatic(baseHex) {
        const hsl = this.hexToHsl(baseHex);
        if (!hsl) return [baseHex];
        
        return [
            this.hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 40)),
            this.hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 20)),
            baseHex,
            this.hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 20)),
            this.hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 40))
        ];
    },

    /**
     * Генерирует разделённо-комплементарную гармонию (3 цвета)
     * @param {string} baseHex - Базовый цвет
     * @returns {string[]}
     */
    splitComplementary(baseHex) {
        const hsl = this.hexToHsl(baseHex);
        if (!hsl) return [baseHex];
        
        return [
            baseHex,
            this.hslToHex(this.rotateHue(hsl.h, 150), hsl.s, hsl.l),
            this.hslToHex(this.rotateHue(hsl.h, 210), hsl.s, hsl.l)
        ];
    },

    /**
     * Генерирует тетрадную гармонию (4 цвета)
     * @param {string} baseHex - Базовый цвет
     * @returns {string[]}
     */
    tetradic(baseHex) {
        const hsl = this.hexToHsl(baseHex);
        if (!hsl) return [baseHex];
        
        return [
            baseHex,
            this.hslToHex(this.rotateHue(hsl.h, 60), hsl.s, hsl.l),
            this.hslToHex(this.rotateHue(hsl.h, 180), hsl.s, hsl.l),
            this.hslToHex(this.rotateHue(hsl.h, 240), hsl.s, hsl.l)
        ];
    },

    /**
     * Генерирует палитру на основе выбранной гармонии
     * @param {string} harmony - Тип гармонии
     * @param {string} baseHex - Базовый цвет (опционально)
     * @returns {string[]}
     */
    generatePalette(harmony, baseHex = null) {
        // Если нет базового цвета, генерируем случайный
        if (!baseHex) {
            baseHex = this.randomHex();
        }

        const generators = {
            'complementary': () => this.complementary(baseHex),
            'analogous': () => this.analogous(baseHex),
            'triadic': () => this.triadic(baseHex),
            'square': () => this.square(baseHex),
            'monochromatic': () => this.monochromatic(baseHex),
            'split-complementary': () => this.splitComplementary(baseHex),
            'tetradic': () => this.tetradic(baseHex),
            'random': () => {
                const harmonies = ['complementary', 'analogous', 'triadic', 'square', 'monochromatic', 'split-complementary', 'tetradic'];
                const randomHarmony = harmonies[Math.floor(Math.random() * harmonies.length)];
                return this.generatePalette(randomHarmony, baseHex);
            }
        };

        const generator = generators[harmony] || generators.random;
        return generator();
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorUtils;
}
