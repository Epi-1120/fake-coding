// Default Fake Code
const defaultSourceCode = `import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Kernel } from '@core/system/kernel';
import { NetworkDriver } from '@drivers/network';
import { SecurityContext } from '@security/auth';

/**
 * Enterprise Dashboard Core System
 * Handles secure connections and real-time data streaming.
 */
interface AppState {
    isInitialized: boolean;
    systemLoad: number;
    securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const INITIAL_STATE: AppState = {
    isInitialized: false,
    systemLoad: 0.0,
    securityLevel: 'HIGH'
};

export const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const systemStatus = useSelector((state: any) => state.system);
    const [kernelPanic, setKernelPanic] = useState(false);

    useEffect(() => {
        const initializeKernel = async () => {
            console.log('[System] Boot sequence initiated...');
            await Kernel.mount('/dev/sda1');
            await NetworkDriver.connect({ protocol: 'WSS', encryption: 'AES-256' });
        };
        initializeKernel();
    }, []);

    if (kernelPanic) return <div className="error">KERNEL PANIC</div>;

    return (
        <div className="dashboard">
            <header>
                <h1>Enterprise System</h1>
                <Status status="online" />
            </header>
            <main>
                <Graph data={systemStatus.load} />
                <Logs stream={true} />
            </main>
        </div>
    );
};
`;

let sourceCode = defaultSourceCode;
let currentIndex = 0;
let typingSpeed = 5;
let isBurstMode = true;

const codeDisplay = document.getElementById('code-display');
const lineNumbers = document.getElementById('line-numbers');
const codeContainer = document.getElementById('code-container');
const cursorLine = document.getElementById('cursor-line');
const cursorCol = document.getElementById('cursor-col');
const terminalBody = document.getElementById('terminal-body');

// Settings UI Elements
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const fileInput = document.getElementById('file-input');
const speedRange = document.getElementById('speed-range');
const speedVal = document.getElementById('speed-val');
const burstCheck = document.getElementById('burst-check');

// Initial setup
updateDisplay();

// --- Event Listeners ---

// Keydown: The main typing mechanic
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11' || e.key === 'F5' || e.key === 'F12') return; 
    
    // Ignore key if settings modal is open
    if (!settingsModal.classList.contains('hidden')) return;

    e.preventDefault();
    typeCode();
    autoScroll();
});

// Click: Focus back to code
document.addEventListener('click', (e) => {
    if (settingsModal.classList.contains('hidden') && !e.target.closest('.activity-bar')) {
        // Only focus if not clicking settings
    }
});

// Settings Toggle
settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    // Reset focus to body so typing works immediately
    document.body.focus();
});

// File Input: Load Novel
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        // Replace source code with file content
        sourceCode = e.target.result;
        currentIndex = 0; // Reset progress
        codeDisplay.innerHTML = '<span class="cursor">|</span>';
        alert('File Loaded! Start typing to read.');
        settingsModal.classList.add('hidden');
    };
    reader.readAsText(file);
});

// Speed Control
speedRange.addEventListener('input', (e) => {
    typingSpeed = parseInt(e.target.value);
    speedVal.innerText = typingSpeed;
});

// Burst Mode
burstCheck.addEventListener('change', (e) => {
    isBurstMode = e.target.checked;
});


// --- Core Logic ---

function typeCode() {
    let charsToAdd = typingSpeed;

    if (isBurstMode) {
        // Random variance
        const variance = Math.floor(Math.random() * 5);
        charsToAdd = typingSpeed + variance;
        
        // Occasional burst
        if (Math.random() > 0.95) charsToAdd += 20;
    }
    
    currentIndex += charsToAdd;
    
    if (currentIndex > sourceCode.length) {
        // Loop when finished? Or stop. Let's stop at end for novels.
        currentIndex = sourceCode.length; 
    }

    updateDisplay();
    
    // Occasionally update terminal (only if using default code for realism)
    if (sourceCode === defaultSourceCode && Math.random() > 0.9) {
        addTerminalLog();
    }
}

function updateDisplay() {
    const currentText = sourceCode.substring(0, currentIndex);
    let html = escapeHtml(currentText);

    // Only apply syntax highlighting if it looks like code (short heuristic)
    // If it's a novel (long paragraphs), maybe treat as comments?
    // For now, simple highlighting.
    
    if (sourceCode === defaultSourceCode) {
        html = html
            .replace(/\b(const|let|var|function|class|interface|type|import|from|export|default|return|if|else|switch|case|async|await|try|catch|throw|new)\b/g, '<span class="kw-purple">$1</span>')
            .replace(/\b(React|useEffect|useState|useMemo|useCallback|useDispatch|useSelector|Provider|Kernel|NetworkDriver|SecurityContext|Dashboard|Widget|Graph|HeapVisualizer|DataStream|ContainerList)\b/g, '<span class="kw-yellow">$1</span>')
            .replace(/\b(string|number|boolean|any|void|AppState|FC|process|env)\b/g, '<span class="kw-green">$1</span>')
            .replace(/('.*?')/g, '<span class="kw-orange">$1</span>')
            .replace(/(\/\/.*)/g, '<span class="kw-comment">$1</span>');
    } else {
        // For novels: Make it look like comments (green) to blend in? 
        // Or just grey text. Let's go with grey text (default) but maybe highlight quotes.
        html = html.replace(/(".*?")/g, '<span class="kw-orange">$1</span>');
        html = html.replace(/('.*?')/g, '<span class="kw-orange">$1</span>');
    }

    html += '<span class="cursor">|</span>';
    codeDisplay.innerHTML = html;

    // Update Line Numbers
    const lines = currentText.split('\n').length;
    if (lineNumbers.childElementCount !== lines) {
         lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
    }

    // Status Bar
    cursorLine.innerText = lines;
}

// TERMINAL LOGS
const terminalLogs = [
    "[System] GC started.",
    "[System] GC finished in 12ms.",
    "Updating index...",
    "Scanning for changes...",
    "TS2307: Cannot find module.",
    "Recompiling...",
    "Done in 2.4s."
];

function addTerminalLog() {
    const logMsg = terminalLogs[Math.floor(Math.random() * terminalLogs.length)];
    const div = document.createElement('div');
    div.className = 'term-line';
    const time = new Date().toLocaleTimeString().split(' ')[0];
    div.innerHTML = `<span class="term-green">➜</span> [${time}] ${logMsg}`;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    if (terminalBody.children.length > 50) terminalBody.removeChild(terminalBody.firstChild);
}

function autoScroll() {
    codeContainer.scrollTop = codeContainer.scrollHeight;
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
