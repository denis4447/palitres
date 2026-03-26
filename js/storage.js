/**
 * Storage module
 * Работа с LocalStorage для сохранения палитр
 */

const Storage = {
    KEYS: {
        CURRENT_PALETTE: 'palitres_current_palette',
        SAVED_PALETTES: 'palitres_saved_palettes'
    },

    /**
     * Сохраняет текущую палитру
     * @param {Array} palette - Массив цветовых объектов
     */
    saveCurrentPalette(palette) {
        try {
            localStorage.setItem(this.KEYS.CURRENT_PALETTE, JSON.stringify(palette));
        } catch (e) {
            console.error('Ошибка сохранения текущей палитры:', e);
        }
    },

    /**
     * Загружает текущую палитру
     * @returns {Array | null}
     */
    loadCurrentPalette() {
        try {
            const data = localStorage.getItem(this.KEYS.CURRENT_PALETTE);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка загрузки текущей палитры:', e);
            return null;
        }
    },

    /**
     * Сохраняет палитру в список сохранённых
     * @param {Object} paletteData - Данные палитры
     */
    savePalette(paletteData) {
        try {
            const palettes = this.getSavedPalettes();
            
            // Проверяем, существует ли уже палитра с таким ID
            const existingIndex = palettes.findIndex(p => p.id === paletteData.id);
            
            if (existingIndex >= 0) {
                // Обновляем существующую
                palettes[existingIndex] = {
                    ...paletteData,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // Добавляем новую
                palettes.push({
                    ...paletteData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem(this.KEYS.SAVED_PALETTES, JSON.stringify(palettes));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения палитры:', e);
            return false;
        }
    },

    /**
     * Загружает все сохранённые палитры
     * @returns {Array}
     */
    getSavedPalettes() {
        try {
            const data = localStorage.getItem(this.KEYS.SAVED_PALETTES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Ошибка загрузки сохранённых палитр:', e);
            return [];
        }
    },

    /**
     * Загружает конкретную палитру по ID
     * @param {string} id - ID палитры
     * @returns {Object | null}
     */
    getPaletteById(id) {
        const palettes = this.getSavedPalettes();
        return palettes.find(p => p.id === id) || null;
    },

    /**
     * Удаляет палитру по ID
     * @param {string} id - ID палитры
     * @returns {boolean}
     */
    deletePalette(id) {
        try {
            const palettes = this.getSavedPalettes();
            const filtered = palettes.filter(p => p.id !== id);
            localStorage.setItem(this.KEYS.SAVED_PALETTES, JSON.stringify(filtered));
            return true;
        } catch (e) {
            console.error('Ошибка удаления палитры:', e);
            return false;
        }
    },

    /**
     * Генерирует уникальный ID для палитры
     * @returns {string}
     */
    generateId() {
        return 'palette_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Очищает все сохранённые данные
     */
    clearAll() {
        try {
            localStorage.removeItem(this.KEYS.CURRENT_PALETTE);
            localStorage.removeItem(this.KEYS.SAVED_PALETTES);
            return true;
        } catch (e) {
            console.error('Ошибка очистки данных:', e);
            return false;
        }
    },

    /**
     * Экспортирует палитру в JSON строку
     * @param {Object} paletteData - Данные палитры
     * @returns {string}
     */
    exportToJson(paletteData) {
        return JSON.stringify(paletteData, null, 2);
    },

    /**
     * Импортирует палитру из JSON строки
     * @param {string} jsonString - JSON строка
     * @returns {Object | null}
     */
    importFromJson(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Валидация структуры
            if (!data.colors || !Array.isArray(data.colors)) {
                throw new Error('Неверная структура JSON');
            }
            
            // Нормализация цветов
            const normalizedColors = data.colors.map(color => {
                const hex = ColorUtils.normalizeHex(color.hex || color.value || color);
                if (!hex) return null;
                
                return {
                    hex: hex,
                    name: color.name || '',
                    type: color.type || 'custom'
                };
            }).filter(c => c !== null);
            
            if (normalizedColors.length === 0) {
                throw new Error('Нет валидных цветов в JSON');
            }
            
            return {
                id: data.id || this.generateId(),
                name: data.name || 'Импортированная палитра',
                colors: normalizedColors
            };
        } catch (e) {
            console.error('Ошибка импорта JSON:', e);
            return null;
        }
    },

    /**
     * Экспортирует палитру в формате CSS переменных
     * @param {Object} paletteData - Данные палитры
     * @returns {string}
     */
    exportToCss(paletteData) {
        let css = `/* ${paletteData.name || 'Palette'} */\n`;
        css += `:root {\n`;
        
        paletteData.colors.forEach((color, index) => {
            const varName = color.name 
                ? color.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
                : `color-${index + 1}`;
            css += `  --${varName}: ${color.hex};\n`;
        });
        
        css += `}\n`;
        return css;
    },

    /**
     * Экспортирует палитру в формате Figma Design Tokens
     * @param {Object} paletteData - Данные палитры
     * @returns {Object}
     */
    exportToFigmaTokens(paletteData) {
        const tokens = {
            [paletteData.name || 'Palette']: {
                $type: 'color',
                $value: {}
            }
        };
        
        paletteData.colors.forEach((color, index) => {
            const tokenName = color.name 
                ? color.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
                : `color-${index + 1}`;
            
            tokens[paletteData.name || 'Palette'][tokenName] = {
                $type: 'color',
                $value: color.hex,
                $description: color.type || 'Custom color'
            };
        });
        
        return tokens;
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
