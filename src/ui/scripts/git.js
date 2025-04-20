function initGit() {
    const commitMessageInput = document.getElementById('git-commit-message');
    const commitButton = document.getElementById('git-commit-btn');
    const changesContainer = document.getElementById('git-changes');
    const changesCountBadge = document.getElementById('git-changes-count');

    // Mock Git changes (in a real app, fetch from Git)
    let gitChanges = [
        { file: 'src/index.js', status: 'modified', staged: false },
        { file: 'src/styles.css', status: 'added', staged: false },
        { file: 'src/oldfile.txt', status: 'deleted', staged: false }
    ];

    function updateGitChanges() {
        changesContainer.innerHTML = '';
        const unstagedChanges = gitChanges.filter(change => !change.staged);
        const stagedChanges = gitChanges.filter(change => change.staged);

        // Update badge with total number of changes
        const totalChanges = gitChanges.length;
        changesCountBadge.textContent = totalChanges;
        changesCountBadge.style.display = totalChanges > 0 ? 'flex' : 'none';

        // Display staged changes
        if (stagedChanges.length > 0) {
            const stagedHeader = document.createElement('div');
            stagedHeader.className = 'git-changes-header';
            stagedHeader.textContent = 'Staged Changes';
            changesContainer.appendChild(stagedHeader);

            stagedChanges.forEach(change => {
                const changeItem = document.createElement('div');
                changeItem.innerHTML = `
                    <div class="git-change-item">
                        <span class="git-change-status ${change.status}">${change.status.charAt(0).toUpperCase()}</span>
                        <span>${change.file}</span>
                    </div>
                    <div class="git-change-actions">
                        <div class="git-unstage-btn" title="Unstage"></div>
                    </div>
                `;
                changeItem.querySelector('.git-unstage-btn').addEventListener('click', () => {
                    change.staged = false;
                    updateGitChanges();
                });
                changesContainer.appendChild(changeItem);
            });
        }

        // Display unstaged changes
        if (unstagedChanges.length > 0) {
            const unstagedHeader = document.createElement('div');
            unstagedHeader.className = 'git-changes-header';
            unstagedHeader.textContent = 'Changes';
            changesContainer.appendChild(unstagedHeader);

            unstagedChanges.forEach(change => {
                const changeItem = document.createElement('div');
                changeItem.innerHTML = `
                    <div class="git-change-item">
                        <span class="git-change-status ${change.status}">${change.status.charAt(0).toUpperCase()}</span>
                        <span>${change.file}</span>
                    </div>
                    <div class="git-change-actions">
                        <div class="git-stage-btn" title="Stage"></div>
                    </div>
                `;
                changeItem.querySelector('.git-stage-btn').addEventListener('click', () => {
                    change.staged = true;
                    updateGitChanges();
                });
                changesContainer.appendChild(changeItem);
            });
        }
    }

    commitButton.addEventListener('click', () => {
        const message = commitMessageInput.value.trim();
        if (!message) {
            alert('Please enter a commit message.');
            return;
        }
        if (gitChanges.every(change => !change.staged)) {
            alert('No changes staged for commit.');
            return;
        }
        // Simulate commit (in a real app, execute `git commit`)
        gitChanges = gitChanges.filter(change => !change.staged);
        commitMessageInput.value = '';
        updateGitChanges();
        alert(`Committed with message: "${message}"`);
    });

    window.refreshGitStatus = function() {
        // Simulate refreshing Git status (in a real app, fetch from Git)
        gitChanges.push({ file: `src/newfile-${Date.now()}.js`, status: 'added', staged: false });
        updateGitChanges();
    };

    // Initial update
    updateGitChanges();
}

document.addEventListener('DOMContentLoaded', initGit);
