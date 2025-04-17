// nimbuspad-plus-plus/src/ui/nimbus-panel.js
document.addEventListener('DOMContentLoaded', () => {
    const panelToggle = document.getElementById('nimbus-panel-toggle');
    const panel = document.getElementById('nimbus-panel');

    panelToggle.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        panelToggle.textContent = panel.classList.contains('collapsed') ? '>' : '<';
    });

    // Simulate Nimbus.ai chat (placeholder for actual integration)
    const chatInput = document.getElementById('nimbus-chat-input');
    const chatOutput = document.getElementById('nimbus-chat-output');

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value;
            chatOutput.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
            chatOutput.innerHTML += `<p><strong>Nimbus.ai:</strong> I'm here to help! (Echo: ${message})</p>`;
            chatInput.value = '';
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }
    });
});
