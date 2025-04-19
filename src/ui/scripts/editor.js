let currentFile = 'INSTRUCTIONS.md';
let files = {};

function loadFile(fileName) {
    fetch(`/file?path=${encodeURIComponent(fileName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${fileName}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            files[fileName] = data;
            displayFile(fileName);
            updateStatusBar(fileName);
        })
        .catch(error => {
            console.error('Error loading file:', error);
            const markdownPreview = document.querySelector('#markdown-preview');
            if (markdownPreview) {
                markdownPreview.innerHTML = `<p style="color: red;">Error loading ${fileName}: ${error.message}</p>`;
            }
        });
}

function displayFile(fileName) {
    const codeEditor = document.querySelector('#code-editor');
    const markdownPreview = document.querySelector('#markdown-preview');
    const tabs = document.querySelector('#tabs');

    if (!codeEditor || !markdownPreview || !tabs) {
        console.error('Nimbuspad++: Editor elements not found');
        return;
    }

    currentFile = fileName;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const tab = Array.from(tabs.children).find(t => t.dataset.file === fileName);

    if (tab) {
        Array.from(tabs.children).forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    } else {
        const newTab = document.createElement('div');
        newTab.className = 'tab';
        newTab.dataset.file = fileName;

        const languageIcon = languageIcons[fileExtension] || languageIcons['default'];
        newTab.innerHTML = `
            ${languageIcon}
            ${fileName}
            <div class="close-btn"></div>
        `;
        newTab.addEventListener('click', () => {
            Array.from(tabs.children).forEach(t => t.classList.remove('active'));
            newTab.classList.add('active');
            displayFile(fileName);
        });
        newTab.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = newTab.classList.contains('active');
            const nextTab = newTab.nextElementSibling || newTab.previousElementSibling;
            newTab.remove();
            if (isActive && nextTab) {
                nextTab.click();
            } else if (isActive) {
                codeEditor.style.display = 'none';
                markdownPreview.style.display = 'none';
                updateStatusBar(null);
            }
        });
        tabs.appendChild(newTab);
        Array.from(tabs.children).forEach(t => t.classList.remove('active'));
        newTab.classList.add('active');
    }

    if (fileExtension === 'md') {
        codeEditor.style.display = 'none';
        markdownPreview.style.display = 'block';
        markdownPreview.innerHTML = marked.parse(files[fileName]);
        document.querySelector('#language-label').textContent = 'Markdown';
    } else {
        codeEditor.style.display = 'block';
        markdownPreview.style.display = 'none';
        codeEditor.innerHTML = ''; // Clear previous content
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.background = '#1E1E1E';
        textarea.style.color = '#CCCCCC';
        textarea.style.border = 'none';
        textarea.style.padding = '10px';
        textarea.style.fontFamily = 'monospace';
        textarea.value = files[fileName];
        textarea.addEventListener('input', (e) => {
            files[fileName] = e.target.value;
            // Optionally, save changes to the server
            saveFile(fileName, e.target.value);
        });
        codeEditor.appendChild(textarea);
        document.querySelector('#language-label').textContent = fileExtension.toUpperCase();
        hljs.highlightElement(textarea);
    }

    updateStatusBar(fileName);
}

async function saveFile(fileName, content) {
    try {
        const response = await fetch('/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: fileName, content, type: 'file' })
        });
        if (!response.ok) {
            throw new Error(`Failed to save ${fileName}: ${response.statusText}`);
        }
        console.log(`Saved ${fileName}`);
    } catch (err) {
        console.error('Error saving file:', err);
    }
}

function updateStatusBar(fileName) {
    const fileStatus = document.querySelector('#file-status');
    const tabLabel = document.querySelector('#tab-label');
    if (fileName) {
        fileStatus.textContent = `File: ${fileName}`;
        tabLabel.textContent = fileName === 'INSTRUCTIONS.md' ? 'Instructions' : fileName;
    } else {
        fileStatus.textContent = '';
        tabLabel.textContent = 'Instructions';
    }
}

function openInstructions() {
    const tabs = document.querySelector('#tabs');
    const existingTab = Array.from(tabs.children).find(t => t.dataset.file === 'INSTRUCTIONS.md');
    
    if (existingTab) {
        existingTab.click();
    } else {
        loadFile('INSTRUCTIONS.md');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadFile('INSTRUCTIONS.md');
});
