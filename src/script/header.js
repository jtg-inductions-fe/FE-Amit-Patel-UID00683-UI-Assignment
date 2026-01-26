document.addEventListener('click', (e) => {
    const drawer = document.querySelector('.drawer');
    const toggleBtn = e.target.closest('.header__toggle, .icon-menu');
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

            document
                .querySelectorAll('.header__toggle, .icon-menu')
                .forEach((btn) => {
                    btn.classList.remove('is-active');
                    btn.setAttribute('aria-pressed', 'false');
                });

            document.querySelector('.header__toggle')?.focus();
        }
    }
});
