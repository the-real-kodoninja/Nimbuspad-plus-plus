async function updateGitStatus() {
    try {
        const response = await fetch('http://localhost:3000/git-status');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const gitStatus = document.querySelector('#git-status');
        const gitChanges = document.querySelector('#git-changes');
        if (gitStatus && gitChanges) {
            gitStatus.innerHTML = `<h4>Branch: ${data.branch}</h4>`;
            gitChanges.innerHTML = `
                <h4>Changes:</h4>
                <ul>
                    ${data.changes.map(change => `<li>${change.path} (${change.status}) <button onclick="stageFile('${change.path}')">Stage</button></li>`).join('')}
                </ul>
            `;
        }
    } catch (err) {
        console.error('Nimbuspad++: Git status failed', err);
    }
}

async function stageFile(path) {
    try {
        const response = await fetch('http://localhost:3000/git-stage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await updateGitStatus();
    } catch (err) {
        console.error('Nimbuspad++: Failed to stage file', err);
    }
}

async function commitChanges() {
    const commitMessage = document.querySelector('#git-commit-message').value;
    if (!commitMessage) return;
    try {
        const response = await fetch('http://localhost:3000/git-commit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: commitMessage })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await updateGitStatus();
        document.querySelector('#git-commit-message').value = '';
    } catch (err) {
        console.error('Nimbuspad++: Failed to commit', err);
    }
}

async function pushChanges() {
    try {
        const response = await fetch('http://localhost:3000/git-push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await updateGitStatus();
    } catch (err) {
        console.error('Nimbuspad++: Failed to push', err);
    }
}

async function pullChanges() {
    try {
        const response = await fetch('http://localhost:3000/git-pull', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await updateGitStatus();
    } catch (err) {
        console.error('Nimbuspad++: Failed to pull', err);
    }
}

function initGit() {
    const gitPanel = document.querySelector('#git');
    const commitBtn = document.querySelector('#git-commit-btn');

    if (!gitPanel || !commitBtn) {
        console.error('Nimbuspad++: Git elements not found');
        return;
    }

    commitBtn.addEventListener('click', commitChanges);

    gitPanel.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar('git');
        updateGitStatus();
    });

    setInterval(updateGitStatus, 5000);
    updateGitStatus();
}

document.addEventListener('DOMContentLoaded', initGit);
