function initNimbus() {
    const conversation = document.querySelector('#nimbus-conversation');
    const input = document.querySelector('#nimbus-input');
    const sendBtn = document.querySelector('#nimbus-send-btn');
    const fileUpload = document.querySelector('.file-upload-icon');
    const photoUpload = document.querySelector('.photo-upload-icon');
    const threadsMenuBtn = document.querySelector('.threads-menu-icon');
    const settingsBtn = document.querySelector('.settings-icon');
    const viewBtn = document.querySelector('.view-icon');
    const nimbusPanel = document.querySelector('#nimbus-panel');
    const nimbusHeader = document.querySelector('.nimbus-header');
    const container = document.querySelector('.container');
    const tabs = document.querySelector('#tabs');
    const editor = document.querySelector('.editor');

    if (!conversation || !input || !sendBtn || !fileUpload || !photoUpload || !threadsMenuBtn || !settingsBtn || !viewBtn || !nimbusPanel || !container || !tabs || !editor || !nimbusHeader) {
        console.error('Nimbuspad++: Nimbus elements not found');
        return;
    }

    let isTyping = false;
    let isStopped = false;
    let currentResponse = null;
    let currentViewMode = 'chat'; // Default view mode
    let pastThreads = [
        { id: 1, title: "JavaScript Function Help", date: "2025-04-17" },
        { id: 2, title: "CSS Button Styling", date: "2025-04-17" },
        { id: 3, title: "Python Weather Script", date: "2025-04-18" }
    ];

    // Create Nimbus tab content area
    const nimbusTabContent = document.createElement('div');
    nimbusTabContent.id = 'nimbus-tab-content';
    nimbusTabContent.style.display = 'none';
    editor.appendChild(nimbusTabContent);

    function switchViewMode(mode) {
        currentViewMode = mode;
        container.classList.remove('side-by-side', 'tab-view');
        nimbusPanel.classList.remove('collapsed');
        nimbusTabContent.style.display = 'none';
        nimbusTabContent.classList.remove('active');
        const existingTab = document.querySelector('.tab-nimbus');
        if (existingTab) existingTab.remove();

        // Reset nimbus-panel to its default state
        nimbusPanel.appendChild(nimbusHeader);
        nimbusPanel.appendChild(conversation);
        nimbusPanel.appendChild(document.querySelector('.nimbus-input-area'));
        nimbusPanel.appendChild(document.querySelector('.nimbus-resize-handle'));

        if (mode === 'side-by-side') {
            container.classList.add('side-by-side');
            nimbusPanel.style.width = '50%';
        } else if (mode === 'tab') {
            container.classList.add('tab-view');
            nimbusPanel.classList.add('collapsed');

            const tab = document.createElement('div');
            tab.className = 'tab tab-nimbus';
            tab.innerHTML = `
                <svg class="thunder-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2">
                    <path d="M19 12H12L15 3H9L5 12H12L9 21H15L19 12Z"/>
                </svg>
                Thunderhead
                <div class="close-btn"></div>`;
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelector('#code-editor').style.display = 'none';
                document.querySelector('#markdown-preview').style.display = 'none';
                nimbusTabContent.classList.add('active');
                nimbusTabContent.style.display = 'flex';
            });
            tab.querySelector('.close-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                tab.remove();
                nimbusTabContent.style.display = 'none';
                switchViewMode('chat'); // Revert to chat mode when closing the tab
            });
            tabs.appendChild(tab);

            // Move the entire content (header, conversation, input) to the tab
            nimbusTabContent.appendChild(nimbusHeader);
            nimbusTabContent.appendChild(conversation);
            nimbusTabContent.appendChild(document.querySelector('.nimbus-input-area'));
            tab.click();
        } else if (mode === 'chat') {
            nimbusPanel.style.width = '300px';
        }
    }

    function toggleNimbusPanel() {
        if (currentViewMode === 'tab') {
            // If in tab mode, switch to chat mode to show the panel
            switchViewMode('chat');
        } else if (currentViewMode === 'side-by-side') {
            // If in side-by-side mode, switch to chat mode to "hide" by going to default
            switchViewMode('chat');
        } else {
            // If in chat mode, toggle between collapsed and open
            if (nimbusPanel.classList.contains('collapsed')) {
                nimbusPanel.classList.remove('collapsed');
                nimbusPanel.style.width = '300px';
            } else {
                nimbusPanel.classList.add('collapsed');
                nimbusPanel.style.width = '0';
            }
        }
    }

    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `conversation-message ${sender}-message`;
        messageDiv.innerHTML = `<span>${content}</span>`;
        
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'message-controls';

        if (sender === 'nimbus') {
            const regenerateBtn = document.createElement('div');
            regenerateBtn.className = 'regenerate-icon';
            regenerateBtn.title = 'Regenerate Response';
            regenerateBtn.addEventListener('click', () => {
                messageDiv.remove();
                mockNimbusResponse(input.value.trim());
            });

            const continueBtn = document.createElement('div');
            continueBtn.className = 'continue-icon';
            continueBtn.title = 'Continue Response';
            continueBtn.addEventListener('click', () => {
                addMessage("Continuing where I left off...", 'nimbus');
            });

            const copyBtn = document.createElement('div');
            copyBtn.className = 'copy-icon';
            copyBtn.title = 'Copy Message';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(content).then(() => {
                    copyBtn.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%23FF4081" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>')`;
                    setTimeout(() => {
                        copyBtn.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%23CCCCCC" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m2-2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"/></svg>')`;
                    }, 2000);
                });
            });

            const referencedBtn = document.createElement('div');
            referencedBtn.className = 'referenced-icon';
            referencedBtn.title = 'View Referenced Conversations';
            referencedBtn.addEventListener('click', () => {
                addMessage("No referenced conversations available.", 'nimbus');
            });

            controlsDiv.appendChild(regenerateBtn);
            controlsDiv.appendChild(continueBtn);
            controlsDiv.appendChild(copyBtn);
            controlsDiv.appendChild(referencedBtn);
        } else if (sender === 'user') {
            const editBtn = document.createElement('div');
            editBtn.className = 'edit-icon';
            editBtn.title = 'Edit Message';
            editBtn.addEventListener('click', () => {
                const newContent = prompt("Edit your message:", content);
                if (newContent) {
                    messageDiv.querySelector('span').textContent = newContent;
                }
            });

            const copyBtn = document.createElement('div');
            copyBtn.className = 'copy-icon';
            copyBtn.title = 'Copy Message';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(content).then(() => {
                    copyBtn.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%23FF4081" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>')`;
                    setTimeout(() => {
                        copyBtn.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%23CCCCCC" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m2-2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"/></svg>')`;
                    }, 2000);
                });
            });

            controlsDiv.appendChild(editBtn);
            controlsDiv.appendChild(copyBtn);
        }

        messageDiv.appendChild(controlsDiv);
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }

    function addCodeBlock(code, language = null) {
        const codeDiv = document.createElement('div');
        codeDiv.className = 'code-block';
        const pre = document.createElement('pre');
        const codeEl = document.createElement('code');
        codeEl.textContent = code;
        pre.appendChild(codeEl);
        codeDiv.appendChild(pre);

        const btnContainer = document.createElement('div');
        btnContainer.className = 'code-block-buttons';

        const applyBtn = document.createElement('button');
        applyBtn.className = 'apply-btn';
        applyBtn.textContent = 'Apply to Page';
        applyBtn.addEventListener('click', () => {
            const editor = document.querySelector('#code-editor');
            if (editor) {
                editor.textContent = code;
                editor.style.display = 'block';
                document.querySelector('#markdown-preview').style.display = 'none';
                hljs.highlightElement(codeEl);
            }
        });

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m2-2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"/></svg>`;
        copyBtn.title = 'Copy Code';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF4081" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
                setTimeout(() => {
                    copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m2-2h4a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2z"/></svg>`;
                }, 2000);
            });
        });

        const wrapBtn = document.createElement('button');
        wrapBtn.className = 'wrap-btn';
        wrapBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2"><path d="M4 7h16M4 12h12M4 17h16"/></svg>`;
        wrapBtn.title = 'Toggle Wrap';
        wrapBtn.addEventListener('click', () => {
            pre.style.whiteSpace = pre.style.whiteSpace === 'pre-wrap' ? 'pre' : 'pre-wrap';
            wrapBtn.innerHTML = pre.style.whiteSpace === 'pre-wrap'
                ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF4081" stroke-width="2"><path d="M4 7h16M4 12h12M4 17h16"/></svg>`
                : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2"><path d="M4 7h16M4 12h12M4 17h16"/></svg>`;
        });

        btnContainer.appendChild(applyBtn);
        btnContainer.appendChild(copyBtn);
        btnContainer.appendChild(wrapBtn);
        codeDiv.appendChild(btnContainer);

        conversation.appendChild(codeDiv);
        if (language) {
            codeEl.className = `language-${language}`;
            hljs.highlightElement(codeEl);
        } else {
            const result = hljs.highlightAuto(code);
            codeEl.className = `language-${result.language || 'plaintext'}`;
            hljs.highlightElement(codeEl);
        }
        conversation.scrollTop = conversation.scrollHeight;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'conversation-message nimbus-message typing-indicator';
        typingDiv.innerHTML = `
            <span>Thunderhead is typing...</span>
            <div class="typing-controls">
                <div class="stop-btn" title="Stop">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2">
                        <rect x="4" y="4" width="16" height="16" rx="2"/>
                    </svg>
                </div>
            </div>`;
        conversation.appendChild(typingDiv);
        conversation.scrollTop = conversation.scrollHeight;

        typingDiv.querySelector('.stop-btn').addEventListener('click', () => {
            isStopped = true;
            isTyping = false;
            typingDiv.className = 'conversation-message nimbus-message stopped-message';
            typingDiv.innerHTML = `
                <span>Response stopped.</span>
                <div class="typing-controls">
                    <div class="continue-btn" title="Continue">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2">
                            <path d="M5 4v16l12-8z"/>
                        </svg>
                    </div>
                    <div class="refresh-btn" title="Refresh Response">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2">
                            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                    </div>
                </div>`;
            typingDiv.querySelector('.continue-btn').addEventListener('click', () => {
                if (currentResponse) {
                    isStopped = false;
                    isTyping = true;
                    typingDiv.remove();
                    currentResponse();
                }
            });
            typingDiv.querySelector('.refresh-btn').addEventListener('click', () => {
                typingDiv.remove();
                mockNimbusResponse(input.value.trim());
            });
        });

        return typingDiv;
    }

    function mockNimbusResponse(userMessage) {
        if (isStopped) return;

        isTyping = true;
        const typingDiv = addTypingIndicator();

        currentResponse = () => {
            if (isStopped) return;
            typingDiv.remove();
            isTyping = false;

            if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
                addMessage("Greetings! How can Thunderhead assist you today?", 'nimbus');
            } else if (userMessage.toLowerCase().includes('create a function')) {
                addMessage("I can help with that! Here's a JavaScript function to calculate the factorial of a number:", 'nimbus');
                const code = `function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5)); // Output: 120`;
                addCodeBlock(code, 'javascript');
            } else if (userMessage.toLowerCase().includes('style a button')) {
                addMessage("Here's a CSS example to style a button with a modern look:", 'nimbus');
                const css = `.modern-button {
    padding: 10px 20px;
    background-color: #007ACC;
    color: #FFFFFF;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.modern-button:hover {
    background-color: #005F99;
}`;
                addCodeBlock(css, 'css');
            } else if (userMessage.toLowerCase().includes('python script')) {
                addMessage("Here's a Python script to fetch and display the weather for a given city using an API:", 'nimbus');
                const python = `import requests

def get_weather(city):
    api_key = "your_api_key"
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()
    if data["cod"] == 200:
        temp = data["main"]["temp"]
        desc = data["weather"][0]["description"]
        return f"Weather in {city}: {temp}°C, {desc}"
    return "City not found."

print(get_weather("London"))`;
                addCodeBlock(python, 'python');
            } else if (userMessage.toLowerCase().includes('thank you')) {
                addMessage("You're welcome! Anything else I can help with?", 'nimbus');
            } else {
                addMessage("I'm not sure I understand. Could you please provide more details?", 'nimbus');
            }
        };

        setTimeout(currentResponse, 2000);
    }

    sendBtn.addEventListener('click', () => {
        const message = input.value.trim();
        if (!message) return;
        addMessage(message, 'user');
        isStopped = false;
        mockNimbusResponse(message);
        input.value = '';
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    fileUpload.addEventListener('click', () => {
        addMessage("File upload feature coming soon!", 'nimbus');
    });

    photoUpload.addEventListener('click', () => {
        addMessage("Photo upload feature coming soon!", 'nimbus');
    });

    threadsMenuBtn.addEventListener('click', (e) => {
        const existingMenu = document.querySelector('.threads-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'threads-menu';
        menu.style.position = 'absolute';
        menu.style.right = '10px';
        menu.style.top = '40px';
        menu.style.backgroundColor = '#252526';
        menu.style.border = '1px solid #3C3C3C';
        menu.style.padding = '5px';
        menu.style.zIndex = '1000';
        menu.style.color = '#CCCCCC';
        menu.style.fontSize = '12px';
        menu.style.fontFamily = "'Fira Code', monospace";

        pastThreads.forEach(thread => {
            const threadItem = document.createElement('div');
            threadItem.textContent = `${thread.title} (${thread.date})`;
            threadItem.style.padding = '5px 10px';
            threadItem.style.cursor = 'pointer';
            threadItem.addEventListener('click', () => {
                addMessage(`Loaded thread: ${thread.title}`, 'nimbus');
                menu.remove();
            });
            threadItem.addEventListener('mouseover', () => {
                threadItem.style.backgroundColor = '#37373D';
            });
            threadItem.addEventListener('mouseout', () => {
                threadItem.style.backgroundColor = 'transparent';
            });
            menu.appendChild(threadItem);
        });

        document.body.appendChild(menu);

        const handleClickOutside = (e) => {
            if (!menu.contains(e.target) && e.target !== threadsMenuBtn) {
                menu.remove();
                document.removeEventListener('click', handleClickOutside);
            }
        };
        document.addEventListener('click', handleClickOutside);
    });

    settingsBtn.addEventListener('click', (e) => {
        const existingMenu = document.querySelector('.settings-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'settings-menu';
        menu.style.position = 'absolute';
        menu.style.right = '10px';
        menu.style.top = '40px';
        menu.style.backgroundColor = '#252526';
        menu.style.border = '1px solid #3C3C3C';
        menu.style.padding = '5px';
        menu.style.zIndex = '1000';
        menu.style.color = '#CCCCCC';
        menu.style.fontSize = '12px';
        menu.style.fontFamily = "'Fira Code', monospace";

        const options = [
            { label: 'Login', action: () => addMessage("Login feature coming soon!", 'nimbus') },
            { label: 'Sign Up', action: () => addMessage("Sign Up feature coming soon!", 'nimbus') },
            { label: 'Settings', action: () => addMessage("Settings feature coming soon!", 'nimbus') }
        ];

        options.forEach(opt => {
            const item = document.createElement('div');
            item.textContent = opt.label;
            item.style.padding = '5px 10px';
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                opt.action();
                menu.remove();
            });
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#37373D';
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = 'transparent';
            });
            menu.appendChild(item);
        });

        document.body.appendChild(menu);

        const handleClickOutside = (e) => {
            if (!menu.contains(e.target) && e.target !== settingsBtn) {
                menu.remove();
                document.removeEventListener('click', handleClickOutside);
            }
        };
        document.addEventListener('click', handleClickOutside);
    });

    viewBtn.addEventListener('click', (e) => {
        const existingMenu = document.querySelector('.view-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'view-menu';
        menu.style.position = 'absolute';
        menu.style.right = '10px';
        menu.style.top = '40px';
        menu.style.backgroundColor = '#252526';
        menu.style.border = '1px solid #3C3C3C';
        menu.style.padding = '5px';
        menu.style.zIndex = '1000';
        menu.style.color = '#CCCCCC';
        menu.style.fontSize = '12px';
        menu.style.fontFamily = "'Fira Code', monospace";

        const viewOptions = [
            { label: 'Side by Side', mode: 'side-by-side' },
            { label: 'Tab', mode: 'tab' },
            { label: 'Chat', mode: 'chat' }
        ];

        viewOptions.forEach(opt => {
            const item = document.createElement('div');
            item.textContent = opt.label;
            item.style.padding = '5px 10px';
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                switchViewMode(opt.mode);
                menu.remove();
            });
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#37373D';
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = 'transparent';
            });
            menu.appendChild(item);
        });

        document.body.appendChild(menu);

        const handleClickOutside = (e) => {
            if (!menu.contains(e.target) && e.target !== viewBtn) {
                menu.remove();
                document.removeEventListener('click', handleClickOutside);
            }
        };
        document.addEventListener('click', handleClickOutside);
    });

    // Expose toggleNimbusPanel globally so it can be called from the status bar
    window.toggleNimbusPanel = toggleNimbusPanel;
}

document.addEventListener('DOMContentLoaded', initNimbus);
