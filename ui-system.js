/**
 * UI System - Reusable Modal & Toast
 * 
 * Dependencies: TailwindCSS (via CDN or Build)
 */

const UISystem = (() => {
    // ========================
    // PRIVATE HELPERS
    // ========================

    /**
     * Creates an element with classes and content
     */
    function createElement(tag, classes = [], content = '') {
        const el = document.createElement(tag);
        if (classes.length) el.classList.add(...classes);
        if (content) el.innerHTML = content;
        return el;
    }

    // ========================
    // TOAST SYSTEM
    // ========================

    const ToastConfig = {
        containerId: 'toast-container',
        defaultDuration: 3000,
        animations: {
            enter: ['translate-x-full', 'opacity-0'],
            active: ['translate-x-0', 'opacity-100'],
            exit: ['translate-x-full', 'opacity-0']
        },
        icons: {
            success: `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
            error: `<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
            warning: `<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
            info: `<svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
        }
    };

    function initToastContainer() {
        let container = document.getElementById(ToastConfig.containerId);
        if (!container) {
            container = createElement('div', [
                'fixed', 'top-5', 'right-5', 'z-50',
                'flex', 'flex-col', 'gap-3', 'max-w-sm', 'w-full', 'pointer-events-none' // pointer-events-none allows clicking through empty areas
            ]);
            container.id = ToastConfig.containerId;
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * showToast
     * @param {Object} options 
     * @param {string} options.type - success, error, warning, info
     * @param {string} options.title - Optional title
     * @param {string} options.message - Main message text
     * @param {number} options.duration - Auto dismiss duration in ms
     * @param {boolean} options.showProgress - Show progress bar
     */
    function showToast({
        type = 'info',
        title = '',
        message = '',
        duration = ToastConfig.defaultDuration,
        showProgress = false
    }) {
        const container = initToastContainer();

        // Colors for types (Border & Progress)
        const typeStyles = {
            success: { border: 'border-green-500', progress: 'bg-green-500', bg: 'bg-green-50' },
            error: { border: 'border-red-500', progress: 'bg-red-500', bg: 'bg-red-50' },
            warning: { border: 'border-yellow-500', progress: 'bg-yellow-500', bg: 'bg-yellow-50' },
            info: { border: 'border-blue-500', progress: 'bg-blue-500', bg: 'bg-blue-50' }
        };
        const currentStyle = typeStyles[type] || typeStyles.info;

        // Create Toast Element
        // Added 'relative' and 'overflow-hidden' for progress bar positioning
        const toast = createElement('div', [
            'pointer-events-auto', 'relative', 'overflow-hidden',
            'w-full', 'max-w-sm',
            'flex', 'items-start', 'gap-4',
            'p-4', 'bg-white', 'shadow-lg', 'rounded-lg',
            // Left border accent
            'border-l-4', currentStyle.border,
            'transform', 'transition-all', 'duration-500', 'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
            ...ToastConfig.animations.enter
        ]);

        // Icon Section
        const iconWrapper = createElement('div', ['flex-shrink-0', 'pt-1']);
        iconWrapper.innerHTML = ToastConfig.icons[type] || ToastConfig.icons.info;

        // Content Section
        const contentWrapper = createElement('div', ['flex-1', 'min-w-0']); // min-w-0 for text truncate support if needed

        if (title) {
            const titleEl = createElement('h4', ['text-sm', 'font-bold', 'text-gray-900', 'mb-0.5'], title);
            contentWrapper.appendChild(titleEl);
            // If title exists, message is lighter
            const msgEl = createElement('p', ['text-sm', 'text-gray-600', 'leading-relaxed'], message);
            contentWrapper.appendChild(msgEl);
        } else {
            // No title, message is strictly vertically centered relative to icon approximately
            const msgEl = createElement('p', ['text-sm', 'text-gray-800', 'font-medium'], message);
            contentWrapper.appendChild(msgEl);
        }

        // Close Button
        const closeBtn = createElement('button', [
            'flex-shrink-0', 'ml-3', '-mt-1', '-mr-1',
            'text-gray-400', 'hover:text-gray-600', 'transition-colors',
            'p-1', 'rounded-full', 'hover:bg-gray-100'
        ]);
        closeBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
        closeBtn.onclick = () => dismissToast(toast);

        toast.appendChild(iconWrapper);
        toast.appendChild(contentWrapper);
        toast.appendChild(closeBtn);

        // Progress Bar (Optional)
        if (showProgress && duration > 0) {
            const progressContainer = createElement('div', ['absolute', 'bottom-0', 'left-1', 'right-0', 'h-1', 'bg-gray-100']); // left-1 to not overlap border radius weirdly
            // Mask it to fit rounded corner if needed, or just let it sit.
            // Actually, simpler to put it absolute bottom.

            const progressBar = createElement('div', ['h-full', currentStyle.progress, 'origin-left']);
            progressBar.style.width = '100%';
            progressBar.style.transition = `transform ${duration}ms linear`;

            progressContainer.appendChild(progressBar);
            toast.appendChild(progressContainer);

            // Animate progress
            requestAnimationFrame(() => {
                // We initially set width 100%. We want to scale it to 0.
                // Using transform scaleX is more performant than width.
                progressBar.style.transform = 'scaleX(0)';
            });
        }

        // Add to DOM
        container.appendChild(toast);

        // Trigger Layout (Force Reflow)
        void toast.offsetWidth;

        // Animate In
        toast.classList.remove(...ToastConfig.animations.enter);
        toast.classList.add(...ToastConfig.animations.active);

        // Auto Dismiss
        if (duration > 0) {
            setTimeout(() => dismissToast(toast), duration);
        }
    }

    function dismissToast(toast) {
        if (!toast || toast.dataset.exiting) return;
        toast.dataset.exiting = "true";

        // Switch to exit animation (smoother fade out)
        toast.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)'; // standard ease
        toast.style.transitionDuration = '300ms';

        toast.classList.remove(...ToastConfig.animations.active);
        toast.classList.add(...ToastConfig.animations.exit);

        // Remove from DOM after transition
        setTimeout(() => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
    }

    // ========================
    // MODAL SYSTEM
    // ========================

    const ModalConfig = {
        activeModal: null,
        focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    };

    /**
     * openModal
     * @param {Object} options
     * @param {string} options.title - Modal Title
     * @param {string} options.content - Modal Content (can be HTML)
     * @param {boolean} options.showCancel - Show Cancel button
     * @param {Function} options.onConfirm - Callback when confirmed
     * @param {Function} options.onCancel - Callback when cancelled
     * @param {string} options.confirmText - Text for confirm button
     * @param {string} options.cancelText - Text for cancel button
     */
    function openModal({
        title = 'Info',
        content = '',
        showCancel = false,
        confirmText = 'Konfirmasi',
        cancelText = 'Batal',
        onConfirm = () => { },
        onCancel = () => { }
    }) {
        // Close existing if any
        if (ModalConfig.activeModal) closeModal();

        // 1. Overlay / Backdrop
        const backdrop = createElement('div', [
            'fixed', 'inset-0', 'z-40',
            'bg-gray-900/50', 'backdrop-blur-sm',
            'flex', 'items-center', 'justify-center', 'p-4',
            'opacity-0', 'transition-opacity', 'duration-300'
        ]);

        // 2. Modal Card
        const modal = createElement('div', [
            'bg-white', 'rounded-xl', 'shadow-2xl',
            'w-full', 'max-w-md', 'overflow-hidden',
            'transform', 'scale-90', 'opacity-0', // Start slightly smaller
            'transition-all', 'duration-300', 'ease-[cubic-bezier(0.34,1.56,0.64,1)]', // Pop effect
            'relative'
        ]);
        // ARIA attributes
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');

        // Close on Backdrop Click? (Optional, implies Cancel)
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) handleCancel();
        });

        // 3. Header
        const header = createElement('div', ['px-6', 'py-4', 'border-b', 'border-gray-100', 'flex', 'items-center', 'justify-between']);
        const titleEl = createElement('h3', ['text-lg', 'font-semibold', 'text-gray-900'], title);
        titleEl.id = 'modal-title';

        const closeBtn = createElement('button', ['text-gray-400', 'hover:text-gray-600', 'transition-colors']);
        closeBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
        closeBtn.onclick = handleCancel;

        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        // 4. Body
        const body = createElement('div', ['p-6', 'text-gray-600']);
        // If content is an element, append it. If string, set innerHTML
        if (content instanceof HTMLElement) {
            body.appendChild(content);
        } else {
            body.innerHTML = content;
        }

        // 5. Footer
        const footer = createElement('div', ['px-6', 'py-4', 'bg-gray-50', 'flex', 'justify-end', 'gap-3']);

        if (showCancel) {
            const btnCancel = createElement('button', [
                'px-4', 'py-2', 'rounded-lg',
                'text-gray-700', 'bg-white', 'border', 'border-gray-300',
                'hover:bg-gray-50', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-gray-200',
                'transition-colors', 'font-medium'
            ], cancelText);
            btnCancel.onclick = handleCancel;
            footer.appendChild(btnCancel);
        }

        const btnConfirm = createElement('button', [
            'px-4', 'py-2', 'rounded-lg',
            'text-white', 'bg-indigo-600', 'hover:bg-indigo-700',
            'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-indigo-500',
            'transition-colors', 'font-medium', 'shadow-sm'
        ], confirmText);
        btnConfirm.onclick = handleConfirm;
        footer.appendChild(btnConfirm);

        // Assemble
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Store reference
        ModalConfig.activeModal = { backdrop, modal, onCancel };

        // Force Reflow
        void modal.offsetWidth;

        // Animate In
        backdrop.classList.remove('opacity-0');
        modal.classList.remove('scale-90', 'opacity-0');
        modal.classList.add('scale-100', 'opacity-100');

        // Focus management
        const input = modal.querySelector('input');
        if (input) {
            input.focus();
        } else {
            btnConfirm.focus();
        }

        // INTERNAL HANDLERS
        function handleConfirm() {
            // If callback returns false, don't close (e.g., validation failed)
            const result = onConfirm();
            if (result !== false) closeModal();
        }

        function handleCancel() {
            if (onCancel) onCancel();
            closeModal();
        }
    }

    function closeModal() {
        const { backdrop, modal } = ModalConfig.activeModal || {};
        if (!backdrop || !modal) return;

        // Animate Out - Switch easing for exit
        modal.style.transitionTimingFunction = 'ease-in';
        modal.style.transitionDuration = '200ms';

        backdrop.classList.add('opacity-0');
        modal.classList.remove('scale-100', 'opacity-100');
        modal.classList.add('scale-90', 'opacity-0'); // Scale down slightly

        setTimeout(() => {
            if (backdrop.parentElement) document.body.removeChild(backdrop);
            ModalConfig.activeModal = null;
        }, 200); // match duration
    }

    // Global Key Listener for ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ModalConfig.activeModal) {
            // Trigger the cancel logic of the active modal
            ModalConfig.activeModal.onCancel();
            closeModal();
        }
    });

    // ========================
    // PUBLIC API
    // ========================
    return {
        showToast,
        openModal,
        // Helper specifically for the assignment requirements
        closeModal
    };

})();
