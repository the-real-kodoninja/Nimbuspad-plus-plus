function initDebug() {
    const startBtn = document.querySelector('#debug-start-btn');
    const configSelect = document.querySelector('#debug-config');
    const breakpoints = document.querySelector('#debug-breakpoints');
    const variables = document.querySelector('#debug-variables');

    if (!startBtn || !configSelect || !breakpoints || !variables) {
        console.error('Nimbuspad++: Debug elements not found');
        return;
    }

    async function loadConfigurations() {
        try {
            const response = await fetch('http://localhost:3000/debug-configs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const configs = await response.json();
            configSelect.innerHTML = '<option value="">Select Configuration</option>';
            configs.forEach(config => {
                const option = document.createElement('option');
                option.value = config.name;
                option.textContent = config.name;
                configSelect.appendChild(option);
            });
        } catch (err) {
            console.error('Nimbuspad++: Failed to load debug configs', err);
        }
    }

    startBtn.addEventListener('click', async () => {
        const config = configSelect.value;
        if (!config) return;
        try {
            const response = await fetch('http://localhost:3000/debug-start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('Nimbuspad++: Debugging started');
        } catch (err) {
            console.error('Nimbuspad++: Debug start failed', err);
        }
    });

    async function updateBreakpoints() {
        try {
            const response = await fetch('http://localhost:3000/debug-breakpoints');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const bpList = await response.json();
            breakpoints.innerHTML = '';
            bpList.forEach(bp => {
                const div = document.createElement('div');
                div.textContent = `${bp.file}:${bp.line}`;
                breakpoints.appendChild(div);
            });
        } catch (err) {
            console.error('Nimbuspad++: Failed to load breakpoints', err);
        }
    }

    loadConfigurations();
    updateBreakpoints();
}

document.addEventListener('DOMContentLoaded', initDebug);
