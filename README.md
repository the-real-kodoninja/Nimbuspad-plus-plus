Welcome to Nimbuspad++
======================

Nimbuspad++ is a web-based code editor designed to combine the familiar interface of Visual Studio Code (VSCode) with the powerful editing capabilities of Vim. This guide provides an overview of its features and instructions to get started, helping you navigate and utilize the editor efficiently.

![latest build test]()

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
The Nimbuspad++ TeamNimbuspad++
===========

A lightweight, VSCode-like editor built on Vim, customized with the Nimbus color scheme and integrated with Nimbus.ai's Thunderhead assistant. Nimbuspad++ provides a modern development environment with file management, Git integration, debugging, and AI assistance, all while running in a browser-based interface.

Features
--------

### **Core Editor Features**

-   **VSCode-like Interface**: A familiar layout with a sidebar, editor pane, terminal, and status bar, styled with the Nimbus color scheme.

-   **File Explorer (NERDTree)**: Navigate and manage your project files with a tree-like structure in the sidebar (<Space>e to toggle).

-   **IntelliSense (coc.nvim)**: Autocompletion and code intelligence for various languages, triggered with <C-Space>.

-   **Status Bar (vim-airline)**: Displays editor mode, file status, and other useful information at the bottom of the screen.

-   **Code Editor**: Supports syntax highlighting for multiple languages using Highlight.js, with customizable editor settings (font size, font family, line height, etc.).

-   **Terminal Integration**: An embedded terminal powered by xterm.js, allowing you to run shell commands directly within the editor.

-   **Themes**: Choose from a variety of Nimbus and pop culture-inspired themes (e.g., Nimbus Matte Black, Blade Runner, Star Wars Jedi/Sith) or upload custom CSS themes.

### **AI Integration**

-   **Collapsible Nimbus.ai Chat Panel (Thunderhead)**:

    -   Chat with Thunderhead, an AI assistant powered by Nimbus.ai, for coding help, debugging, and more.

    -   Supports multiple view modes: Chat (default sidebar), Side-by-Side (split view with editor), and Tab (integrated as a tab in the editor).

    -   Features message controls (edit, copy, regenerate, continue) and code block generation with syntax highlighting.

    -   Upload files or photos (coming soon).

    -   View past conversation threads and manage settings via dropdown menus.

### **File and Project Management**

-   **File Explorer**: Create, rename, delete, and view files and directories in the sidebar.

-   **Tabs**: Open multiple files in tabs, with support for Markdown preview (e.g., INSTRUCTIONS.md).

-   **Preferences Panel**: Customize the editor, terminal, and UI:

    -   Editor settings: font size, font family, line height, tab size, word wrap, minimap, line numbers, bracket matching, auto-indent.

    -   Terminal settings: font size, font family, cursor style, colors, background wallpaper, opacity, custom commands.

    -   Appearance: select themes, customize colors (background, foreground, accent, etc.), or upload custom CSS.

    -   Advanced: custom JavaScript, keybindings (JSON), enable dev tools, save/load profiles.

### **Version Control**

-   **Git Integration**:

    -   View Git status (current branch, changes) in the sidebar.

    -   Stage, commit, push, and pull changes directly from the UI.

    -   Manage Git operations via the git.html panel, with API endpoints in vim-server.js for Git commands.

### **Debugging**

-   **Debug Panel**:

    -   Configure and start debugging sessions for Node.js and Python (extendable for other languages).

    -   View and manage breakpoints in the sidebar.

    -   API endpoints in vim-server.js for debug configurations and control.

### **Upcoming Features**

-   **Tor Browser Support** (Coming Soon):

    -   Access Nimbuspad++ through the Tor network for enhanced privacy and security.

    -   Run the editor in a hidden service mode for anonymous development.

-   **AviyonOS-Lite Mode** (Coming Soon):

    -   A lightweight, minimal version of Nimbuspad++ designed for low-resource environments.

    -   Optimized for performance on constrained devices, with a simplified UI and reduced feature set.

### **Other Features**

-   **Switch to VSCode**: Use <Space>vc to switch to a full VSCode instance (requires VSCode server setup).

-   **Header with Repository Management and Feedback**:

    -   Manage repositories (e.g., clone, switch projects) via the header (content in header.html).

    -   Provide feedback directly from the UI (functionality to be implemented).

-   **User Management**:

    -   Each user gets a unique ID (e.g., theme_name_code) and a dedicated workspace in repos/<userId>.

    -   User logs (user_logs.json) track IP addresses and creation timestamps.

Installation
------------

1.  **Clone the Repository**:

    ```
    git clone https://github.com/the-real-kodoninja/Nimbuspad-plus-plus.git
    cd Nimbuspad-plus-plus
    ```

