// User profile to store custom themes and settings
const userProfile = {
    username: 'kodoninja',
    customThemes: [],
    customFonts: [],
    settings: {}
};

// Default settings for reset
const defaultSettings = {
    appearance: {
        theme: 'nimbus-matte-black-1',
        fontSize: '12px',
        fontFamily: 'monospace',
        lineHeight: '1.5',
        customBackground: '#1e1e1e',
        customForeground: '#cccccc',
        customSecondaryForeground: '#888888',
        customAccentColor: '#007acc',
        customHighlightColor: '#ffd700',
        customButtonBg: '#007acc',
        customButtonHoverBg: '#005f99',
        customInputBg: '#333333',
        customPanelBg: '#252526',
        customCodeBlockBg: '#2a2a2a'
    },
    editor: {
        tabSize: '4',
        wordWrap: false,
        minimap: false,
        lineNumbers: true,
        bracketMatching: true,
        autoIndent: true,
        customCSS: ''
    },
    terminal: {
        fontSize: '12px',
        fontFamily: 'monospace',
        fontColor: '#cccccc',
        cursorStyle: 'block',
        cursorColor: '#ffffff',
        backgroundColor: '#1e1e1e',
        wallpaper: '',
        wallpaperUrl: '',
        opacity: '1.0',
        customCommands: ''
    },
    advanced: {
        customJS: '',
        enableDevTools: false,
        customKeybindings: '{"key": "ctrl+alt+t", "command": "openNewTerminal"}'
    }
};
