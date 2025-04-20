// Sanitize CSS to prevent malicious code
function sanitizeCSS(css) {
    css = css.replace(/url\(/gi, '');
    css = css.replace(/@import/gi, '');
    css = css.replace(/expression\(/gi, '');
    css = css.replace(/javascript:/gi, '');
    css = css.replace(/<script/gi, '');
    css = css.replace(/on[a-z]+\s*=/gi, '');
    return css;
}

// Apply settings to the editor and terminal
function applySettings() {
    const fontSize = document.getElementById('font-size').value;
    const fontFamily = document.getElementById('font-family').value;
    const lineHeight = document.getElementById('line-height').value;
    const tabSize = document.getElementById('tab-size').value;
    const wordWrap = document.getElementById('word-wrap').checked;
    const minimap = document.getElementById('minimap').checked;
    const lineNumbers = document.getElementById('line-numbers').checked;
    const bracketMatching = document.getElementById('bracket-matching').checked;
    const autoIndent = document.getElementById('auto-indent').checked;
    const customCSS = document.getElementById('custom-css').value;
    const terminalFontSize = document.getElementById('terminal-font-size').value;
    const terminalFontFamily = document.getElementById('terminal-font-family').value;
    const terminalFontColor = document.getElementById('terminal-font-color').value;
    const terminalCursorStyle = document.getElementById('terminal-cursor-style').value;
    const terminalCursorColor = document.getElementById('terminal-cursor-color').value;
    const terminalBackgroundColor = document.getElementById('terminal-background-color').value;
    const terminalWallpaper = document.getElementById('terminal-wallpaper').files[0];
    const terminalWallpaperUrl = document.getElementById('terminal-wallpaper-url').value;
    const terminalOpacity = document.getElementById('terminal-opacity').value;
    const terminalCustomCommands = document.getElementById('terminal-custom-commands').value;
    const customJS = document.getElementById('custom-js').value;
    const enableDevTools = document.getElementById('enable-dev-tools').checked;
    const customKeybindings = document.getElementById('custom-keybindings').value;

    // Apply editor settings
    document.querySelector('.editor').style.fontSize = fontSize;
    document.querySelector('.editor').style.fontFamily = fontFamily;
    document.querySelector('.editor').style.lineHeight = lineHeight;
    document.getElementById('indentation').textContent = `Spaces: ${tabSize}`;
    document.querySelector('.editor').style.whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
    document.querySelector('.editor').style.overflowX = wordWrap ? 'hidden' : 'auto';

    // Simulate minimap, line numbers, bracket matching, auto-indent
    if (!minimap) console.log('Minimap disabled');
    if (!lineNumbers) console.log('Line numbers disabled');
    if (!bracketMatching) console.log('Bracket matching disabled');
    if (!autoIndent) console.log('Auto indent disabled');

    // Apply custom CSS
    if (customCSS) {
        const sanitizedCSS = sanitizeCSS(customCSS);
        const style = document.createElement('style');
        style.textContent = sanitizedCSS;
        document.head.appendChild(style);
    }

    // Apply terminal settings
    const terminalPanel = document.querySelector('.terminal-panel');
    const terminalContent = document.querySelector('.terminal-content');
    terminalContent.style.fontSize = terminalFontSize;
    terminalContent.style.color = terminalFontColor;
    terminalContent.style.opacity = terminalOpacity;

    if (terminalFontFamily !== 'custom') {
        terminalContent.style.fontFamily = terminalFontFamily;
    }

    const terminal = terminals[activeTerminalId]?.terminal;
    if (terminal) {
        terminal.setOption('cursorStyle', terminalCursorStyle);
        terminal.setOption('cursorColor', terminalCursorColor);
        terminal.setOption('background', terminalBackgroundColor);
    }

    // Apply terminal background
    if (terminalWallpaper) {
        const reader = new FileReader();
        reader.onload = (e) => {
            terminalContent.style.backgroundImage = `url(${e.target.result})`;
            terminalContent.style.backgroundSize = 'cover';
            terminalContent.style.backgroundPosition = 'center';
            document.getElementById('terminal-wallpaper-preview').style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(terminalWallpaper);
    } else if (terminalWallpaperUrl) {
        terminalContent.style.backgroundImage = `url(${terminalWallpaperUrl})`;
        terminalContent.style.backgroundSize = 'cover';
        terminalContent.style.backgroundPosition = 'center';
        document.getElementById('terminal-wallpaper-preview').style.backgroundImage = `url(${terminalWallpaperUrl})`;
    } else {
        terminalContent.style.backgroundImage = 'none';
        terminalContent.style.backgroundColor = terminalBackgroundColor;
        document.getElementById('terminal-wallpaper-preview').style.backgroundImage = 'none';
    }

    if (terminalCustomCommands) {
        console.log('Custom terminal commands:', terminalCustomCommands);
        const ws = terminals[activeTerminalId]?.ws;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(terminalCustomCommands + '\n');
        }
    }

    // Apply custom JS (safely)
    if (customJS) {
        try {
            const safeFunction = new Function(customJS);
            safeFunction();
        } catch (e) {
            console.error('Error in custom JS:', e);
        }
    }

    // Enable dev tools
    if (enableDevTools) {
        console.log('Dev tools enabled');
        if (window.devTools) window.devTools.show();
    }

    // Apply custom keybindings
    if (customKeybindings) {
        try {
            const bindings = JSON.parse(customKeybindings);
            document.removeEventListener('keydown', handleCustomKeybindings);
            document.addEventListener('keydown', handleCustomKeybindings);
            window.customKeybindings = bindings;
        } catch (e) {
            console.error('Error in custom keybindings:', e);
        }
    }

    // Apply theme customizations
    const root = document.documentElement;
    root.style.setProperty('--background', document.getElementById('custom-background').value);
    root.style.setProperty('--foreground', document.getElementById('custom-foreground').value);
    root.style.setProperty('--secondary-foreground', document.getElementById('custom-secondary-foreground').value);
    root.style.setProperty('--accent-color', document.getElementById('custom-accent-color').value);
    root.style.setProperty('--highlight-color', document.getElementById('custom-highlight-color').value);
    root.style.setProperty('--button-bg', document.getElementById('custom-button-bg').value);
    root.style.setProperty('--button-hover-bg', document.getElementById('custom-button-hover-bg').value);
    root.style.setProperty('--input-bg', document.getElementById('custom-input-bg').value);
    root.style.setProperty('--panel-bg', document.getElementById('custom-panel-bg').value);
    root.style.setProperty('--code-block-bg', document.getElementById('custom-code-block-bg').value);

    // Save settings to user profile
    userProfile.settings = {
        fontSize,
        fontFamily,
        lineHeight,
        tabSize,
        wordWrap,
        minimap,
        lineNumbers,
        bracketMatching,
        autoIndent,
        customCSS,
        terminalFontSize,
        terminalFontFamily: terminalFontFamily === 'custom' ? document.getElementById('terminal-font-url').value : terminalFontFamily,
        terminalFontColor,
        terminalCursorStyle,
        terminalCursorColor,
        terminalBackgroundColor,
        terminalWallpaper: terminalWallpaper ? terminalWallpaper.name : '',
        terminalWallpaperUrl,
        terminalOpacity,
        terminalCustomCommands,
        customJS,
        enableDevTools,
        customKeybindings,
        themeCustomizations: {
            background: document.getElementById('custom-background').value,
            foreground: document.getElementById('custom-foreground').value,
            secondaryForeground: document.getElementById('custom-secondary-foreground').value,
            accentColor: document.getElementById('custom-accent-color').value,
            highlightColor: document.getElementById('custom-highlight-color').value,
            buttonBg: document.getElementById('custom-button-bg').value,
            buttonHoverBg: document.getElementById('custom-button-hover-bg').value,
            inputBg: document.getElementById('custom-input-bg').value,
            panelBg: document.getElementById('custom-panel-bg').value,
            codeBlockBg: document.getElementById('custom-code-block-bg').value
        }
    };
}

// Reset functions for each section
function resetAppearance() {
    const settings = defaultSettings.appearance;
    document.getElementById('theme-select').value = settings.theme;
    document.getElementById('font-size').value = settings.fontSize;
    document.getElementById('font-family').value = settings.fontFamily;
    document.getElementById('line-height').value = settings.lineHeight;
    document.getElementById('custom-background').value = settings.customBackground;
    document.getElementById('custom-foreground').value = settings.customForeground;
    document.getElementById('custom-secondary-foreground').value = settings.customSecondaryForeground;
    document.getElementById('custom-accent-color').value = settings.customAccentColor;
    document.getElementById('custom-highlight-color').value = settings.customHighlightColor;
    document.getElementById('custom-button-bg').value = settings.customButtonBg;
    document.getElementById('custom-button-hover-bg').value = settings.customButtonHoverBg;
    document.getElementById('custom-input-bg').value = settings.customInputBg;
    document.getElementById('custom-panel-bg').value = settings.customPanelBg;
    document.getElementById('custom-code-block-bg').value = settings.customCodeBlockBg;
    applySettings();
    const themeStylesheet = document.getElementById('theme-stylesheet');
    themeStylesheet.href = `np++_themes/${settings.theme}.css`;
}

function resetEditor() {
    const settings = defaultSettings.editor;
    document.getElementById('tab-size').value = settings.tabSize;
    document.getElementById('word-wrap').checked = settings.wordWrap;
    document.getElementById('minimap').checked = settings.minimap;
    document.getElementById('line-numbers').checked = settings.lineNumbers;
    document.getElementById('bracket-matching').checked = settings.bracketMatching;
    document.getElementById('auto-indent').checked = settings.autoIndent;
    document.getElementById('custom-css').value = settings.customCSS;
    updateCodeEditor('custom-css', 'language-css');
    applySettings();
}

function resetTerminal() {
    const settings = defaultSettings.terminal;
    document.getElementById('terminal-font-size').value = settings.fontSize;
    document.getElementById('terminal-font-family').value = settings.fontFamily;
    document.getElementById('terminal-font-color').value = settings.fontColor;
    document.getElementById('terminal-cursor-style').value = settings.cursorStyle;
    document.getElementById('terminal-cursor-color').value = settings.cursorColor;
    document.getElementById('terminal-background-color').value = settings.backgroundColor;
    document.getElementById('terminal-wallpaper').value = '';
    document.getElementById('terminal-wallpaper-url').value = settings.wallpaperUrl;
    document.getElementById('terminal-opacity').value = settings.opacity;
    document.getElementById('terminal-custom-commands').value = settings.customCommands;
    document.getElementById('terminal-wallpaper-preview').style.backgroundImage = 'none';
    document.getElementById('custom-terminal-font-url-item').style.display = 'none';
    updateCodeEditor('terminal-custom-commands', 'language-bash');
    applySettings();
}

function resetAdvanced() {
    const settings = defaultSettings.advanced;
    document.getElementById('custom-js').value = settings.customJS;
    document.getElementById('enable-dev-tools').checked = settings.enableDevTools;
    document.getElementById('custom-keybindings').value = settings.customKeybindings;
    updateCodeEditor('custom-js', 'language-javascript');
    updateCodeEditor('custom-keybindings', 'language-json');
    applySettings();
}

// Save and load profile
function saveProfile() {
    const profile = {
        settings: userProfile.settings,
        customThemes: userProfile.customThemes,
        customFonts: userProfile.customFonts
    };
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nimbuspad-profile-${userProfile.username}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function loadProfile() {
    const fileInput = document.getElementById('load-profile');
    const file = fileInput.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const profile = JSON.parse(e.target.result);
                userProfile.settings = profile.settings || {};
                userProfile.customThemes = profile.customThemes || [];
                userProfile.customFonts = profile.customFonts || [];

                // Apply loaded settings
                document.getElementById('theme-select').value = userProfile.settings.theme || defaultSettings.appearance.theme;
                document.getElementById('font-size').value = userProfile.settings.fontSize || defaultSettings.appearance.fontSize;
                document.getElementById('font-family').value = userProfile.settings.fontFamily || defaultSettings.appearance.fontFamily;
                document.getElementById('line-height').value = userProfile.settings.lineHeight || defaultSettings.appearance.lineHeight;
                document.getElementById('custom-background').value = userProfile.settings.themeCustomizations?.background || defaultSettings.appearance.customBackground;
                document.getElementById('custom-foreground').value = userProfile.settings.themeCustomizations?.foreground || defaultSettings.appearance.customForeground;
                document.getElementById('custom-secondary-foreground').value = userProfile.settings.themeCustomizations?.secondaryForeground || defaultSettings.appearance.customSecondaryForeground;
                document.getElementById('custom-accent-color').value = userProfile.settings.themeCustomizations?.accentColor || defaultSettings.appearance.customAccentColor;
                document.getElementById('custom-highlight-color').value = userProfile.settings.themeCustomizations?.highlightColor || defaultSettings.appearance.customHighlightColor;
                document.getElementById('custom-button-bg').value = userProfile.settings.themeCustomizations?.buttonBg || defaultSettings.appearance.customButtonBg;
                document.getElementById('custom-button-hover-bg').value = userProfile.settings.themeCustomizations?.buttonHoverBg || defaultSettings.appearance.customButtonHoverBg;
                document.getElementById('custom-input-bg').value = userProfile.settings.themeCustomizations?.inputBg || defaultSettings.appearance.customInputBg;
                document.getElementById('custom-panel-bg').value = userProfile.settings.themeCustomizations?.panelBg || defaultSettings.appearance.customPanelBg;
                document.getElementById('custom-code-block-bg').value = userProfile.settings.themeCustomizations?.codeBlockBg || defaultSettings.appearance.customCodeBlockBg;
                document.getElementById('tab-size').value = userProfile.settings.tabSize || defaultSettings.editor.tabSize;
                document.getElementById('word-wrap').checked = userProfile.settings.wordWrap || defaultSettings.editor.wordWrap;
                document.getElementById('minimap').checked = userProfile.settings.minimap || defaultSettings.editor.minimap;
                document.getElementById('line-numbers').checked = userProfile.settings.lineNumbers || defaultSettings.editor.lineNumbers;
                document.getElementById('bracket-matching').checked = userProfile.settings.bracketMatching || defaultSettings.editor.bracketMatching;
                document.getElementById('auto-indent').checked = userProfile.settings.autoIndent || defaultSettings.editor.autoIndent;
                document.getElementById('custom-css').value = userProfile.settings.customCSS || defaultSettings.editor.customCSS;
                document.getElementById('terminal-font-size').value = userProfile.settings.terminalFontSize || defaultSettings.terminal.fontSize;
                document.getElementById('terminal-font-family').value = userProfile.settings.terminalFontFamily?.includes('http') ? 'custom' : userProfile.settings.terminalFontFamily || defaultSettings.terminal.fontFamily;
                document.getElementById('terminal-font-url').value = userProfile.settings.terminalFontFamily?.includes('http') ? userProfile.settings.terminalFontFamily : '';
                document.getElementById('terminal-font-color').value = userProfile.settings.terminalFontColor || defaultSettings.terminal.fontColor;
                document.getElementById('terminal-cursor-style').value = userProfile.settings.terminalCursorStyle || defaultSettings.terminal.cursorStyle;
                document.getElementById('terminal-cursor-color').value = userProfile.settings.terminalCursorColor || defaultSettings.terminal.cursorColor;
                document.getElementById('terminal-background-color').value = userProfile.settings.terminalBackgroundColor || defaultSettings.terminal.backgroundColor;
                document.getElementById('terminal-wallpaper-url').value = userProfile.settings.terminalWallpaperUrl || defaultSettings.terminal.wallpaperUrl;
                document.getElementById('terminal-opacity').value = userProfile.settings.terminalOpacity || defaultSettings.terminal.opacity;
                document.getElementById('terminal-custom-commands').value = userProfile.settings.terminalCustomCommands || defaultSettings.terminal.customCommands;
                document.getElementById('custom-js').value = userProfile.settings.customJS || defaultSettings.advanced.customJS;
                document.getElementById('enable-dev-tools').checked = userProfile.settings.enableDevTools || defaultSettings.advanced.enableDevTools;
                document.getElementById('custom-keybindings').value = userProfile.settings.customKeybindings || defaultSettings.advanced.customKeybindings;

                // Update code editors
                updateCodeEditor('custom-css', 'language-css');
                updateCodeEditor('terminal-custom-commands', 'language-bash');
                updateCodeEditor('custom-js', 'language-javascript');
                updateCodeEditor('custom-keybindings', 'language-json');

                // Apply custom fonts
                userProfile.customFonts.forEach(font => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = font.url;
                    document.head.appendChild(link);
                });

                // Apply custom themes to theme select
                userProfile.customThemes.forEach(theme => {
                    const option = document.createElement('option');
                    option.value = theme.name;
                    option.textContent = `Custom: ${theme.name}`;
                    document.getElementById('theme-select').appendChild(option);
                });

                // Show custom font URL input if applicable
                document.getElementById('custom-terminal-font-url-item').style.display = userProfile.settings.terminalFontFamily?.includes('http') ? 'flex' : 'none';

                applySettings();
            } catch (e) {
                console.error('Error loading profile:', e);
                alert('Failed to load profile. Please ensure the file is a valid JSON.');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid JSON file.');
    }
}

// Update code editors with syntax highlighting
function updateCodeEditor(textareaId, languageClass) {
    const textarea = document.getElementById(textareaId);
    const codeElement = document.getElementById(`${textareaId}-code`);
    codeElement.textContent = textarea.value;
    hljs.highlightElement(codeElement);
}

// Handle custom keybindings
function handleCustomKeybindings(e) {
    const bindings = window.customKeybindings;
    if (!bindings) return;

    const keyCombo = [];
    if (e.ctrlKey) keyCombo.push('ctrl');
    if (e.altKey) keyCombo.push('alt');
    if (e.shiftKey) keyCombo.push('shift');
    keyCombo.push(e.key.toLowerCase());
    const keyString = keyCombo.join('+');

    if (bindings.key === keyString) {
        e.preventDefault();
        if (bindings.command === 'openNewTerminal') {
            createNewTerminal();
        }
    }
}

// Fetch INSTRUCTIONS.md dynamically
function loadInstructions() {
    fetch('/INSTRUCTIONS.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load INSTRUCTIONS.md');
            }
            return response.text();
        })
        .then(data => {
            const instructionsContent = document.getElementById('instructions-content');
            instructionsContent.innerHTML = marked.parse(data);
            hljs.highlightAll();
        })
        .catch(error => {
            console.error('Error loading INSTRUCTIONS.md:', error);
            const instructionsContent = document.getElementById('instructions-content');
            instructionsContent.innerHTML = '<p style="color: red;">Error: Could not load INSTRUCTIONS.md. Please check the file in repos/INSTRUCTIONS.md.</p>';
        });
}

