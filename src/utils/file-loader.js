const fs = require('fs');
const path = require('path');

function loadMarkdownFiles() {
    const instructionsContent = fs.readFileSync(path.join(__dirname, '../INSTRUCTIONS.md'), 'utf8');
    const readmeContent = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
    return {
        'INSTRUCTIONS.md': instructionsContent,
        'README.md': readmeContent
    };
}

module.exports = { loadMarkdownFiles };
