document.addEventListener('click', (e) => {
    const drawer = document.querySelector('.drawer');
    const isDrawerOpen = drawer?.classList.contains('is-open');

    const toggleBtn = e.target.closest('.header__toggle, .icon-favorite');
    const insideDrawer = e.target.closest('.drawer');
    const insideNav = e.target.closest('.nav');

    if (toggleBtn) {
        if (drawer) drawer.classList.toggle('is-open');

        toggleBtn.classList.toggle('is-active');
        const active = toggleBtn.classList.contains('is-active');
        toggleBtn.setAttribute('aria-pressed', String(active));

        if (drawer?.classList.contains('is-open')) {
            document.querySelectorAll('.nav__item.is-open').forEach((it) => {
                it.classList.remove('is-open');
                const t = it.querySelector('[aria-controls]');
                if (t) t.setAttribute('aria-expanded', 'false');
                const pid = t?.getAttribute('aria-controls');
                if (pid)
                    document
                        .getElementById(pid)
                        ?.setAttribute('aria-hidden', 'true');
            });
        }

        return;
    }

    if (isDrawerOpen && !insideDrawer) {
        drawer?.classList.remove('is-open');
        document
            .querySelectorAll('.header__toggle, .icon-favorite')
            .forEach((btn) => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-pressed', 'false');
            });
    }

    const trigger = e.target.closest('[aria-controls]');
    if (!trigger) {
        if (!insideNav) {
            document.querySelectorAll('.nav__item.is-open').forEach((item) => {
                item.classList.remove('is-open');
                const t = item.querySelector('[aria-controls]');
                if (t) t.setAttribute('aria-expanded', 'false');
                const pid = t?.getAttribute('aria-controls');
                if (pid)
                    document
                        .getElementById(pid)
                        ?.setAttribute('aria-hidden', 'true');
            });
        }
        return;
    }

    const controlsId = trigger.getAttribute('aria-controls');
    const panel = document.getElementById(controlsId);
    if (!panel) return;

    if (trigger.tagName.toLowerCase() === 'a') e.preventDefault();

    const parentItem = trigger.closest('.nav__item');
    if (!parentItem) return;

    const isOpen = parentItem.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
});
