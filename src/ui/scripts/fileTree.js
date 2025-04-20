let selectedPath = null;

async function loadFileTree(projectId = null) {
    try {
        const url = projectId ? `/list?projectId=${encodeURIComponent(projectId)}` : '/list';
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${await response.text()}`);
        const files = await response.json();
        const fileTree = document.querySelector('#file-tree');
        fileTree.innerHTML = '<div class="workspace-title">AviyonOS Workspace</div>';
        const ul = document.createElement('ul');
        files.forEach(file => renderFile(file, ul));
        fileTree.appendChild(ul);
        console.log('Nimbuspad++: File tree loaded');
    } catch (err) {
        console.error('Nimbuspad++: Failed to load file tree', err);
        document.querySelector('#file-tree').innerHTML = '<li>Error loading files: ' + err.message + '</li>';
    }
}

function renderFile(file, parentElement, pathPrefix = '') {
    const li = document.createElement('li');
    const fullPath = pathPrefix ? `${pathPrefix}/${file.name}` : file.name;
    li.className = file.type;
    const icon = file.type === 'directory' 
        ? '📁' 
        : (window.languageIcons[file.extension] || '📄');
    li.innerHTML = `${icon} ${file.name}`;
    li.dataset.path = file.path;
    li.addEventListener('click', (e) => {
        e.stopPropagation();
        if (file.type === 'directory') {
            li.classList.toggle('expanded');
        } else {
            openFile(file);
        }
    });
    li.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        selectedPath = file.path;
        showContextMenu(e.clientX, e.clientY, file);
    });

    parentElement.appendChild(li);

    if (file.children && file.children.length > 0) {
        const ul = document.createElement('ul');
        ul.style.display = 'none';
        li.appendChild(ul);
        file.children.forEach(child => renderFile(child, ul, fullPath));
        li.addEventListener('click', () => {
            ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
        });
    }
}

async function openFile(file) {
    try {
        const response = await fetch(`/file?path=${encodeURIComponent(file.path)}`);
        if (!response.ok) throw new Error(`Failed to fetch file: ${await response.text()}`);
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

function addTab(file) {
    const tabs = document.querySelector('#tabs');
    const existingTab = Array.from(tabs.children).find(tab => tab.dataset.file === file.path);
    if (existingTab) {
        Array.from(tabs.children).forEach(tab => tab.classList.remove('active'));
        existingTab.classList.add('active');
        return;
    }

    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.file = file.path;
    const icon = window.languageIcons[file.extension] || '📄';
    tab.innerHTML = `${icon} ${file.name}<div class="close-btn"></div>`;
    tab.addEventListener('click', () => {
        Array.from(tabs.children).forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        openFile(file);
    });

    tab.querySelector('.close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const nextTab = tab.nextElementSibling || tab.previousElementSibling;
        tab.remove();
        if (nextTab) {
            nextTab.click();
        } else {
            document.querySelector('#code-editor').style.display = 'none';
        }
    });

    tabs.appendChild(tab);
    Array.from(tabs.children).forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
}

function highlightCode(extension) {
    const editor = document.querySelector('#code-editor');
    const language = {
        'js': 'javascript',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        'json': 'json'
    }[extension] || 'plaintext';
    editor.className = `language-${language}`;
    hljs.highlightElement(editor);
}

function showContextMenu(x, y, file) {
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'context-menu explorer-menu';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const options = [
        { label: 'New File', action: () => createNewItem(file, 'file') },
        { label: 'New Folder', action: () => createNewItem(file, 'directory') },
        { label: 'Delete', action: () => deleteItem(file), disabled: !selectedPath },
        { label: 'Rename', action: () => renameItem(file), disabled: !selectedPath },
        { label: 'Refresh', action: refreshFileTree },
        { label: 'Collapse All', action: collapseAll },
        { label: 'Open in Terminal', action: () => openInTerminal(file) },
        { label: 'Copy Path', action: () => copyPath(file) },
        { label: 'Duplicate', action: () => duplicateItem(file), disabled: !selectedPath }
    ];

    options.forEach(opt => {
        const div = document.createElement('div');
        div.textContent = opt.label;
        if (opt.disabled) {
            div.setAttribute('disabled', true);
        } else {
            div.addEventListener('click', () => {
                opt.action();
                menu.remove();
            });
        }
        menu.appendChild(div);
    });

    document.body.appendChild(menu);

    const handleClickOutside = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    };
    document.addEventListener('click', handleClickOutside);
}

async function createNewItem(file, type) {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;
    const parentPath = file && file.type === 'directory' ? file.path : file?.path.split('/').slice(0, -1).join('/') || '';
    const newPath = parentPath ? `${parentPath}/${name}` : `repos/${name}`;
    try {
        await fetch('/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: newPath, content: '', type })
        });
        refreshFileTree();
    } catch (err) {
        console.error(`Nimbuspad++: Failed to create ${type}`, err);
    }
}

async function deleteItem(file) {
    if (!confirm(`Delete ${file.path}?`)) return;
    try {
        await fetch('/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: file.path })
        });
        refreshFileTree();
    } catch (err) {
        console.error('Nimbuspad++: Failed to delete item', err);
    }
}

async function renameItem(file) {
    const newName = prompt('Enter new name:', file.name);
    if (!newName || newName === file.name) return;
    const parentPath = file.path.split('/').slice(0, -1).join('/');
    const newPath = parentPath ? `${parentPath}/${newName}` : `repos/${newName}`;
    try {
        await fetch('/rename', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPath: file.path, newPath })
        });
        refreshFileTree();
    } catch (err) {
        console.error('Nimbuspad++: Failed to rename item', err);
    }
}

function refreshFileTree() {
    const projectId = new URLSearchParams(window.location.search).get('projectId');
    loadFileTree(projectId);
}

function collapseAll() {
    document.querySelectorAll('#file-tree ul').forEach(ul => {
        ul.style.display = 'none';
    });
}

function openInTerminal(file) {
    const terminal = document.querySelector('.terminal-content');
    if (terminal && file.path) {
        const term = terminal.__xterm;
        if (term) {
            const dirPath = file.type === 'directory' ? file.path : file.path.split('/').slice(0, -1).join('/');
            term.write(`cd /home/nimbususer/repos/${dirPath}\r`);
        }
        document.querySelector('.terminal-panel').style.display = 'block';
        document.querySelector('.terminal-panel').style.height = '200px';
    }
}

function copyPath(file) {
    navigator.clipboard.writeText(file.path).then(() => {
        console.log('Nimbuspad++: Path copied', file.path);
    });
}

async function duplicateItem(file) {
    const newName = prompt('Enter name for duplicate:', `${file.name}_copy`);
    if (!newName) return;
    const parentPath = file.path.split('/').slice(0, -1).join('/');
    const newPath = parentPath ? `${parentPath}/${newName}` : `repos/${newName}`;
    try {
        const response = await fetch(`/file?path=${encodeURIComponent(file.path)}`);
        const content = await response.text();
        await fetch('/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: newPath, content, type: 'file' })
        });
        refreshFileTree();
    } catch (err) {
        console.error('Nimbuspad++: Failed to duplicate item', err);
    }
}

window.refreshFileTree = refreshFileTree;
window.showExplorerMenu = showContextMenu;

document.addEventListener('DOMContentLoaded', () => {
    const projectId = new URLSearchParams(window.location.search).get('projectId');
    loadFileTree(projectId);

    const ws = new WebSocket('ws://localhost:3005'); // Changed from 3004 to 3005
    ws.onopen = () => console.log('Nimbuspad++: Connected to file system WebSocket');
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Nimbuspad++: File system update received', data);
        refreshFileTree();
    };
    ws.onerror = (err) => console.error('Nimbuspad++: File system WebSocket error', err);
    ws.onclose = () => console.log('Nimbuspad++: File system WebSocket closed');
});
