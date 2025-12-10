// ============================================================================
// HELP & GUIDANCE SYSTEM
// Help button, keyboard shortcuts guide, tips
// ============================================================================

function initializeHelpSystem() {
    createHelpButton();
    createHelpModal();
    console.log('[Help] Help system initialized');
}

function createHelpButton() {
    const helpButton = document.createElement('button');
    helpButton.className = 'help-button';
    helpButton.id = 'helpButton';
    helpButton.innerHTML = '?';
    helpButton.title = 'Help & Keyboard Shortcuts';
    helpButton.onclick = showHelpModal;

    document.body.appendChild(helpButton);
}

function createHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.id = 'helpModal';
    modal.innerHTML = `
        <div class="help-content">
            <button class="help-close" onclick="closeHelpModal()">×</button>
            
            <h2>📚 Workbook Generator Help</h2>
            
            <div class="help-section">
                <h3>⌨️ Keyboard Shortcuts</h3>
                <div class="shortcut-grid">
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Generate Worksheet</span>
                        <kbd class="shortcut-key">Ctrl + G</kbd>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Print / Export PDF</span>
                        <kbd class="shortcut-key">Ctrl + P</kbd>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Save Configuration</span>
                        <kbd class="shortcut-key">Ctrl + S</kbd>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Reset Worksheet</span>
                        <kbd class="shortcut-key">Ctrl + N</kbd>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Toggle Dark Mode</span>
                        <kbd class="shortcut-key">Ctrl + D</kbd>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Focus Search</span>
                        <kbd class="shortcut-key">/</kbd>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Close Modals</span>
                        <kbd class="shortcut-key">Esc</kbd>
                    </div>
                    <div class="shortcut-item">
                        <span class="shortcut-desc">Show This Help</span>
                        <kbd class="shortcut-key">?</kbd>
                    </div>
                </div>
            </div>
            
            <div class="help-section">
                <h3>🚀 Quick Start Guide</h3>
                <ol style="padding-left: 20px; line-height: 1.8;">
                    <li><strong>Standard Mode:</strong> Select Grade → Subject → Topic → Format</li>
                    <li><strong>Custom Mode:</strong> Describe your worksheet in plain English</li>
                    <li><strong>Advanced Options:</strong> Include answer keys, adjust difficulty</li>
                    <li><strong>Generate:</strong> Click "Generate Workbook" or press Ctrl+G</li>
                    <li><strong>Print:</strong> Use browser print or "Export PDF" button</li>
                </ol>
            </div>
            
            <div class="help-section">
                <h3>✨ Features</h3>
                <ul class="help-feature-list">
                    <li><strong>100+ Curriculum Topics</strong> - Grades 5-8, all subjects</li>
                    <li><strong>Dark Mode</strong> - Toggle with moon/sun button or Ctrl+D</li>
                    <li><strong>AI Custom Worksheets</strong> - Describe what you want</li>
                    <li><strong>Search Topics</strong> - Press / to search instantly</li>
                    <li><strong>Answer Keys</strong> - Include detailed solutions</li>
                    <li><strong>Difficulty Levels</strong> - Easy, Medium, Hard, Mixed</li>
                    <li><strong>Preview Panel</strong> - See topic details before generating</li>
                    <li><strong>Keyboard Shortcuts</strong> - Navigate without mouse</li>
                </ul>
            </div>
            
            <div class="help-section">
                <h3>💡 Tips & Tricks</h3>
                <ul style="padding-left: 20px; line-height: 1.8;">
                    <li>Use <strong>Search</strong> (/) to find topics quickly</li>
                    <li>Try <strong>Dark Mode</strong> for reduced eye strain</li>
                    <li>Click <strong>example prompts</strong> in Custom Mode</li>
                    <li><strong>Save configurations</strong> with Ctrl+S for quick reuse</li>
                    <li>Hover over elements for <strong>tooltips</strong></li>
                    <li>Look for 🆕 badges on <strong>new content</strong></li>
                </ul>
            </div>
            
            <div class="help-section">
                <h3>❓ Troubleshooting</h3>
                <ul style="padding-left: 20px; line-height: 1.8;">
                    <li><strong>Dropdowns disabled?</strong> Select previous options first</li>
                    <li><strong>Custom worksheet not generating?</strong> Using demo mode (no API key needed)</li>
                    <li><strong>Can't find a topic?</strong> Use search or check different subject</li>
                    <li><strong>Print looks wrong?</strong> Try "Export PDF" for better formatting</li>
                </ul>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeHelpModal();
        }
    });

    // Close on Escape (already handled in keyboard shortcuts)
}

function showHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Make functions globally available
window.showHelpModal = showHelpModal;
window.closeHelpModal = closeHelpModal;

// Add ? keyboard shortcut to show help
document.addEventListener('keydown', (e) => {
    if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const activeElement = document.activeElement;
        // Don't trigger if typing in input/textarea
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            showHelpModal();
        }
    }
});

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHelpSystem);
} else {
    initializeHelpSystem();
}

console.log('[Help] Help module loaded');
