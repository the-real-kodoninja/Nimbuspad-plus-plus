function toggleSidebar(panelId) {
    const panels = document.querySelectorAll('.sidebar-content');
    const icons = document.querySelectorAll('.activity-bar .icon');

    // Hide all panels and remove active class from all icons
    panels.forEach(panel => {
        panel.style.display = 'none';
    });
    icons.forEach(icon => {
        icon.classList.remove('active');
    });

    // Show the selected panel and mark its icon as active
    const targetPanel = document.getElementById(panelId);
    const targetIcon = document.querySelector(`.activity-bar .icon[data-panel="${panelId}"]`);
    const isPanelVisible = targetPanel.style.display === 'flex';

    if (!isPanelVisible) {
        targetPanel.style.display = 'flex';
        targetIcon.classList.add('active');
    }

    // Hide Nimbus.ai panel when switching to other sidebar panels
    const nimbusPanel = document.querySelector('#nimbus-panel');
    nimbusPanel.style.display = 'none';
}

function toggleNimbusPanel() {
    const sidebarPanels = document.querySelectorAll('.sidebar-content');
    const nimbusPanel = document.querySelector('#nimbus-panel');
    const isNimbusVisible = nimbusPanel.style.display === 'block';

    // Toggle Nimbus.ai panel visibility
    if (isNimbusVisible) {
        nimbusPanel.style.display = 'none';
    } else {
        // Hide sidebar panels and show Nimbus.ai panel
        sidebarPanels.forEach(panel => panel.style.display = 'none');
        const icons = document.querySelectorAll('.activity-bar .icon');
        icons.forEach(icon => icon.classList.remove('active'));
        nimbusPanel.style.display = 'block';
    }
}

function initSidebar() {
    const sidebar = document.querySelector('#sidebar');
    const nimbusPanel = document.querySelector('#nimbus-panel');
    const leftResizeHandle = document.querySelector('.resize-handle');
    const rightResizeHandle = document.querySelector('.nimbus-resize-handle');
    const icons = document.querySelectorAll('.activity-bar .icon');

    // Add click listeners to Activity Bar icons
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const panelId = icon.dataset.panel;
            toggleSidebar(panelId);
        });
    });

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