// Toggle Preferences tab
function togglePreferences() {
    const preferencesTab = document.querySelector('.tab[data-tab="preferences-tab-content"]');
    const isActive = preferencesTab.classList.contains('active');
    
    // If the tab is already active, do nothing (or optionally close it by switching to another tab)
    if (isActive) {
        return;
    }

    // Otherwise, switch to the Preferences tab
    openPreferences();
}

document.addEventListener('DOMContentLoaded', () => {
    loadInstructions();

    // Collapsible sections
    document.querySelectorAll('.preferences-section h2').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('collapsed');
        });
    });

    // Initialize code editors
    updateCodeEditor('custom-css', 'language-css');
    updateCodeEditor('terminal-custom-commands', 'language-bash');
    updateCodeEditor('custom-js', 'language-javascript');
    updateCodeEditor('custom-keybindings', 'language-json');

    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('change', (e) => {
        const themeStylesheet = document.getElementById('theme-stylesheet');
        themeStylesheet.href = `np++_themes/${e.target.value}.css`;
    });

    // Handle custom theme upload
    const uploadThemeBtn = document.getElementById('upload-theme-btn');
    uploadThemeBtn.addEventListener('click', () => {
        const fileInput = document.getElementById('custom-theme-upload');
        const file = fileInput.files[0];
        if (file && file.type === 'text/css') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const cssContent = sanitizeCSS(e.target.result);
                const themeName = `custom-${userProfile.username}-${Date.now()}`;
                userProfile.customThemes.push({ name: themeName, css: cssContent });

                const option = document.createElement('option');
                option.value = themeName;
                option.textContent = `Custom: ${themeName}`;
                themeSelect.appendChild(option);

                const blob = new Blob([cssContent], { type: 'text/css' });
                const url = URL.createObjectURL(blob);
                document.getElementById('theme-stylesheet').href = url;

                console.log('Theme saved to user profile:', userProfile);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid CSS file.');
        }
    });

    // Handle terminal font selection
    const terminalFontSelect = document.getElementById('terminal-font-family');
    terminalFontSelect.addEventListener('change', (e) => {
        const customFontUrlItem = document.getElementById('custom-terminal-font-url-item');
        if (e.target.value === 'custom') {
            customFontUrlItem.style.display = 'flex';
        } else {
            customFontUrlItem.style.display = 'none';
            applySettings();
        }
    });

    // Handle custom font URL
    document.getElementById('terminal-font-url').addEventListener('change', (e) => {
        const fontUrl = e.target.value;
        if (fontUrl) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fontUrl;
            document.head.appendChild(link);

            userProfile.customFonts.push({ url: fontUrl });
            document.querySelector('.terminal-content').style.fontFamily = 'monospace'; // Fallback
            applySettings();
        }
    });

    // Handle wallpaper URL change
    document.getElementById('terminal-wallpaper-url').addEventListener('change', applySettings);

    // Handle profile load
    document.getElementById('load-profile').addEventListener('change', loadProfile);

    // Apply settings on change
    document.querySelectorAll('#preferences-tab-content input, #preferences-tab-content select, #preferences-tab-content textarea').forEach(element => {
        element.addEventListener('input', () => {
            if (element.tagName === 'TEXTAREA') {
                updateCodeEditor(element.id, element.id.includes('css') ? 'language-css' : element.id.includes('js') ? 'language-javascript' : element.id.includes('keybindings') ? 'language-json' : 'language-bash');
            }
            applySettings();
        });
    });

    // Tab navigation
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.editor > div, #preferences-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Prevent click events from being consumed by child elements
            if (e.target.classList.contains('close-btn')) return;

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.style.display = 'none');
            
            tab.classList.add('active');
            const targetId = tab.dataset.tab || (tab.dataset.file ? 'markdown-preview' : null);
            if (targetId) {
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            }
        });

        const closeBtn = tab.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const activeTab = document.querySelector('.tab.active');
                const nextTab = tab.nextElementSibling || tab.previousElementSibling;
                
                if (tab === activeTab && nextTab) {
                    nextTab.click();
                }
                tab.remove();
            });
        }
    });

    // Ensure Instructions tab content is not altered
    window.openInstructions = function() {
        const instructionsTab = document.querySelector('.tab[data-file="INSTRUCTIONS.md"]');
        if (instructionsTab) {
            instructionsTab.click();
        }
    };

    // Open Preferences tab
    window.openPreferences = function() {
        const preferencesTab = document.querySelector('.tab[data-tab="preferences-tab-content"]');
        if (preferencesTab) {
            preferencesTab.click();
        }
    };
});
