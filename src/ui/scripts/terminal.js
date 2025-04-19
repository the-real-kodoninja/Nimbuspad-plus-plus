let terminals = {};
let fitAddons = {};
let activeTerminalId = 0;
let terminalCount = 1;

function initTerminal() {
    console.log('Starting terminal initialization...');
    const terminalPanel = document.querySelector('.terminal-panel');
    const terminalTabs = document.querySelector('#terminal-tabs');
    const initialTerminalContent = document.querySelector('#terminal-content-0');
    const terminalLink = document.querySelector('.terminal-link');

    if (!terminalPanel || !terminalTabs || !initialTerminalContent || !terminalLink) {
        console.error('Nimbuspad++: Terminal elements not found');
        console.log('terminalPanel:', terminalPanel);
        console.log('terminalTabs:', terminalTabs);
        console.log('initialTerminalContent:', initialTerminalContent);
        console.log('terminalLink:', terminalLink);
        return;
    }

    createTerminal(0, initialTerminalContent);

    terminalLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Terminal link clicked, toggling terminal...');
        toggleTerminal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            console.log('Ctrl + ` pressed, toggling terminal...');
            toggleTerminal();
        }
    });
}

function createTerminal(terminalId, terminalContent) {
    let terminal;
    let fitAddon;
    try {
        console.log(`Initializing xterm.js terminal ${terminalId}...`);
        terminal = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#1E1E1E',
                foreground: '#CCCCCC'
            }
        });

        fitAddon = new FitAddon.FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.open(terminalContent);
        console.log(`Terminal ${terminalId} opened, fitting to container...`);
        fitAddon.fit();
        terminalContent.__xterm = terminal;

        terminal.write('Initializing terminal...\r\n');
        console.log(`Wrote initialization message to terminal ${terminalId}`);
    } catch (err) {
        console.error(`Failed to initialize terminal ${terminalId}:`, err);
        terminalContent.innerHTML = `<span style="color: red;">Failed to initialize terminal: ${err.message}</span>`;
        return;
    }

    terminals[terminalId] = { terminal, ws: null, command: '' };
    fitAddons[terminalId] = fitAddon;

    let command = '';
    terminal.onData((data) => {
        console.log(`Received data from terminal ${terminalId}: ${JSON.stringify(data)}`);
        if (data === '\r') {
            terminal.write('\r\n');
            if (command.trim() === 'clear') {
                terminal.clear();
            } else if (command.trim() === 'exit') {
                closeTerminal(terminalId);
            } else {
                console.log(`Sending command to backend from terminal ${terminalId}: ${command}`);
                sendCommandToBackend(terminalId, command);
            }
            command = '';
        } else if (data === '\b') {
            if (command.length > 0) {
                command = command.slice(0, -1);
                terminal.write('\b \b');
            }
        } else {
            command += data;
            terminal.write(data);
        }
    });

    window.addEventListener('resize', () => {
        const terminalPanel = document.querySelector('.terminal-panel');
        if (terminalPanel.style.display !== 'none' && terminalPanel.style.height !== '0px' && activeTerminalId === terminalId) {
            console.log(`Window resized, fitting terminal ${terminalId}...`);
            fitAddon.fit();
            sendResizeToBackend(terminalId);
        }
    });

    setupWebSocket(terminalId);
}

function setupWebSocket(terminalId) {
    const terminalObj = terminals[terminalId];
    if (!terminalObj) return;

    const terminal = terminalObj.terminal;
    console.log(`Setting up WebSocket connection to ws://localhost:3000/terminal for terminal ${terminalId}...`);
    terminal.write('Connecting to AviyonOS...\r\n');

    let ws;
    try {
        ws = new WebSocket('ws://localhost:3000/terminal');
    } catch (err) {
        console.error(`Failed to create WebSocket for terminal ${terminalId}:`, err);
        terminal.write(`\r\n<span style="color: red;">Unable to connect to AviyonOS: WebSocket creation failed - ${err.message}</span>\r\n`);
        return;
    }

    terminalObj.ws = ws;

    ws.onopen = () => {
        console.log(`Nimbuspad++: WebSocket connection established for terminal ${terminalId}`);
        if (terminal) {
            terminal.write('Connected to AviyonOS.\r\n');
        }
    };

    ws.onmessage = (event) => {
        console.log(`Received WebSocket message for terminal ${terminalId}:`, JSON.stringify(event.data));
        if (terminal) {
            terminal.write(event.data);
        }
    };

    ws.onclose = () => {
        console.log(`Nimbuspad++: WebSocket connection closed for terminal ${terminalId}`);
        if (terminal) {
            terminal.write('\r\nConnection to AviyonOS closed.\r\n');
        }
    };

    ws.onerror = (error) => {
        console.error(`Nimbuspad++: WebSocket error for terminal ${terminalId}:`, error);
        if (terminal) {
            terminal.write(`\r\n<span style="color: red;">Unable to connect to AviyonOS: WebSocket error occurred - ${error.message}</span>\r\n`);
        }
    };
}

