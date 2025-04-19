function toggleSidebar(panelId) {
    const panels = document.querySelectorAll('.sidebar-content');
    panels.forEach(panel => {
        panel.style.display = panel.id === panelId ? 'block' : 'none';
    });

    const icons = document.querySelectorAll('.activity-bar .icon');
    icons.forEach(icon => {
        icon.classList.toggle('active', icon.classList.contains(`${panelId}-icon`));
    });

    // Hide Nimbus.ai panel when switching to other sidebar panels
    const nimbusPanel = document.querySelector('#nimbus-panel');
    nimbusPanel.style.display = 'none';
}

function toggleNimbusPanel() {
    const sidebarPanels = document.querySelectorAll('.sidebar-content');
    const nimbusPanel = document.querySelector('#nimbus-panel');
    const isNimbusVisible = nimbusPanel.style.display === 'block';

    sidebarPanels.forEach(panel => panel.style.display = 'none');
    nimbusPanel.style.display = isNimbusVisible ? 'none' : 'block';

    const icons = document.querySelectorAll('.activity-bar .icon');
    icons.forEach(icon => icon.classList.remove('active'));
}

function initSidebar() {
    const sidebar = document.querySelector('#sidebar');
    const nimbusPanel = document.querySelector('#nimbus-panel');
    const leftResizeHandle = document.querySelector('.resize-handle');
    const rightResizeHandle = document.querySelector('.nimbus-resize-handle');

    // Sidebar resize logic
    let isLeftResizing = false;
    leftResizeHandle.addEventListener('mousedown', (e) => {
        isLeftResizing = true;
        document.addEventListener('mousemove', resizeLeft);
        document.addEventListener('mouseup', stopLeftResize);
    });

    function resizeLeft(e) {
        if (!isLeftResizing) return;
        const newWidth = e.clientX - document.querySelector('.activity-bar').offsetWidth;
        if (newWidth > 150 && newWidth < 500) {
            sidebar.style.width = `${newWidth}px`;
        }
    }

    function stopLeftResize() {
        isLeftResizing = false;
        document.removeEventListener('mousemove', resizeLeft);
        document.removeEventListener('mouseup', stopLeftResize);
    }

    // Nimbus.ai panel resize logic
    let isRightResizing = false;
    rightResizeHandle.addEventListener('mousedown', (e) => {
        isRightResizing = true;
        document.addEventListener('mousemove', resizeRight);
        document.addEventListener('mouseup', stopRightResize);
    });

    function resizeRight(e) {
        if (!isRightResizing) return;
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 200 && newWidth < 600) {
            nimbusPanel.style.width = `${newWidth}px`;
        }
    }

    function stopRightResize() {
        isRightResizing = false;
        document.removeEventListener('mousemove', resizeRight);
        document.removeEventListener('mouseup', stopRightResize);
    }
}

document.addEventListener('DOMContentLoaded', initSidebar);
