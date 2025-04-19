function initExtensions() {
    const searchInput = document.querySelector('#extensions-search');
    const extensionsList = document.querySelector('#extensions-list');

    if (!searchInput || !extensionsList) {
        console.error('Nimbuspad++: Extensions elements not found');
        return;
    }

    const mockExtensions = [
        { name: 'Python', id: 'python', description: 'Python language support' },
        { name: 'ESLint', id: 'eslint', description: 'JavaScript linting' },
        { name: 'Prettier', id: 'prettier', description: 'Code formatter' }
    ];

    function renderExtensions(extensions) {
        extensionsList.innerHTML = '';
        extensions.forEach(ext => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${ext.name}</strong>: ${ext.description} <button>Install</button>`;
            div.querySelector('button').addEventListener('click', () => installExtension(ext.id));
            extensionsList.appendChild(div);
        });
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = mockExtensions.filter(ext => 
            ext.name.toLowerCase().includes(query) || 
            ext.description.toLowerCase().includes(query)
        );
        renderExtensions(filtered);
    });

    function installExtension(id) {
        console.log(`Nimbuspad++: Installing extension ${id}`);
        // Placeholder: Implement extension installation
        alert(`Installed ${id}`);
    }

    renderExtensions(mockExtensions);
}

document.addEventListener('DOMContentLoaded', initExtensions);
