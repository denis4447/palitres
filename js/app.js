/**
 * Main application module
 * Основная логика приложения Palitres
 */

const App = {
    // Состояние приложения
    state: {
        currentPalette: {
            id: null,
            name: 'Моя палитра',
            colors: []
        },
        editingColorIndex: null,
        modalColorInput: null
    },

    // DOM элементы
    elements: {},

    /**
     * Инициализация приложения
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadCurrentPalette();
        this.renderPalette();
        this.renderSavedPalettes();
    },

    /**
     * Кэширование DOM элементов
     */
    cacheElements() {
        this.elements = {
            // Controls
            harmonySelect: document.getElementById('harmony-select'),
            generateBtn: document.getElementById('generate-btn'),
            addColorBtn: document.getElementById('add-color-btn'),
            
            // Palette
            paletteNameInput: document.getElementById('palette-name'),
            paletteContainer: document.getElementById('palette-container'),
            
            // Export/Import
            exportJsonBtn: document.getElementById('export-json'),
            exportCssBtn: document.getElementById('export-css'),
            exportFigmaBtn: document.getElementById('export-figma'),
            importFileInput: document.getElementById('import-file'),
            
            // Saved palettes
            savedPalettesContainer: document.getElementById('saved-palettes'),
            
            // Modal
            modal: document.getElementById('color-modal'),
            modalClose: document.querySelector('.modal-close'),
            modalColorPreview: document.getElementById('modal-color-preview'),
            modalHex: document.getElementById('modal-hex'),
            modalRgb: document.getElementById('modal-rgb'),
            modalHsl: document.getElementById('modal-hsl'),
            modalName: document.getElementById('modal-name'),
            modalType: document.getElementById('modal-type'),
            modalSave: document.getElementById('modal-save'),
            modalDelete: document.getElementById('modal-delete'),
            
            // Toast
            toastContainer: document.getElementById('toast-container')
        };
    },

    /**
     * Привязка событий
     */
    bindEvents() {
        // Генерация палитры
        this.elements.generateBtn.addEventListener('click', () => this.generatePalette());
        this.elements.harmonySelect.addEventListener('change', () => this.generatePalette());
        
        // Добавление цвета
        this.elements.addColorBtn.addEventListener('click', () => this.addColor());
        
        // Изменение названия палитры
        this.elements.paletteNameInput.addEventListener('input', (e) => {
            this.state.currentPalette.name = e.target.value;
            this.saveCurrentPalette();
        });
        
        // Экспорт
        this.elements.exportJsonBtn.addEventListener('click', () => this.exportJson());
        this.elements.exportCssBtn.addEventListener('click', () => this.exportCss());
        this.elements.exportFigmaBtn.addEventListener('click', () => this.exportFigma());
        
        // Импорт
        this.elements.importFileInput.addEventListener('change', (e) => this.importJson(e));
        
        // Модальное окно
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });
        this.elements.modalSave.addEventListener('click', () => this.saveColorFromModal());
        this.elements.modalDelete.addEventListener('click', () => this.deleteColorFromModal());
        
        // Обновление цвета в модальном окне при вводе
        this.elements.modalHex.addEventListener('input', (e) => {
            const hex = ColorUtils.normalizeHex(e.target.value);
            if (hex) {
                this.elements.modalColorPreview.style.backgroundColor = hex;
                this.updateModalInputs(hex);
            }
        });
        
        // Синхронизация при загрузке страницы из других вкладок
        window.addEventListener('storage', () => {
            this.loadCurrentPalette();
            this.renderPalette();
            this.renderSavedPalettes();
        });
    },

    /**
     * Загрузка текущей палитры из LocalStorage
     */
    loadCurrentPalette() {
        const saved = Storage.loadCurrentPalette();
        if (saved && saved.colors && saved.colors.length > 0) {
            this.state.currentPalette = {
                id: saved.id || Storage.generateId(),
                name: saved.name || 'Моя палитра',
                colors: saved.colors
            };
        } else {
            // Генерируем начальную палитру
            this.generatePalette('random');
        }
        this.elements.paletteNameInput.value = this.state.currentPalette.name;
    },

    /**
     * Сохранение текущей палитры
     */
    saveCurrentPalette() {
        Storage.saveCurrentPalette(this.state.currentPalette);
    },

    /**
     * Генерация палитры
     * @param {string} harmony - Тип гармонии (опционально)
     */
    generatePalette(harmony) {
        const selectedHarmony = harmony || this.elements.harmonySelect.value;
        const colors = ColorUtils.generatePalette(selectedHarmony);
        
        this.state.currentPalette = {
            id: Storage.generateId(),
            name: this.elements.paletteNameInput.value || 'Моя палитра',
            colors: colors.map(hex => ({
                hex: hex,
                name: '',
                type: 'custom'
            }))
        };
        
        this.saveCurrentPalette();
        this.renderPalette();
        this.showToast('Палитра сгенерирована!', 'success');
    },

    /**
     * Добавление нового цвета
     */
    addColor() {
        const newColor = {
            hex: ColorUtils.randomHex(),
            name: '',
            type: 'custom'
        };
        
        this.state.currentPalette.colors.push(newColor);
        this.saveCurrentPalette();
        this.renderPalette();
        this.showToast('Цвет добавлен', 'success');
    },

    /**
     * Рендеринг палитры
     */
    renderPalette() {
        const container = this.elements.paletteContainer;
        container.innerHTML = '';
        
        this.state.currentPalette.colors.forEach((color, index) => {
            const card = this.createColorCard(color, index);
            container.appendChild(card);
        });
    },

    /**
     * Создание карточки цвета
     * @param {Object} color - Объект цвета
     * @param {number} index - Индекс цвета
     * @returns {HTMLElement}
     */
    createColorCard(color, index) {
        const card = document.createElement('div');
        card.className = 'color-card';
        
        const textColor = ColorUtils.getContrastColor(color.hex);
        const hsl = ColorUtils.hexToHsl(color.hex);
        const rgb = ColorUtils.hexToRgb(color.hex);
        
        card.innerHTML = `
            <div class="color-swatch" style="background-color: ${color.hex}"></div>
            <div class="color-info">
                <div class="color-hex">${color.hex.toUpperCase()}</div>
                ${color.name ? `<div class="color-name">${color.name}</div>` : ''}
                ${color.type !== 'custom' ? `<div class="color-type">${color.type}</div>` : ''}
            </div>
            <div class="color-actions">
                <button class="color-action-btn edit-btn" title="Редактировать">✏️</button>
                <button class="color-action-btn delete-btn" title="Удалить">🗑️</button>
            </div>
            <div class="copy-feedback">Скопировано!</div>
        `;
        
        // Копирование HEX при клике на карточку
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.color-action-btn')) {
                this.copyToClipboard(color.hex);
                const feedback = card.querySelector('.copy-feedback');
                feedback.classList.add('show');
                setTimeout(() => feedback.classList.remove('show'), 1000);
            }
        });
        
        // Редактирование
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.openModal(index);
        });
        
        // Удаление
        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteColor(index);
        });
        
        return card;
    },

    /**
     * Удаление цвета
     * @param {number} index - Индекс цвета
     */
    deleteColor(index) {
        if (this.state.currentPalette.colors.length <= 1) {
            this.showToast('В палитре должен быть хотя бы один цвет', 'error');
            return;
        }
        
        this.state.currentPalette.colors.splice(index, 1);
        this.saveCurrentPalette();
        this.renderPalette();
        this.showToast('Цвет удалён', 'success');
    },

    /**
     * Открытие модального окна редактирования
     * @param {number} index - Индекс цвета
     */
    openModal(index) {
        this.state.editingColorIndex = index;
        const color = this.state.currentPalette.colors[index];
        
        const hsl = ColorUtils.hexToHsl(color.hex);
        const rgb = ColorUtils.hexToRgb(color.hex);
        
        this.state.modalColorInput = { ...color };
        
        this.elements.modalColorPreview.style.backgroundColor = color.hex;
        this.elements.modalHex.value = color.hex;
        this.elements.modalRgb.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.elements.modalHsl.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        this.elements.modalName.value = color.name || '';
        this.elements.modalType.value = color.type || 'custom';
        
        this.elements.modal.classList.remove('hidden');
    },

    /**
     * Закрытие модального окна
     */
    closeModal() {
        this.elements.modal.classList.add('hidden');
        this.state.editingColorIndex = null;
        this.state.modalColorInput = null;
    },

    /**
     * Обновление полей модального окна
     * @param {string} hex - HEX цвет
     */
    updateModalInputs(hex) {
        const hsl = ColorUtils.hexToHsl(hex);
        const rgb = ColorUtils.hexToRgb(hex);
        
        this.elements.modalRgb.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.elements.modalHsl.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    },

    /**
     * Сохранение цвета из модального окна
     */
    saveColorFromModal() {
        const index = this.state.editingColorIndex;
        if (index === null) return;
        
        const hex = ColorUtils.normalizeHex(this.elements.modalHex.value);
        if (!hex) {
            this.showToast('Неверный формат HEX', 'error');
            return;
        }
        
        this.state.currentPalette.colors[index] = {
            hex: hex,
            name: this.elements.modalName.value,
            type: this.elements.modalType.value
        };
        
        this.saveCurrentPalette();
        this.renderPalette();
        this.closeModal();
        this.showToast('Цвет сохранён', 'success');
    },

    /**
     * Удаление цвета из модального окна
     */
    deleteColorFromModal() {
        const index = this.state.editingColorIndex;
        if (index === null) return;
        
        this.closeModal();
        this.deleteColor(index);
    },

    /**
     * Копирование в буфер обмена
     * @param {string} text - Текст для копирования
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Успех
        }).catch(() => {
            // Фолбэк для старых браузеров
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    },

    /**
     * Экспорт в JSON
     */
    exportJson() {
        const json = Storage.exportToJson(this.state.currentPalette);
        this.downloadFile(json, `${this.state.currentPalette.name}.json`, 'application/json');
        this.showToast('JSON экспортирован', 'success');
    },

    /**
     * Экспорт в CSS
     */
    exportCss() {
        const css = Storage.exportToCss(this.state.currentPalette);
        this.downloadFile(css, `${this.state.currentPalette.name}.css`, 'text/css');
        this.showToast('CSS экспортирован', 'success');
    },

    /**
     * Экспорт в Figma Tokens
     */
    exportFigma() {
        const tokens = Storage.exportToFigmaTokens(this.state.currentPalette);
        const json = JSON.stringify(tokens, null, 2);
        this.downloadFile(json, `${this.state.currentPalette.name}-figma.json`, 'application/json');
        this.showToast('Figma Tokens экспортированы', 'success');
    },

    /**
     * Импорт из JSON
     * @param {Event} e - Событие изменения input file
     */
    importJson(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const imported = Storage.importFromJson(event.target.result);
            if (imported) {
                this.state.currentPalette = imported;
                this.saveCurrentPalette();
                this.renderPalette();
                this.elements.paletteNameInput.value = this.state.currentPalette.name;
                this.showToast('Палитра импортирована', 'success');
            } else {
                this.showToast('Ошибка импорта JSON', 'error');
            }
        };
        reader.onerror = () => {
            this.showToast('Ошибка чтения файла', 'error');
        };
        reader.readAsText(file);
        
        // Сброс input для возможности повторной загрузки того же файла
        e.target.value = '';
    },

    /**
     * Скачивание файла
     * @param {string} content - Содержимое файла
     * @param {string} filename - Имя файла
     * @param {string} mimeType - MIME тип
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Сохранение палитры в список сохранённых
     */
    saveToSaved() {
        const paletteData = {
            ...this.state.currentPalette,
            id: this.state.currentPalette.id || Storage.generateId()
        };
        
        if (Storage.savePalette(paletteData)) {
            this.renderSavedPalettes();
            this.showToast('Палитра сохранена', 'success');
        } else {
            this.showToast('Ошибка сохранения', 'error');
        }
    },

    /**
     * Рендеринг сохранённых палитр
     */
    renderSavedPalettes() {
        const container = this.elements.savedPalettesContainer;
        const palettes = Storage.getSavedPalettes();
        
        if (palettes.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Нет сохранённых палитр</p>';
            return;
        }
        
        container.innerHTML = '';
        
        palettes.forEach(palette => {
            const card = this.createSavedPaletteCard(palette);
            container.appendChild(card);
        });
    },

    /**
     * Создание карточки сохранённой палитры
     * @param {Object} palette - Данные палитры
     * @returns {HTMLElement}
     */
    createSavedPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'saved-palette-card';
        
        const colorsPreview = palette.colors.slice(0, 5).map(color => 
            `<div class="saved-palette-color" style="background-color: ${color.hex}"></div>`
        ).join('');
        
        card.innerHTML = `
            <div class="saved-palette-name">${palette.name}</div>
            <div class="saved-palette-preview">${colorsPreview}</div>
            <div class="saved-palette-actions">
                <button class="btn btn-secondary load-btn">Загрузить</button>
                <button class="btn btn-danger remove-btn">Удалить</button>
            </div>
        `;
        
        card.querySelector('.load-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.loadSavedPalette(palette.id);
        });
        
        card.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteSavedPalette(palette.id);
        });
        
        return card;
    },

    /**
     * Загрузка сохранённой палитры
     * @param {string} id - ID палитры
     */
    loadSavedPalette(id) {
        const palette = Storage.getPaletteById(id);
        if (palette) {
            this.state.currentPalette = palette;
            this.saveCurrentPalette();
            this.renderPalette();
            this.elements.paletteNameInput.value = palette.name;
            this.showToast('Палитра загружена', 'success');
        }
    },

    /**
     * Удаление сохранённой палитры
     * @param {string} id - ID палитры
     */
    deleteSavedPalette(id) {
        if (Storage.deletePalette(id)) {
            this.renderSavedPalettes();
            this.showToast('Палитра удалена', 'success');
        } else {
            this.showToast('Ошибка удаления', 'error');
        }
    },

    /**
     * Показ уведомления
     * @param {string} message - Сообщение
     * @param {string} type - Тип (success, error, info)
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
