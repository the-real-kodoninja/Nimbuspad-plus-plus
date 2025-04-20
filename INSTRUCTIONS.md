Welcome to Nimbuspad++
======================

Nimbuspad++ is a web-based code editor designed to combine the familiar interface of Visual Studio Code (VSCode) with the powerful editing capabilities of Vim. This guide provides an overview of its features and instructions to get started, helping you navigate and utilize the editor efficiently.

* * * * *

What is Nimbuspad++?
--------------------

Nimbuspad++ is a modern development environment that runs in your browser, offering a VSCode-like interface powered by Vim for rapid code editing. It includes a file explorer, tabbed editing, an integrated terminal, and a Nimbus.ai assistant for real-time coding support. Whether you're writing JavaScript, exploring files, or leveraging Vim's keybindings, Nimbuspad++ is built to enhance your workflow with a seamless and intuitive experience.

* * * * *

Getting Started with Nimbuspad++
--------------------------------

### 1\. Interface Overview

When you open Nimbuspad++, the interface is divided into several key areas:

-   **Activity Bar (Left Edge):** A vertical bar with icons for File Explorer, Search, Git, Debug, and Extensions. Click an icon to switch panels.

-   **File Explorer (Left Sidebar):** Displays your project's files and folders (e.g., myproject, script.js, test.txt). Resize it by dragging the right edge or collapse it by double-clicking the Explorer icon.

-   **Tabs (Top Center):** Open files appear as tabs. INSTRUCTIONS.md is open by default and read-only. Click the "x" to close a tab or reopen it via the status bar.

-   **Editor Area (Center):** The main workspace for viewing and editing code or Markdown. Supports syntax highlighting for multiple languages.

-   **Terminal (Bottom):** An integrated terminal running Vim in a Docker container. Toggle it with **Ctrl+`** or by clicking "Terminal" in the status bar.

-   **Status Bar (Bottom):** Shows cursor position (Ln 1, Col 1), indentation (Spaces: 4), encoding (UTF-8), and quick actions (Instructions, Terminal, Nimbus.ai).

-   **Nimbus.ai Panel (Right):** A collapsible panel for interacting with the Nimbus.ai assistant. Toggle it with the pink "Nimbus.ai" button or status bar link.

### 2\. Opening and Managing Files

-   In the File Explorer, click a file (e.g., script.js) to open it in a new tab with syntax highlighting.

-   Right-click files or folders for options like "New File," "New Folder," or "Delete."

-   Close tabs by clicking the "x" or using **Ctrl+W**. Reopen INSTRUCTIONS.md by clicking "Instructions" in the status bar.

-   Files are saved to /home/nimbususer/repos in the Docker container and persist across sessions.

### 3\. Editing with Vim

Nimbuspad++ uses Vim for editing within the terminal:

-   Open the terminal with **Ctrl+`** or click "Terminal" in the status bar.

-   Navigate to a file (e.g., cd /home/nimbususer/repos; vim script.js).

-   Vim starts in **normal mode**. Press i to enter **insert mode** and type code.

-   Save changes: Press **Esc**, then :w and **Enter**.

-   Quit Vim: Press **Esc**, then :q and **Enter**.

-   For advanced Vim commands, consult the Nimbus.ai panel or Vim documentation.

### 4\. Using the Terminal

-   The terminal runs a Bash shell in a Docker container, starting at /home/nimbususer/repos.

-   Create new terminals with **Ctrl+T** for multiple sessions.

-   Run commands like ls, git, or node to interact with your project.

-   Changes in the terminal (e.g., touch newfile.js) automatically refresh the File Explorer.

### 5\. Interacting with Nimbus.ai

-   Click the pink "Nimbus.ai" button or status bar link to open the assistant panel.

-   Ask questions like "How do I write a for loop in JavaScript?" for tailored coding advice.

-   Resize or collapse the panel by dragging its edge or clicking the toggle arrow.

### 6\. Keyboard Shortcuts

Nimbuspad++ supports the following hotkeys for efficient navigation:

-   **Ctrl+`**: Toggle the terminal panel.

-   **Ctrl+T**: Open a new terminal session.

-   **Ctrl+W**: Close the active tab.

-   **Ctrl+Tab**: Switch to the next tab (planned for future updates).

-   Additional shortcuts can be explored via the Nimbus.ai panel.

### 7\. Customizing the Interface

-   **Resize Panels:** Drag the edges of the File Explorer or Nimbus.ai panel to adjust their width.

-   **Collapse File Explorer:** Double-click the Explorer icon in the Activity Bar to hide the sidebar, leaving only the Activity Bar visible. Double-click again to restore.

-   **Switch Panels:** Use Activity Bar icons to toggle between File Explorer, Search, Git, etc. (Search and others are placeholders for future features).

* * * * *

Next Steps
----------

With Nimbuspad++, you're equipped to write code, manage projects, and learn Vim in a modern, browser-based environment. Experiment with files in the File Explorer, practice Vim commands in the terminal, or ask Nimbus.ai for coding tips. If you need a refresher, click "Instructions" in the status bar to revisit this guide.

For feedback or feature requests, contact the Nimbuspad++ team via the Nimbus.ai panel. Happy coding!

Best regards,\
The Nimbuspad++ Team
