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
   Media Queries
   ========================================================= */

/**
 * Tablet breakpoint media query.
 *
 * Used to sync layout-driven behavior (drawer visibility)
 * with responsive styles.
 */
const tabletMQ = window.matchMedia('(min-width: 1024px)');

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
    ).filter((el) => !el.disabled && el.offsetParent !== null);

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
   Function: closeDrawer
   ========================================================= */

/**
 * Closes the mobile drawer and resets related state.
 *
 * Used when:
 * - Clicking outside the drawer
 * - Pressing Escape
 * - Switching to tablet layout
 */
function closeDrawer() {
    const drawer = document.querySelector('.drawer');
    const toggleBtn = document.querySelector('.header__toggle');

    if (!drawer || !drawer.classList.contains('is-open')) return;

    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.removeEventListener('keydown', drawerFocusTrap);

    toggleBtn?.classList.remove('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'false');
}

/* =========================================================
   Dropdown helpers
   ========================================================= */

/**
 * Close any open nav dropdowns.
 */
function closeAllDropdowns() {
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
}

/**
 * Open specific nav item dropdown and ensure others should be closed.
 * @param {HTMLElement} item - .nav__item element
 */
function openDropdown(item) {
    if (!item) return;
    if (!item.classList.contains('is-open')) {
        closeAllDropdowns();
        item.classList.add('is-open');
        const trigger = item.querySelector('[aria-controls]');
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
            const panel = document.getElementById(
                trigger.getAttribute('aria-controls'),
            );
            panel?.setAttribute('aria-hidden', 'false');
        }
    }
}

/**
 * Close a specific nav item dropdown.
 * @param {HTMLElement} item - .nav__item element
 */
function closeDropdown(item) {
    if (!item) return;
    if (item.classList.contains('is-open')) {
        item.classList.remove('is-open');
        const trigger = item.querySelector('[aria-controls]');
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            const panel = document.getElementById(
                trigger.getAttribute('aria-controls'),
            );
            panel?.setAttribute('aria-hidden', 'true');
        }
    }
}

/* =========================================================
   Hover and keyboard behavior
   ========================================================= */

/**
 * Enables hover behavior for desktop and keeps keyboard focus behavior.
 */
function initNavDropdownBehavior() {
    const items = document.querySelectorAll('.nav__item--has-dropdown');

    items.forEach((item) => {
        // Mouse hover: enter -> open , leave -> close
        item.addEventListener('mouseenter', () => {
            openDropdown(item);
        });

        item.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!item.contains(document.activeElement)) closeDropdown(item);
            }, 50);
        });

        const trigger = item.querySelector('[aria-controls]');
        if (trigger) {
            trigger.addEventListener('focus', () => openDropdown(item));
            trigger.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!item.contains(document.activeElement))
                        closeDropdown(item);
                }, 10);
            });
        }

        const panelId = trigger?.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        if (panel) {
            panel.addEventListener('focusout', () => {
                setTimeout(() => {
                    if (!item.contains(document.activeElement))
                        closeDropdown(item);
                }, 10);
            });
        }
    });
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
            'aria-expanded',
            String(
                document
                    .querySelector('.drawer')
                    ?.classList.contains('is-open'),
            ),
        );

        return;
    }

    // Close drawer on outside click
    if (drawer?.classList.contains('is-open') && !insideDrawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');

        drawer.removeEventListener('keydown', drawerFocusTrap);
        document.querySelectorAll('.header__toggle').forEach((btn) => {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-expanded', 'false');
        });

        document.querySelector('.header__toggle')?.focus();
    }

    // Handle nav dropdown triggers
    const trigger = e.target.closest('[aria-controls]');
    if (trigger) {
        if (trigger.tagName.toLowerCase() === 'a') e.preventDefault();

        const parentItem = trigger.closest('.nav__item');
        if (!parentItem) return;

        if (parentItem.classList.contains('is-open')) {
            closeDropdown(parentItem);
        } else {
            openDropdown(parentItem);
        }

        return;
    }

    if (!insideNav) {
        closeAllDropdowns();
    }
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
        closeDrawer();
    }
    closeAllDropdowns();
});

/* =========================================================
   Responsive State Sync
   ========================================================= */

/**
 * Closes the mobile drawer when switching to tablet layout.
 *
 * Prevents hidden open dialogs when the drawer toggle
 * is no longer visible.
 */
tabletMQ.addEventListener('change', (ev) => {
    if (ev.matches) {
        closeDrawer();
    }
});

/* =========================================================
   Init
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNavDropdownBehavior();
});
