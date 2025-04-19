function initSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');

    if (!searchInput || !searchResults) {
        console.error('Nimbuspad++: Search elements not found');
        return;
    }

    searchInput.addEventListener('input', debounce(async () => {
        const query = searchInput.value.trim();
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        try {
            const response = await fetch('http://localhost:3003/list');
            const files = await response.json();
            const results = files.filter(file => 
                file.name.toLowerCase().includes(query.toLowerCase()) ||
                (file.type === 'file' && searchFileContent(file, query))
            );

            searchResults.innerHTML = '';
            results.forEach(file => {
                const div = document.createElement('div');
                div.textContent = file.path;
                div.addEventListener('click', () => openFile(file));
                searchResults.appendChild(div);
            });

            console.log(`Nimbuspad++: Found ${results.length} search results for "${query}"`);
        } catch (err) {
            console.error('Nimbuspad++: Search failed', err);
            searchResults.innerHTML = '<div>Error searching files</div>';
        }
    }, 300));

    async function searchFileContent(file, query) {
        try {
            const response = await fetch(`http://localhost:3003/file?path=${file.path}`);
            const content = await response.text();
            return content.toLowerCase().includes(query.toLowerCase());
        } catch (err) {
            return false;
        }
    }

    async function openFile(file) {
        if (file.type === 'directory') return;
        try {
            const response = await fetch(`http://localhost:3003/file?path=${file.path}`);
            const content = await response.text();
            const editor = document.querySelector('#code-editor');
            editor.textContent = content;
            editor.style.display = 'block';
            document.querySelector('#markdown-preview').style.display = 'none';
            highlightCode(file.extension);
            addTab(file);
        } catch (err) {
            console.error('Nimbuspad++: Failed to open file', err);
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

document.addEventListener('DOMContentLoaded', initSearch);
