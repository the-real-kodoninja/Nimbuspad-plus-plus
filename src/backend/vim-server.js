const WebSocket = require('ws');
const pty = require('node-pty');
const path = require('path');
const chokidar = require('chokidar');
const express = require('express');
const fs = require('fs').promises;
const simpleGit = require('simple-git');
const crypto = require('crypto');

// User management and logging
const userLogsPath = path.join(__dirname, '../../user_logs.json');
let userLogs = {};
try {
    userLogs = JSON.parse(fs.readFileSync(userLogsPath, 'utf8'));
} catch (err) {
    console.log('No user logs found, starting fresh.');
}

function generateUserId() {
    const themes = require('./themes');
    const themeKeys = Object.keys(themes);
    const theme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const names = themes[theme];
    const name = names[Math.floor(Math.random() * names.length)];
    const code = crypto.randomBytes(2).toString('hex');
    return `${theme}_${name.toLowerCase()}_${code}`;
}

async function getUserDir(req) {
    let userId = req.session?.userId;
    if (!userId) {
        userId = generateUserId();
        req.session.userId = userId;

        // Log IP
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        userLogs[userId] = { ip, createdAt: new Date().toISOString() };
        await fs.writeFile(userLogsPath, JSON.stringify(userLogs, null, 2)).catch(err => {
            console.error('Failed to save user logs:', err);
        });
    }

    let baseDir = path.join(__dirname, '../../repos', userId);
    const projectId = req.query.projectId || req.session.projectId;
    if (projectId) {
        req.session.projectId = projectId;
        baseDir = path.join(baseDir, projectId);
    }

    await fs.mkdir(baseDir, { recursive: true }).catch(err => {
        console.error(`Failed to create user directory ${baseDir}:`, err);
    });

    // Ensure INSTRUCTIONS.md exists
    const instructionsPath = path.join(baseDir, 'INSTRUCTIONS.md');
    try {
        await fs.access(instructionsPath);
    } catch (err) {
        await fs.writeFile(instructionsPath, '# Welcome to Nimbuspad++\n\nThis is your workspace. Start coding!');
    }

    return baseDir;
}

