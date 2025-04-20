function initExtensions() {
    const searchInput = document.getElementById('extensions-search');
    const extensionsList = document.getElementById('extensions-list');

    // Mock list of VIM extensions (in a real app, you'd fetch this from the VS Code Marketplace API)
    const vimExtensions = [
        { name: 'Vim', publisher: 'vscodevim', description: 'Vim emulation for Visual Studio Code' },
        { name: 'VSCodeVim', publisher: 'vscodevim', description: 'Another Vim emulation extension' },
        { name: 'Vim Keymap', publisher: 'hiro-sun', description: 'Vim key bindings for VS Code' },
        { name: 'Neo Vim', publisher: 'asvetliakov', description: 'Neo Vim integration for VS Code' }
    ];

    function displayExtensions(extensions) {
        extensionsList.innerHTML = '';
        extensions.forEach(ext => {
            const extDiv = document.createElement('div');
            extDiv.textContent = `${ext.name} by ${ext.publisher} - ${ext.description}`;
            extDiv.addEventListener('click', () => {
                alert(`Installing ${ext.name}... (This is a mock action)`);
            });
            extensionsList.appendChild(extDiv);
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.includes('vim')) {
            const filteredExtensions = vimExtensions.filter(ext =>
                ext.name.toLowerCase().includes(query) ||
                ext.description.toLowerCase().includes(query)
            );
            displayExtensions(filteredExtensions);
        } else {
            extensionsList.innerHTML = '<div>Type "vim" to search for VIM extensions...</div>';
        }
    });

    // Initial display
    extensionsList.innerHTML = '<div>Type "vim" to search for VIM extensions...</div>';
}

document.addEventListener('DOMContentLoaded', initExtensions);
