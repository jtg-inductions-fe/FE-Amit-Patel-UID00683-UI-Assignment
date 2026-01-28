/* =========================================================
   Focus Management Utilities
   ========================================================= */

/**
 * Selector for all focusable elements.
 *
 * Used to trap keyboard focus inside interactive components
 * like drawers or dialogs.
 */
const FOCUSABLE_SELECTOR =
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

/* =========================================================
   Function: drawerFocusTrap
   ========================================================= */

/**
 * Traps keyboard focus inside the mobile drawer when open.
 *
 * Cycles focus between first and last focusable elements
 * when using Tab / Shift+Tab.
 *
 * @param {KeyboardEvent} e
 *   Keydown event triggered inside the drawer.
 */
function drawerFocusTrap(e) {
    if (e.key !== 'Tab') return;

    const drawer = document.getElementById('mobile-drawer');
    if (!drawer || drawer.getAttribute('aria-hidden') === 'true') return;

    const focusables = Array.from(
        drawer.querySelectorAll(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.disabled);

    if (!focusables.length) {
        e.preventDefault();
        return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    }

    if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

/* =========================================================
   Click Interaction Handler
   ========================================================= */

/**
 * Handles click interactions for:
 * - Mobile drawer toggle
 * - Click outside drawer to close
 * - Navigation dropdown open/close
 *
 * Manages ARIA attributes and active states accordingly.
 */
document.addEventListener('click', (e) => {
    const drawer = document.querySelector('.drawer');
    const toggleBtn = e.target.closest('.header__toggle');
    const insideDrawer = e.target.closest('.drawer');
    const insideNav = e.target.closest('.nav');

    // Toggle mobile drawer
    if (toggleBtn) {
        if (drawer) {
            const isOpen = drawer.classList.toggle('is-open');
            drawer.setAttribute('aria-hidden', String(!isOpen));

            if (isOpen) {
                drawer.querySelector(FOCUSABLE_SELECTOR)?.focus();
                drawer.addEventListener('keydown', drawerFocusTrap);
            } else {
                drawer.removeEventListener('keydown', drawerFocusTrap);
            }
        }

        toggleBtn.classList.toggle('is-active');
        toggleBtn.setAttribute(
            'aria-pressed',
            String(toggleBtn.classList.contains('is-active')),
        );

        return;
    }

    // Close drawer on outside click
    if (drawer?.classList.contains('is-open') && !insideDrawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');

        drawer.removeEventListener('keydown', drawerFocusTrap);
        document
            .querySelectorAll('.header__toggle, .icon-favorite')
            .forEach((btn) => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-pressed', 'false');
            });

        document.querySelector('.header__toggle')?.focus();
    }

    // Handle nav dropdown triggers
    const trigger = e.target.closest('[aria-controls]');
    if (!trigger) {
        if (!insideNav) {
            document.querySelectorAll('.nav__item.is-open').forEach((item) => {
                item.classList.remove('is-open');
                const t = item.querySelector('[aria-controls]');
                if (t) {
                    t.setAttribute('aria-expanded', 'false');
                    const panel = document.getElementById(
                        t.getAttribute('aria-controls'),
                    );
                    panel?.setAttribute('aria-hidden', 'true');
                }
            });
        }
        return;
    }

    const panel = document.getElementById(
        trigger.getAttribute('aria-controls'),
    );
    if (!panel) return;

    if (trigger.tagName.toLowerCase() === 'a') e.preventDefault();

    const parentItem = trigger.closest('.nav__item');
    if (!parentItem) return;

    const isOpen = parentItem.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
    panel.setAttribute('aria-hidden', String(!isOpen));
});

/* =========================================================
   Global Keyboard Handler
   ========================================================= */

/**
 * Handles Escape key behavior.
 *
 * - Closes mobile drawer if open
 * - Closes any open navigation dropdowns
 * - Restores focus to drawer toggle
 */
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    const drawer = document.querySelector('.drawer');
    if (drawer?.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');

        drawer.removeEventListener('keydown', drawerFocusTrap);
        document
            .querySelectorAll('.header__toggle, .icon-favorite')
            .forEach((btn) => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-pressed', 'false');
            });

        document.querySelector('.header__toggle')?.focus();
    }

    document.querySelectorAll('.nav__item.is-open').forEach((item) => {
        item.classList.remove('is-open');
        const trigger = item.querySelector('[aria-controls]');
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            const panel = document.getElementById(
                trigger.getAttribute('aria-controls'),
            );
            panel?.setAttribute('aria-hidden', 'true');
        }
    });
});
