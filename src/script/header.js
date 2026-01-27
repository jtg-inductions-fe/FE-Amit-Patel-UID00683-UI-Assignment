const FOCUSABLE_SELECTOR =
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

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

document.addEventListener('click', (e) => {
    const drawer = document.querySelector('.drawer');
    const toggleBtn = e.target.closest('.header__toggle');
    const insideDrawer = e.target.closest('.drawer');
    const insideNav = e.target.closest('.nav');

    if (toggleBtn) {
        if (drawer) {
            const isOpen = drawer.classList.toggle('is-open');
            drawer.setAttribute('aria-hidden', String(!isOpen));

            if (isOpen) {
                drawer
                    .querySelector(
                        'a, button, input, [tabindex]:not([tabindex="-1"])',
                    )
                    ?.focus();

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

    const trigger = e.target.closest('[aria-controls]');
    if (!trigger) {
        if (!insideNav) {
            document.querySelectorAll('.nav__item.is-open').forEach((item) => {
                item.classList.remove('is-open');
                const t = item.querySelector('[aria-controls]');
                t?.setAttribute('aria-expanded', 'false');
                const id = t?.getAttribute('aria-controls');
                document
                    .getElementById(id)
                    ?.setAttribute('aria-hidden', 'true');
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
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
    }
});
