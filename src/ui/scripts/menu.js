function showStatusMenu(event) {
    event.stopPropagation();
    const existingMenu = document.querySelector('.status-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'status-menu';
    menu.style.bottom = '30px'; // Position above status bar
    menu.style.left = `${event.clientX}px`;

    const menuItems = [
        {
            label: 'File',
            submenu: [
                { label: 'New File', action: () => alert('New File functionality not implemented.') },
                { label: 'Open File', action: () => alert('Open File functionality not implemented.') },
                { label: 'Save', action: () => alert('Save functionality not implemented.') },
                { label: 'Save As...', action: () => alert('Save As functionality not implemented.') },
                { label: 'Close', action: () => alert('Close functionality not implemented.') }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { label: 'Undo', action: () => alert('Undo functionality not implemented.') },
                { label: 'Redo', action: () => alert('Redo functionality not implemented.') },
                { label: 'Cut', action: () => alert('Cut functionality not implemented.') },
                { label: 'Copy', action: () => alert('Copy functionality not implemented.') },
                { label: 'Paste', action: () => alert('Paste functionality not implemented.') }
            ]
        },
        {
            label: 'Preferences',
            submenu: [
                {
                    label: 'Theme',
                    action: (parentMenu) => {
                        const selector = document.createElement('div');
                        selector.className = 'theme-selector';
                        selector.style.left = `${parentMenu.offsetWidth}px`;
                        selector.style.top = '0';

                        const label = document.createElement('label');
                        label.textContent = 'Select Theme:';
                        selector.appendChild(label);

                        const select = document.createElement('select');
                        const themes = [
                            { value: 'monokai', text: 'Monokai' },
                            { value: 'dracula', text: 'Dracula' },
                            { value: 'solarized-dark', text: 'Solarized Dark' }
                        ];

                        themes.forEach(theme => {
                            const option = document.createElement('option');
                            option.value = theme.value;
                            option.textContent = theme.text;
                            select.appendChild(option);
                        });

                        select.addEventListener('change', () => {
                            const selectedTheme = select.value;
                            document.body.classList.remove('theme-monokai', 'theme-dracula', 'theme-solarized-dark');
                            document.body.classList.add(`theme-${selectedTheme}`);
                            selector.remove();
                        });

                        parentMenu.appendChild(selector);
                        selector.style.display = 'block';
                    }
                },
                { label: 'Font Size', action: () => alert('Font Size settings not implemented.') },
                { label: 'Key Bindings', action: () => alert('Key Bindings settings not implemented.') }
            ]
        },
        {
            label: 'View',
            submenu: [
                { label: 'Toggle Terminal', action: toggleTerminal },
                { label: 'Toggle Sidebar', action: () => alert('Toggle Sidebar functionality not implemented.') },
                { label: 'Zoom In', action: () => alert('Zoom In functionality not implemented.') },
                { label: 'Zoom Out', action: () => alert('Zoom Out functionality not implemented.') }
            ]
        }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.label;

        if (item.submenu) {
            const submenu = document.createElement('div');
            submenu.className = 'submenu';

            item.submenu.forEach(subItem => {
                const subMenuItem = document.createElement('div');
                subMenuItem.textContent = subItem.label;
                subMenuItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (subItem.action) {
                        if (subItem.label === 'Theme') {
                            subItem.action(menuItem);
                        } else {
                            subItem.action();
                            menu.remove();
                        }
                    }
                });
                submenu.appendChild(subMenuItem);
            });

            menuItem.appendChild(submenu);
        } else {
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.action) {
                    item.action();
                    menu.remove();
                }
            });
        }

        menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);
    document.addEventListener('click', () => {
        menu.remove();
        const selector = document.querySelector('.theme-selector');
        if (selector) selector.remove();
    }, { once: true });
}

window.showStatusMenu = showStatusMenu;