function startVimServer() {
    const app = express();
    const server = require('http').createServer(app);
    const wss = new WebSocket.Server({ server, path: '/terminal' });

    let fsPort = 3004;
    const maxPortRetries = 10;
    let fsWss;

    function createFsWebSocketServer(port) {
        try {
            fsWss = new WebSocket.Server({ port });
            console.log(`File system WebSocket server running on ws://localhost:${port}`);
            return true;
        } catch (err) {
            if (err.code === 'EADDRINUSE' && port < 3004 + maxPortRetries) {
                console.log(`Port ${port} in use, trying ${port + 1}...`);
                return createFsWebSocketServer(port + 1);
            }
            throw err;
        }
    }

    try {
        createFsWebSocketServer(fsPort);
    } catch (err) {
        console.error('Failed to start file system WebSocket server:', err);
        process.exit(1);
    }

    console.log('Vim WebSocket server running on ws://localhost:3000/terminal');

    // Session middleware to persist userId and projectId
    const session = require('express-session');
    app.use(session({
        secret: 'nimbuspad-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));

    app.use(express.static(path.join(__dirname, '../ui')));
    app.use(express.json());

    app.get('/list', async (req, res) => {
        const dirPath = await getUserDir(req);
        try {
            const files = await fs.readdir(dirPath, { withFileTypes: true });
            const fileList = await Promise.all(files.map(async (file) => {
                const fullPath = path.join(dirPath, file.name);
                const stats = await fs.stat(fullPath);
                const relativePath = path.relative(path.join(__dirname, '../../repos'), fullPath).replace(/\\/g, '/');
                return {
                    name: file.name,
                    path: relativePath,
                    type: file.isDirectory() ? 'directory' : 'file',
                    extension: file.isFile() ? path.extname(file.name).slice(1) : undefined,
                    children: file.isDirectory() ? [] : undefined,
                    size: stats.size,
                    modified: stats.mtime
                };
            }));
            res.json(fileList);
        } catch (err) {
            console.error(`Failed to list directory ${dirPath}:`, err);
            res.status(500).json({ error: `Failed to list directory: ${err.message}` });
        }
    });

    app.get('/file', async (req, res) => {
        const filePath = path.join(await getUserDir(req), path.basename(req.query.path));
        try {
            const content = await fs.readFile(filePath, 'utf8');
            res.send(content);
        } catch (err) {
            console.error(`Failed to read file ${filePath}:`, err);
            res.status(500).send(`Failed to read file: ${err.message}`);
        }
    });

    app.post('/create', async (req, res) => {
        const { path: relativePath, content, type } = req.body;
        const fullPath = path.join(await getUserDir(req), path.basename(relativePath));
        try {
            if (type === 'directory') {
                await fs.mkdir(fullPath, { recursive: true });
            } else {
                await fs.writeFile(fullPath, content || '');
            }
            res.status(200).send('Created');
        } catch (err) {
            console.error(`Failed to create ${fullPath}:`, err);
            res.status(500).send(`Failed to create: ${err.message}`);
        }
    });

    app.post('/delete', async (req, res) => {
        const { path: relativePath } = req.body;
        const fullPath = path.join(await getUserDir(req), path.basename(relativePath));
        try {
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory()) {
                await fs.rm(fullPath, { recursive: true });
            } else {
                await fs.unlink(fullPath);
            }
            res.status(200).send('Deleted');
        } catch (err) {
            console.error(`Failed to delete ${fullPath}:`, err);
            res.status(500).send(`Failed to delete: ${err.message}`);
        }
    });

    app.post('/rename', async (req, res) => {
        const { oldPath, newPath } = req.body;
        const oldFullPath = path.join(await getUserDir(req), path.basename(oldPath));
        const newFullPath = path.join(await getUserDir(req), path.basename(newPath));
        try {
            await fs.rename(oldFullPath, newFullPath);
            res.status(200).send('Renamed');
        } catch (err) {
            console.error(`Failed to rename ${oldFullPath} to ${newFullPath}:`, err);
            res.status(500).send(`Failed to rename: ${err.message}`);
        }
    });

    app.get('/git-status', async (req, res) => {
        const git = simpleGit(await getUserDir(req));
        try {
            const status = await git.status();
            res.json({
                branch: status.current,
                changes: status.files.map(file => ({
                    path: file.path,
                    status: file.working_dir
                }))
            });
        } catch (err) {
            console.error('Failed to get Git status:', err);
            res.status(500).send('Failed to get Git status');
        }
    });

    app.post('/git-stage', async (req, res) => {
        const { path } = req.body;
        const git = simpleGit(await getUserDir(req));
        try {
            await git.add(path);
            res.status(200).send('Staged');
        } catch (err) {
            console.error(`Failed to stage ${path}:`, err);
            res.status(500).send('Failed to stage');
        }
    });

    app.post('/git-commit', async (req, res) => {
        const { message } = req.body;
        const git = simpleGit(await getUserDir(req));
        try {
            await git.commit(message);
            res.status(200).send('Committed');
        } catch (err) {
            console.error('Failed to commit:', err);
            res.status(500).send('Failed to commit');
        }
    });

    app.post('/git-push', async (req, res) => {
        const git = simpleGit(await getUserDir(req));
        try {
            await git.push();
            res.status(200).send('Pushed');
        } catch (err) {
            console.error('Failed to push:', err);
            res.status(500).send('Failed to push');
        }
    });

    app.post('/git-pull', async (req, res) => {
        const git = simpleGit(await getUserDir(req));
        try {
            await git.pull();
            res.status(200).send('Pulled');
        } catch (err) {
            console.error('Failed to pull:', err);
            res.status(500).send('Failed to pull');
        }
    });

    app.get('/debug-configs', async (req, res) => {
        res.json([
            { name: 'Node.js', type: 'node', request: 'launch' },
            { name: 'Python', type: 'python', request: 'launch' }
        ]);
    });

    app.post('/debug-start', async (req, res) => {
        const { config } = req.body;
        console.log(`Starting debug for ${config}`);
        res.status(200).send('Debug started');
    });

    app.get('/debug-breakpoints', async (req, res) => {
        res.json([
            { file: 'index.js', line: 10 },
            { file: 'app.py', line: 20 }
        ]);
    });

    wss.on('connection', (ws, req) => {
        console.log('Client connected to Vim server');

        const userDir = getUserDir(req);
        const userId = req.session.userId;
        const customPrompt = `${userId}@AviyonOS:~ `;
        console.log(`Setting PS1 to: ${customPrompt}`);

        const shell = pty.spawn('docker', [
            'run',
            '-i',
            '--rm',
            '-v', `${userDir}:/home/nimbususer/repos`,
            'nimbuspad-arch',
            'bash', '-c', `PS1='${customPrompt}' bash -i`
        ], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: '/home/nimbususer/repos'
        });

        shell.write('echo "Terminal initialized"\r');

        shell.onData((data) => {
            console.log('Shell output:', JSON.stringify(data));
            if (ws.readyState === WebSocket.OPEN) {
                const normalizedData = data.replace(/\r\n/g, '\r\n').replace(/\n/g, '\r\n');
                ws.send(normalizedData);
            } else {
                console.warn('WebSocket not open, cannot send data');
            }
        });

        shell.onExit(({ exitCode, signal }) => {
            console.log(`Shell exited with code ${exitCode}, signal ${signal}`);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(`Shell exited with code ${exitCode}\r\n`);
            }
        });

        shell.on('error', (err) => {
            console.error('Shell error:', err);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(`Shell error: ${err.message}\r\n`);
            }
        });

        ws.on('message', (message) => {
            console.log('Received message from client:', message.toString());
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'resize') {
                    console.log(`Resizing terminal to ${data.cols}x${data.rows}`);
                    shell.resize(data.cols, data.rows);
                } else if (data.command) {
                    console.log(`Executing command: ${data.command}`);
                    shell.write(data.command + '\r');
                }
            } catch (e) {
                console.log(`Raw message: ${message.toString()}`);
                shell.write(message.toString());
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            shell.kill();
        });

        ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });
    });

    const watcher = chokidar.watch(path.join(__dirname, '../../repos'), {
        persistent: true,
        ignoreInitial: false
    });

    watcher.on('all', (event, filePath) => {
        console.log(`File system event: ${event} at ${filePath}`);
        fsWss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ event, path: path.relative(path.join(__dirname, '../../repos'), filePath).replace(/\\/g, '/') }));
            }
        });
    });

    server.listen(3000, () => {
        console.log('Nimbuspad++ running at http://localhost:3000');
    });

    process.on('SIGINT', () => {
        console.log('Shutting down server...');
        server.close();
        fsWss.close();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('Shutting down server...');
        server.close();
        fsWss.close();
        process.exit(0);
    });
}

module.exports = { startVimServer };
