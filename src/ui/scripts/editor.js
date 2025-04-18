document.addEventListener('DOMContentLoaded', () => {
    let term = null;
    let fitAddon = null;
    let ws = null;
    let fileWs = null;
    const terminals = [];
    let activeTerminalIndex = -1;

    function initializeTerminal() {
        try {
            const terminalElement = document.createElement('div');
            terminalElement.style.display = 'block';
            terminalElement.style.flex = '1';
            document.getElementById('terminal-container').appendChild(terminalElement);

            term = new Terminal({
                cursorBlink: true,
                theme: {
                    background: '#1E1E1E',
                    foreground: '#B0BEC5',
                    cursor: '#FF00E5',
                },
                fontFamily: 'monospace',
                fontSize: 14,
                allowTransparency: true,
                enableBold: true,
                scrollback: 1000,
                windowsMode: false
            });
            fitAddon = new FitAddon.FitAddon();
            term.loadAddon(fitAddon);
            term.open(terminalElement);
            fitAddon.fit();

            term.attachCustomKeyEventHandler((e) => {
                if (e.ctrlKey && e.key === 'c') {
                    const selection = term.getSelection();
                    if (selection) {
                        navigator.clipboard.writeText(selection);
                        return false;
                    }
                }
                if (e.ctrlKey && e.key === 'v') {
                    navigator.clipboard.readText().then((text) => {
                        term.write(text);
                    });
                    return false;
                }
                return true;
            });

            ws = new WebSocket('ws://localhost:3001');
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: 'resize',
                    cols: term.cols,
                    rows: term.rows
                }));
            };
            ws.onmessage = (event) => {
                term.write(event.data);
            };
            ws.onerror = (error) => {
                term.write('WebSocket error: ' + JSON.stringify(error) + '\r\n');
            };
            ws.onclose = () => {
                term.write('WebSocket connection closed.\r\n');
            };
            term.onData(data => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(data);
                } else {
                    term.write('Error: WebSocket not connected.\r\n');
                }
            });

            window.addEventListener('resize', () => {
                fitAddon.fit();
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'resize',
                        cols: term.cols,
                        rows: term.rows
                    }));
                }
            });

            term.focus();
            terminals.push({ term, fitAddon, ws, element: terminalElement });
            activeTerminalIndex = 0;

            const terminalTabs = document.getElementById('terminal-tabs');
            const newTab = document.createElement('div');
            newTab.className = 'terminal-tab active';
            newTab.innerHTML = `Terminal 1<div class="close-btn"></div>`;
            newTab.dataset.index = 0;
            terminalTabs.appendChild(newTab);

            const addTab = document.createElement('div');
            addTab.className = 'terminal-tab add-tab';
            addTab.innerHTML = '+';
            addTab.addEventListener('click', createNewTerminal);
            terminalTabs.appendChild(addTab);

            setupTerminalTabListeners();
        } catch (error) {
            console.error('Terminal initialization failed:', error);
            document.getElementById('terminal-container').innerHTML = '<div style="color: red;">Failed to initialize terminal: ' + error.message + '</div>';
        }
    }

    function createNewTerminal() {
        const terminalContainer = document.getElementById('terminal-container');
        const newTerminalElement = document.createElement('div');
        newTerminalElement.style.display = 'none';
        newTerminalElement.style.flex = '1';
        terminalContainer.appendChild(newTerminalElement);

        const newTerm = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1E1E1E',
                foreground: '#B0BEC5',
                cursor: '#FF00E5',
            },
            fontFamily: 'monospace',
            fontSize: 14,
            allowTransparency: true,
            enableBold: true,
            scrollback: 1000,
            windowsMode: false
        });
        const newFitAddon = new FitAddon.FitAddon();
        newTerm.loadAddon(newFitAddon);
        newTerm.open(newTerminalElement);
        newFitAddon.fit();

        newTerm.attachCustomKeyEventHandler((e) => {
            if (e.ctrlKey && e.key === 'c') {
                const selection = newTerm.getSelection();
                if (selection) {
                    navigator.clipboard.writeText(selection);
                    return false;
                }
            }
            if (e.ctrlKey && e.key === 'v') {
                navigator.clipboard.readText().then((text) => {
                    newTerm.write(text);
                });
                return false;
            }
            return true;
        });

        const newWs = new WebSocket('ws://localhost:3001');
        newWs.onopen = () => {
            newWs.send(JSON.stringify({
                type: 'resize',
                cols: newTerm.cols,
                rows: newTerm.rows
            }));
        };
        newWs.onmessage = (event) => {
            newTerm.write(event.data);
        };
        newWs.onerror = (error) => {
            newTerm.write('WebSocket error: ' + JSON.stringify(error) + '\r\n');
        };
        newWs.onclose = () => {
            newTerm.write('WebSocket connection closed.\r\n');
        };
        newTerm.onData(data => {
            if (newWs.readyState === WebSocket.OPEN) {
                newWs.send(data);
            } else {
                newTerm.write('Error: WebSocket not connected.\r\n');
            }
        });

        const terminalTabs = document.getElementById('terminal-tabs');
        const tabCount = terminals.length + 1;
        const newTab = document.createElement('div');
        newTab.className = 'terminal-tab';
        newTab.innerHTML = `Terminal ${tabCount}<div class="close-btn"></div>`;
        newTab.dataset.index = terminals.length;
        terminalTabs.insertBefore(newTab, document.querySelector('.add-tab'));

        terminals.push({ term: newTerm, fitAddon: newFitAddon, ws: newWs, element: newTerminalElement });

        setupTerminalTabListeners();
        switchTerminal(terminals.length - 1);
    }

    function switchTerminal(index) {
        terminals.forEach((t, i) => {
            t.element.style.display = i === index ? 'block' : 'none';
            document.querySelectorAll('.terminal-tab').forEach(tab => {
                if (!tab.classList.contains('add-tab')) {
                    tab.classList.remove('active');
                    if (parseInt(tab.dataset.index) === index) {
                        tab.classList.add('active');
                    }
                }
            });
            if (i === index) {
                t.fitAddon.fit();
                t.term.focus();
            }
        });
        activeTerminalIndex = index;
    }

    function setupTerminalTabListeners() {
        document.querySelectorAll('.terminal-tab').forEach(tab => {
            if (!tab.classList.contains('add-tab')) {
                tab.addEventListener('click', () => {
                    const index = parseInt(tab.dataset.index);
                    switchTerminal(index);
                });
                const closeBtn = tab.querySelector('.close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = parseInt(tab.dataset.index);
                        const terminal = terminals[index];
                        terminal.ws.close();
                        terminal.term.dispose();
                        terminal.element.remove();
                        tab.remove();
                        terminals.splice(index, 1);
                        document.querySelectorAll('.terminal-tab').forEach((t, i) => {
                            if (!t.classList.contains('add-tab')) {
                                t.dataset.index = i;
                                t.childNodes[0].textContent = `Terminal ${i + 1}`;
                            }
                        });
                        if (terminals.length > 0) {
                            const newIndex = Math.min(index, terminals.length - 1);
                            switchTerminal(newIndex);
                        } else {
                            activeTerminalIndex = -1;
                            document.getElementById('terminal-panel').style.display = 'none';
                        }
                    });
                }
            }
        });
    }

    let currentFile = 'INSTRUCTIONS.md';
    fetch('/load-markdown')
        .then(response => response.json())
        .then(markdownFiles => {
            const markdownPreview = document.getElementById('markdown-preview');
            markdownPreview.innerHTML = '<pre style="white-space: pre-wrap; font-family: \'Inter\', sans-serif;">' + markdownFiles['INSTRUCTIONS.md'] + '</pre>';

            function openInstructions() {
                const tabs = document.getElementById('tabs');
                if (!Array.from(tabs.children).some(tab => tab.dataset.file === 'INSTRUCTIONS.md')) {
                    const newTab = document.createElement('div');
                    newTab.className = 'tab markdown-tab';
                    newTab.dataset.file = 'INSTRUCTIONS.md';
                    newTab.innerHTML = 'INSTRUCTIONS.md<div class="close-btn"></div>';
                    tabs.appendChild(newTab);
                    setupTabListeners();
                }
                switchTab(document.querySelector('.tab[data-file="INSTRUCTIONS.md"]'));
            }

            function switchTab(tab) {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentFile = tab.dataset.file;
                const terminalPanel = document.getElementById('terminal-panel');
                const markdownPreview = document.getElementById('markdown-preview');
                const codeEditor = document.getElementById('code-editor');
                const languageLabel = document.getElementById('language-label');
                if (currentFile.endsWith('.md')) {
                    terminalPanel.style.display = 'none';
                    codeEditor.style.display = 'none';
                    markdownPreview.style.display = 'block';
                    languageLabel.textContent = 'Markdown';
                } else {
                    markdownPreview.style.display = 'none';
                    codeEditor.style.display = 'block';
                    languageLabel.textContent = currentFile.split('.').pop().toUpperCase();
                    loadFileContent(currentFile);
                    if (terminals.length > 0 && activeTerminalIndex >= 0) {
                        const activeTerminal = terminals[activeTerminalIndex];
                        if (activeTerminal.ws.readyState === WebSocket.OPEN) {
                            activeTerminal.ws.send(':e ' + currentFile + '\r');
                        }
                    }
                }
            }

            function loadFileContent(fileName) {
                fetch(`/files/${fileName}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('File not found');
                        }
                        return response.text();
                    })
                    .then(content => {
                        const codeEditor = document.getElementById('code-editor');
                        let extension = fileName.split('.').pop().toLowerCase();
                        const languageMap = {
                            'bash_logout': 'bash',
                            'bash_profile': 'bash',
                            'bashrc': 'bash',
                            'sh': 'bash',
                            'js': 'javascript',
                            'py': 'python',
                            'html': 'html',
                            'css': 'css',
                            'md': 'markdown'
                        };
                        const language = languageMap[extension] || 'plaintext';
                        let highlighted;
                        try {
                            highlighted = hljs.highlight(content, { language }).value;
                        } catch (e) {
                            highlighted = content;
                        }
                        codeEditor.innerHTML = `<pre><code class="language-${language}">${highlighted}</code></pre>`;
                    })
                    .catch(error => {
                        console.error('Failed to load file content:', error);
                        document.getElementById('code-editor').innerHTML = '<div style="color: red;">Failed to load file: ' + error.message + '</div>';
                    });
            }

            function renderFileTree(files, parentUl, level = 0) {
                files.forEach(item => {
                    const li = document.createElement('li');
                    li.dataset.file = item.path;
                    if (item.type === 'directory') {
                        li.className = 'folder';
                        li.textContent = item.name;
                        li.style.paddingLeft = `${level * 20}px`;
                        const ul = document.createElement('ul');
                        ul.className = 'nested';
                        renderFileTree(item.children, ul, level + 1);
                        parentUl.appendChild(li);
                        parentUl.appendChild(ul);

                        li.addEventListener('click', (e) => {
                            e.stopPropagation();
                            li.classList.toggle('expanded');
                        });
                    } else {
                        li.className = `file ${item.extension}-file`;
                        li.textContent = item.name;
                        li.style.paddingLeft = `${level * 20}px`;
                        parentUl.appendChild(li);
                    }
                });
            }

            function showContextMenu(event, filePath, isDirectory) {
                event.preventDefault();
                const existingMenu = document.querySelector('.context-menu');
                if (existingMenu) {
                    existingMenu.remove();
                }

                const menu = document.createElement('div');
                menu.className = 'context-menu';
                menu.style.position = 'absolute';
                menu.style.left = `${event.clientX}px`;
                menu.style.top = `${event.clientY}px`;
                menu.style.backgroundColor = '#1A1B23';
                menu.style.border = '1px solid #2A2A2A';
                menu.style.padding = '5px';
                menu.style.zIndex = '1000';
                menu.style.color = '#B0BEC5';

                const deleteItem = document.createElement('div');
                deleteItem.textContent = 'Delete';
                deleteItem.style.padding = '5px 10px';
                deleteItem.style.cursor = 'pointer';
                deleteItem.addEventListener('click', () => {
                    if (confirm(`Are you sure you want to delete ${filePath}?`)) {
                        fetch('/delete-file', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ filePath })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    refreshExplorer();
                                } else {
                                    alert('Failed to delete file');
                                }
                            })
                            .catch(error => {
                                alert('Failed to delete: ' + error.message);
                            });
                    }
                    menu.remove();
                });

                if (isDirectory) {
                    const newFileItem = document.createElement('div');
                    newFileItem.textContent = 'New File';
                    newFileItem.style.padding = '5px 10px';
                    newFileItem.style.cursor = 'pointer';
                    newFileItem.addEventListener('click', () => {
                        const fileName = prompt('Enter new file name:');
                        if (fileName) {
                            const fullPath = filePath ? `${filePath}/${fileName}` : fileName;
                            fetch('/save-file', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ filePath: fullPath, content: '' })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        refreshExplorer();
                                    } else {
                                        alert('Failed to create file');
                                    }
                                })
                                .catch(error => {
                                    alert('Failed to create file: ' + error.message);
                                });
                        }
                        menu.remove();
                    });

                    const newFolderItem = document.createElement('div');
                    newFolderItem.textContent = 'New Folder';
                    newFolderItem.style.padding = '5px 10px';
                    newFolderItem.style.cursor = 'pointer';
                    newFolderItem.addEventListener('click', () => {
                        const folderName = prompt('Enter new folder name:');
                        if (folderName) {
                            const fullPath = filePath ? `${filePath}/${folderName}` : folderName;
                            fetch('/save-file', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ filePath: fullPath, content: '' })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        refreshExplorer();
                                    } else {
                                        alert('Failed to create folder');
                                    }
                                })
                                .catch(error => {
                                    alert('Failed to create folder: ' + error.message);
                                });
                        }
                        menu.remove();
                    });

                    menu.appendChild(newFileItem);
                    menu.appendChild(newFolderItem);
                }

                menu.appendChild(deleteItem);
                document.body.appendChild(menu);

                document.addEventListener('click', function removeMenu(e) {
                    if (!menu.contains(e.target)) {
                        menu.remove();
                        document.removeEventListener('click', removeMenu);
                    }
                });
            }

            function refreshExplorer() {
                fetch('/list-files')
                    .then(response => response.json())
                    .then(files => {
                        const fileExplorer = document.querySelector('.file-explorer ul');
                        fileExplorer.innerHTML = '';
                        renderFileTree(files, fileExplorer);
                        setupTabListeners();
                    })
                    .catch(error => {
                        console.error('Failed to refresh Explorer:', error);
                    });
            }

            function setupTabListeners() {
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.addEventListener('click', () => switchTab(tab));
                    const closeBtn = tab.querySelector('.close-btn');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const nextTab = tab.nextSibling || tab.previousSibling;
                            tab.remove();
                            if (nextTab) switchTab(nextTab);
                            else {
                                document.getElementById('terminal-panel').style.display = 'none';
                                document.getElementById('markdown-preview').style.display = 'none';
                                document.getElementById('code-editor').style.display = 'none';
                            }
                        });
                    }
                });

                document.querySelectorAll('.file').forEach(file => {
                    file.addEventListener('click', () => {
                        const fileName = file.dataset.file;
                        const tabs = document.getElementById('tabs');
                        if (!Array.from(tabs.children).some(tab => tab.dataset.file === fileName)) {
                            const newTab = document.createElement('div');
                            newTab.className = 'tab';
                            newTab.dataset.file = fileName;
                            newTab.innerHTML = fileName + '<div class="close-btn"></div>';
                            tabs.appendChild(newTab);
                            setupTabListeners();
                        }
                        switchTab(document.querySelector('.tab[data-file="' + fileName + '"]'));
                    });

                    file.addEventListener('contextmenu', (event) => {
                        showContextMenu(event, file.dataset.file, false);
                    });
                });

                document.querySelectorAll('.folder').forEach(folder => {
                    folder.addEventListener('contextmenu', (event) => {
                        showContextMenu(event, folder.dataset.file, true);
                    });
                });
            }

            document.querySelector('.settings-icon').addEventListener('click', (event) => {
                const existingMenu = document.querySelector('.context-menu');
                if (existingMenu) {
                    existingMenu.remove();
                }

                const menu = document.createElement('div');
                menu.className = 'context-menu';
                menu.style.position = 'absolute';
                menu.style.left = `${event.clientX}px`;
                menu.style.top = `${event.clientY}px`;
                menu.style.backgroundColor = '#1A1B23';
                menu.style.border = '1px solid #2A2A2A';
                menu.style.padding = '5px';
                menu.style.zIndex = '1000';
                menu.style.color = '#B0BEC5';

                const refreshItem = document.createElement('div');
                refreshItem.textContent = 'Refresh Explorer';
                refreshItem.style.padding = '5px 10px';
                refreshItem.style.cursor = 'pointer';
                refreshItem.addEventListener('click', () => {
                    refreshExplorer();
                    menu.remove();
                });

                menu.appendChild(refreshItem);
                document.body.appendChild(menu);

                document.addEventListener('click', function removeMenu(e) {
                    if (!menu.contains(e.target)) {
                        menu.remove();
                        document.removeEventListener('click', removeMenu);
                    }
                });
            });

            fileWs = new WebSocket('ws://localhost:3002');
            fileWs.onopen = () => {
                console.log('Connected to file system WebSocket');
            };
            fileWs.onmessage = (event) => {
                if (event.data === 'file-system-changed') {
                    refreshExplorer();
                }
            };
            fileWs.onclose = () => {
                console.log('File system WebSocket closed');
            };

            setupTabListeners();
            refreshExplorer();

            window.openInstructions = openInstructions;
            window.toggleTerminal = function() {
                const terminalPanel = document.getElementById('terminal-panel');
                const isVisible = terminalPanel.style.display === 'flex';
                if (!isVisible) {
                    if (terminals.length === 0) {
                        initializeTerminal();
                    }
                    terminalPanel.style.display = 'flex';
                    if (activeTerminalIndex >= 0) {
                        terminals[activeTerminalIndex].fitAddon.fit();
                        terminals[activeTerminalIndex].term.focus();
                    }
                } else {
                    terminalPanel.style.display = 'none';
                }
            };

            window.toggleNimbusPanel = function() {
                const nimbusPanel = document.getElementById('nimbus-panel');
                nimbusPanel.classList.toggle('collapsed');
            };

            window.refreshExplorer = refreshExplorer;

            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === '`') {
                    e.preventDefault();
                    window.toggleTerminal();
                }
            });
        })
        .catch(error => {
            console.error('Failed to load Markdown files:', error);
        });
});

function toggleExplorer() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
}

function toggleMenu(menuId) {
    console.log('Menu ' + menuId + ' clicked!');
}