function sendCommandToBackend(terminalId, command) {
    const terminalObj = terminals[terminalId];
    if (!terminalObj) return;

    const { ws, terminal } = terminalObj;
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log(`Sending command from terminal ${terminalId}: ${command}`);
        ws.send(JSON.stringify({ command }));
    } else {
        console.error(`WebSocket not connected for terminal ${terminalId}`);
        if (terminal) {
            terminal.write('\r\n<span style="color: red;">Error: Not connected to AviyonOS.</span>\r\n');
        }
    }
}

function sendResizeToBackend(terminalId) {
    const terminalObj = terminals[terminalId];
    if (!terminalObj) return;

    const { ws, terminal } = terminalObj;
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log(`Sending resize for terminal ${terminalId}: ${terminal.cols}x${terminal.rows}`);
        ws.send(JSON.stringify({
            type: 'resize',
            cols: terminal.cols,
            rows: terminal.rows
        }));
    }
}

function toggleTerminal() {
    const terminalPanel = document.querySelector('.terminal-panel');
    if (!terminalPanel) {
        console.error('Nimbuspad++: Terminal panel not found during toggle');
        return;
    }

    if (terminalPanel.style.display === 'none' || terminalPanel.style.height === '0px') {
        terminalPanel.style.display = 'block';
        terminalPanel.style.height = '200px';
        setTimeout(() => {
            console.log(`Terminal shown, fitting terminal ${activeTerminalId}...`);
            if (fitAddons[activeTerminalId]) {
                fitAddons[activeTerminalId].fit();
                sendResizeToBackend(activeTerminalId);
            }
        }, 300);
    } else {
        terminalPanel.style.height = '0px';
        terminalPanel.style.display = 'none';
    }
}

function showTerminalMenu(event) {
    event.stopPropagation();
    const existingMenu = document.querySelector('.terminal-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'terminal-menu';
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;

    const options = [
        { label: 'New Terminal', action: createNewTerminal },
        { label: 'Close Terminal', action: () => closeTerminal(activeTerminalId) },
        { label: 'Clear Terminal', action: clearTerminal },
        { label: 'Restart Terminal', action: restartTerminal }
    ];

    options.forEach(option => {
        const item = document.createElement('div');
        item.textContent = option.label;
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            option.action();
            menu.remove();
        });
        menu.appendChild(item);
    });

    document.body.appendChild(menu);
    document.addEventListener('click', () => menu.remove(), { once: true });
}

function createNewTerminal() {
    const terminalId = terminalCount++;
    const terminalTabs = document.querySelector('#terminal-tabs');

    const newTab = document.createElement('div');
    newTab.className = 'terminal-tab';
    newTab.dataset.terminalId = terminalId;
    newTab.textContent = `Terminal ${terminalId + 1}`;
    newTab.addEventListener('click', () => switchTerminal(terminalId));
    terminalTabs.appendChild(newTab);

    const newContent = document.createElement('div');
    newContent.className = 'terminal-content';
    newContent.id = `terminal-content-${terminalId}`;
    newContent.style.display = 'none';
    const terminalPanel = document.querySelector('.terminal-panel');
    terminalPanel.appendChild(newContent);

    createTerminal(terminalId, newContent);
    switchTerminal(terminalId);
}

function switchTerminal(terminalId) {
    activeTerminalId = terminalId;
    const tabs = document.querySelectorAll('.terminal-tab');
    const contents = document.querySelectorAll('.terminal-content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (parseInt(tab.dataset.terminalId) === terminalId) {
            tab.classList.add('active');
        }
    });

    contents.forEach(content => {
        content.style.display = 'none';
        if (content.id === `terminal-content-${terminalId}`) {
            content.style.display = 'block';
            if (fitAddons[terminalId]) {
                fitAddons[terminalId].fit();
                sendResizeToBackend(terminalId);
            }
        }
    });
}

function closeTerminal(terminalId) {
    const terminalObj = terminals[terminalId];
    if (terminalObj && terminalObj.ws) {
        terminalObj.ws.close();
    }

    const tab = document.querySelector(`.terminal-tab[data-terminal-id="${terminalId}"]`);
    const content = document.querySelector(`#terminal-content-${terminalId}`);
    if (tab) tab.remove();
    if (content) content.remove();

    delete terminals[terminalId];
    delete fitAddons[terminalId];

    const remainingTabs = document.querySelectorAll('.terminal-tab');
    if (remainingTabs.length === 0) {
        toggleTerminal();
    } else {
        const newActiveId = parseInt(remainingTabs[0].dataset.terminalId);
        switchTerminal(newActiveId);
    }
}

function clearTerminal() {
    const terminalObj = terminals[activeTerminalId];
    if (terminalObj && terminalObj.terminal) {
        console.log(`Clearing terminal ${activeTerminalId}...`);
        terminalObj.terminal.clear();
        terminalObj.terminal.write('Terminal cleared.\r\n');
    }
}

function restartTerminal() {
    const terminalObj = terminals[activeTerminalId];
    if (terminalObj && terminalObj.ws) {
        terminalObj.ws.close();
    }

    const content = document.querySelector(`#terminal-content-${activeTerminalId}`);
    if (content) {
        content.innerHTML = '';
        createTerminal(activeTerminalId, content);
    }
}

window.clearTerminal = clearTerminal;
window.showTerminalMenu = showTerminalMenu;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing terminal...');
    initTerminal();
});
