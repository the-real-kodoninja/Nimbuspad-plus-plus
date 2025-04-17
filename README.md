# Nimbuspad++

A lightweight, VSCode-like editor built on Vim, customized with the Nimbus color scheme and integrated with Nimbus.ai.

## Features
- VSCode-like interface with Nimbus color scheme
- File explorer (NERDTree)
- IntelliSense (coc.nvim)
- Status bar (vim-airline)
- Collapsible Nimbus.ai chat panel
- Option to switch to VSCode
- Header with repository management and feedback

## Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/the-real-kodoninja/Nimbuspad-plus-plus.git
   cd Nimbuspad-plus-plus
   ```

2. Install dependencies:
   ```bash
   npm install
   ./setup.sh
   ```

3. Run the editor:
   ```bash
    npm start
    ```

### Usage
- Open at http://localhost:3000
- Use <Space>e to toggle the file explorer
- Use <Space>vc to switch to VSCode
- Chat with Nimbus.ai in the collapsible panel

### Keybindings
- <Space>ff: Find file
- <Space>fs: Save file
- <Space>q: Quit
- <C-Space>: Trigger autocompletion
