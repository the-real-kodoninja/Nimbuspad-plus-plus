const fs = require('fs');
const path = require('path');

function loadMarkdownFiles() {
    const markdownFiles = {};
    const srcDir = path.join(__dirname, '../');
    const files = fs.readdirSync(srcDir);
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
            markdownFiles[file] = content;
        }
    }
    return markdownFiles;
}

module.exports = { loadMarkdownFiles };