2.  **Install Dependencies**:

    ```
    npm install
    ./setup.sh
    ```

    -   npm install installs Node.js dependencies (e.g., express, ws, node-pty, chokidar, simple-git).

    -   setup.sh sets up the environment, including Docker images (nimbuspad-arch) for the terminal.

3.  **Run the Editor**:

    ```
    npm start
    ```

    -   This runs node src/backend/vim-server.js, starting the server on http://localhost:3000.

Usage
-----

-   **Access the Editor**:

    -   Open your browser and navigate to http://localhost:3000.

-   **File Explorer**:

    -   Toggle with <Space>e to view and manage files in the sidebar.

-   **Switch to VSCode**:

    -   Use <Space>vc to switch to a VSCode instance (if configured).

-   **Chat with Thunderhead**:

    -   Use the collapsible Nimbus.ai panel to interact with Thunderhead for coding assistance.

-   **Terminal**:

    -   Run shell commands in the integrated terminal (powered by a Docker container running bash).

-   **Git Operations**:

    -   Use the Git panel to stage, commit, push, and pull changes.

-   **Debugging**:

    -   Configure and start debug sessions from the Debug panel.

Keybindings
-----------

-   **File Operations**:

    -   <Space>ff: Find file

    -   <Space>fs: Save file

    -   <Space>q: Quit

-   **Editor**:

    -   <C-Space>: Trigger autocompletion (IntelliSense)

    -   <Space>e: Toggle file explorer

    -   <Space>vc: Switch to VSCode

-   **Terminal**:

    -   Custom commands can be set in the Preferences panel under Terminal settings.

Project Structure
-----------------

```
Nimbuspad-plus-plus/
├── bin/                    # Executable scripts
│   └── nimbuspad++         # Main executable
├── node_modules/           # Node.js dependencies
├── repos/                  # User workspaces
├── src/
│   ├── backend/            # Backend server logic
│   │   ├── themes.js       # Theme definitions for user IDs
│   │   └── vim-server.js   # Express and WebSocket server
│   ├── ui/                 # Frontend UI components
│   │   ├── components/     # HTML components
│   │   │   ├── activity_bar/
│   │   │   ├── nimbus/
│   │   │   ├── preferences/
│   │   │   ├── sidebar_panels/
│   │   │   ├── status_bar/
│   │   │   └── terminal/
│   │   ├── np++_themes/    # CSS theme files
│   │   ├── scripts/        # JavaScript functionality
│   │   │   ├── debug.js
│   │   │   ├── editor.js
│   │   │   ├── extensions.js
│   │   │   ├── fileTree.js
│   │   │   ├── git.js
│   │   │   ├── languageIcons.js
│   │   │   ├── menu.js
│   │   │   ├── nimbus.js
│   │   │   ├── preferences.js
│   │   │   ├── search.js
│   │   │   ├── sidebar.js
│   │   │   ├── terminal.js
│   │   │   └── userProfile.js
│   │   ├── header.html
│   │   ├── index.html       # Main entry point
│   │   ├── styles.css      # Main stylesheet
│   │   └── styles.html     # Additional styles (if needed)
│   ├── utils/              # Utility scripts
│   └── vimrc               # Vim configuration
├── Dockerfile              # Docker configuration for terminal
├── INSTRUCTIONS.md         # Default workspace file
├── package.json            # Node.js dependencies and scripts
├── setup.sh                # Setup script
└── user_logs.json          # User access logs
```

Development
-----------

### **Backend**

-   **Server**: vim-server.js uses Express for HTTP and WebSocket for terminal and file system events.

-   **Terminal**: Runs in a Docker container (nimbuspad-arch) with a custom prompt based on the user ID.

-   **File System**: Uses chokidar to watch for file changes and notify clients via WebSocket.

-   **Git**: Integrates with simple-git for version control operations.

### **Frontend**

-   **UI Components**: Loaded dynamically via fetch in index.html (e.g., status_bar.html, nimbus_panel.html).

-   **Scripts**: JavaScript files in src/ui/scripts/ handle functionality (e.g., nimbus.js for Thunderhead, terminal.js for the terminal).

-   **Libraries**:

    -   marked.js for Markdown rendering

    -   xterm.js for the terminal

    -   highlight.js for syntax highlighting

### **Debugging Tips**

-   Check server logs for file serving issues (Request for: <url>, Response for: <url>: <status>).

-   Use browser console logs to verify component and script loading.

-   Ensure Docker is running for terminal functionality (docker run nimbuspad-arch).

Contributing
------------

1.  Fork the repository.

2.  Create a feature branch (git checkout -b feature/YourFeature).

3.  Commit your changes (git commit -m "Add YourFeature").

4.  Push to the branch (git push origin feature/YourFeature).

5.  Open a Pull Request.

License
-------

This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
----------------

-   Built with ❤️ by kodoninja.

-   Thanks to the open-source community for tools like Vim, VSCode, and Nimbus.ai.
