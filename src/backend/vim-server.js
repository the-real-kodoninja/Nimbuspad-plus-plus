const WebSocket = require('ws');
const pty = require('node-pty');
const fs = require('fs');
const path = require('path');

function startVimServer() {
    const wss = new WebSocket.Server({ port: 3001 });
    console.log('Vim WebSocket server running on ws://localhost:3001');

    wss.on('connection', (ws) => {
        console.log('Client connected to Vim server');

        // Ensure the repos directory exists on the host
        const hostReposDir = path.join(__dirname, '../../repos');
        if (!fs.existsSync(hostReposDir)) {
            fs.mkdirSync(hostReposDir, { recursive: true });
            console.log(`Created host repos directory: ${hostReposDir}`);
        }

        // Spawn the terminal inside the Docker container
        const shell = pty.spawn('docker', [
            'run',
            '-i',
            '--rm',
            '-v', `${hostReposDir}:/home/nimbususer/repos`,
            'nimbuspad-arch',
            '/bin/bash',
            '-c',
            'mkdir -p /home/nimbususer/repos && cd /home/nimbususer && exec bash'
        ], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: '/home/nimbususer',
            env: { PS1: 'user@nimbispad++:~ ' }
        });

        // Forward shell output to WebSocket
        shell.onData((data) => {
            ws.send(data);
        });

        // Debug: Shell exit
        shell.onExit(({ exitCode, signal }) => {
            console.log(`Shell exited with code ${exitCode}, signal ${signal}`);
            ws.send(`Shell exited with code ${exitCode}\r\n`);
        });

        // Handle incoming WebSocket messages (commands from the client)
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'resize') {
                    shell.resize(data.cols, data.rows);
                } else {
                    shell.write(message.toString());
                }
            } catch (e) {
                shell.write(message.toString());
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            shell.kill();
        });
    });
}

module.exports = { startVimServer };
