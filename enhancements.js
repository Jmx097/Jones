// ============================================================================
// UI/UX ENHANCEMENTS JAVASCRIPT
// Tooltips, Tutorial, Preview, Example Prompts, Loading Animations
// ============================================================================

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    initializeKeyboardShortcuts();
    initializeEnhancements();
    checkFirstTimeUser();
    addExamplePrompts();
    setupPreviewPanel();
    addSubjectIcons();
    addNewBadges();
});

// ============================================================================
// DARK MODE
// ============================================================================

function initializeDarkMode() {
    try {
        // Create theme toggle button
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.id = 'themeToggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.title = 'Toggle Dark Mode (Ctrl+D)';
        document.body.appendChild(themeToggle);

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);

        // Toggle on click
        themeToggle.addEventListener('click', toggleTheme);

        console.log('[Dark Mode] Initialized successfully');
    } catch (error) {
        console.error('[Dark Mode] Initialization failed:', error);
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        toggle.title = theme === 'dark' ? 'Switch to Light Mode (Ctrl+D)' : 'Switch to Dark Mode (Ctrl+D)';
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showSuccessMessage(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode enabled`);
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+G - Generate worksheet
        if (e.ctrlKey && e.key === 'g') {
            e.preventDefault();
            const generateBtn = document.getElementById('generate');
            const customBtn = document.getElementById('generateCustom');
            const activeMode = document.getElementById('standardMode').classList.contains('active') ? 'standard' : 'custom';

            if (activeMode === 'standard' && generateBtn) {
                generateBtn.click();
                showSuccessMessage('Generating worksheet... (Ctrl+G)');
            } else if (activeMode === 'custom' && customBtn) {
                customBtn.click();
                showSuccessMessage('Generating custom worksheet... (Ctrl+G)');
            }
        }

        // Ctrl+P - Print/Export PDF
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            const exportBtn = document.getElementById('exportPDF');
            if (exportBtn && exportBtn.style.display !== 'none') {
                exportBtn.click();
                showSuccessMessage('Exporting to PDF... (Ctrl+P)');
            } else {
                window.print();
            }
        }

        // Ctrl+S - Save configuration
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveCurrentConfiguration();
        }

        // Ctrl+N - New/Reset
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            resetWorksheet();
        }

        // Ctrl+D - Toggle dark mode
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }

        // / - Focus search (future feature)
        if (e.key === '/' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }

        // Esc - Close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    console.log('[Keyboard Shortcuts] Initialized - Ctrl+G, Ctrl+P, Ctrl+S, Ctrl+N, Ctrl+D, /, Esc');
}

function saveCurrentConfiguration() {
    const config = {
        grade: document.getElementById('grade')?.value,
        subject: document.getElementById('subject')?.value,
        topic: document.getElementById('topic')?.value,
        format: document.getElementById('format')?.value,
        includeAnswers: document.getElementById('includeAnswers')?.checked,
        difficulty: document.getElementById('difficulty')?.value,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('lastWorksheetConfig', JSON.stringify(config));
    showSuccessMessage('Configuration saved! (Ctrl+S)');
}

function resetWorksheet() {
    if (confirm('Reset worksheet and start over?')) {
        document.getElementById('grade').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('topic').value = '';
        document.getElementById('workbook-content').innerHTML = '<p style="text-align: center; color: #6b7280;">Select options above and click "Generate Workbook" to create your worksheet.</p>';

        // Focus on grade dropdown for better UX
        setTimeout(() => {
            const gradeSelect = document.getElementById('grade');
            if (gradeSelect) {
                gradeSelect.focus();
                gradeSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);

        showSuccessMessage('Worksheet reset (Ctrl+N)');
    }
}

function closeAllModals() {
    const tutorial = document.querySelector('.tutorial-overlay');
    const preview = document.getElementById('previewPanel');

    if (tutorial && tutorial.classList.contains('active')) {
        closeTutorial();
    }
    if (preview && preview.classList.contains('active')) {
        closePreview();
    }
}

// ============================================================================
// FIRST TIME USER TUTORIAL
// ============================================================================

function checkFirstTimeUser() {
    const hasVisited = localStorage.getItem('hasVisitedWorksheetGenerator');

    if (!hasVisited) {
        // Show tutorial after a brief delay
        setTimeout(() => {
            showTutorial();
            localStorage.setItem('hasVisitedWorksheetGenerator', 'true');
        }, 1000);
    }
}

function showTutorial() {
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay active';
    overlay.innerHTML = `
        <div class="tutorial-content">
            <h2>🎓 Welcome to the Ontario Curriculum Workbook Generator!</h2>
            <p>Let's get you started with a quick tour:</p>
            
            <div class="tutorial-step">
                <span class="tutorial-step-number">1</span>
                <strong>Choose Your Mode</strong><br>
                <em>Standard Mode:</em> Select from pre-made curriculum topics<br>
                <em>Custom Mode:</em> Describe any worksheet you want (AI-powered!)
            </div>
            
            <div class="tutorial-step">
                <span class="tutorial-step-number">2</span>
                <strong>Standard Mode</strong><br>
                Select Grade → Subject → Topic → Format<br>
                Click "Generate Workbook" and you're done!
            </div>
            
            <div class="tutorial-step">
                <span class="tutorial-step-number">3</span>
                <strong>Custom Mode (NEW!)</strong><br>
                Describe what you want: "Create a Grade 7 math worksheet on fractions with 5 problems"<br>
                AI will generate it for you!
            </div>
            
            <div class="tutorial-step">
                <span class="tutorial-step-number">4</span>
                <strong>Advanced Options</strong><br>
                • Include answer keys<br>
                • Choose difficulty level<br>
                • Export to PDF
            </div>
            
            <div class="tutorial-step">
                <span class="tutorial-step-number">5</span>
                <strong>New Content!</strong><br>
                Look for the <span class="new-badge">NEW</span> badge on recently added topics
            </div>
            
            <button class="tutorial-close" onclick="closeTutorial()">Got it! Let's Start</button>
            <p style="text-align: center; margin-top: 10px; font-size: 0.85em; color: #6b7280;">
                Tip: Hover over elements for helpful tooltips
            </p>
        </div>
    `;

    document.body.appendChild(overlay);
}

function closeTutorial() {
    const overlay = document.querySelector('.tutorial-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// Make closeTutorial available globally
window.closeTutorial = closeTutorial;

// ============================================================================
// EXAMPLE PROMPTS
// ============================================================================

function addExamplePrompts() {
    try {
        const customDescription = document.getElementById('customDescription');
        if (!customDescription) {
            console.warn('[Example Prompts] customDescription element not found');
            return;
        }

        const examplesDiv = document.createElement('div');
        examplesDiv.className = 'example-prompts';
        examplesDiv.innerHTML = `
            <h4>💡 Example Prompts (click to use):</h4>
            <div class="example-prompt" data-prompt="Create a Grade 7 math worksheet on solving linear equations with 6 problems">
                Grade 7 math: solving linear equations (6 problems)
            </div>
            <div class="example-prompt" data-prompt="Grade 6 science worksheet about ecosystems with food chain questions">
                Grade 6 science: ecosystems and food chains
            </div>
            <div class="example-prompt" data-prompt="Grade 8 English persuasive writing worksheet with examples and practice prompts">
                Grade 8 English: persuasive writing practice
            </div>
            <div class="example-prompt" data-prompt="Create a Grade 5 math worksheet on fractions with 8 word problems">
                Grade 5 math: fraction word problems (8 questions)
            </div>
        `;

        customDescription.parentNode.insertBefore(examplesDiv, customDescription.nextSibling);

        // Add click handlers
        document.querySelectorAll('.example-prompt').forEach(prompt => {
            prompt.addEventListener('click', () => {
                customDescription.value = prompt.dataset.prompt;
                customDescription.focus();
                showSuccessMessage('Example loaded! Click "Generate Custom Worksheet" to create it.');
            });
        });

        console.log('[Example Prompts] Initialized successfully');
    } catch (error) {
        console.error('[Example Prompts] Initialization failed:', error);
    }
}

// ============================================================================
// TOOLTIPS
// ============================================================================

function initializeEnhancements() {
    addTooltips();
    setupAILoading();
}

function addTooltips() {
    const tooltipData = {
        'grade': 'Select the grade level for your worksheet (5-8)',
        'subject': 'Choose the subject area',
        'topic': 'Pick a specific curriculum topic',
        'format': 'Single worksheet or complete workbook with multiple lessons',
        'includeAnswers': 'Add an answer key with solutions',
        'difficulty': 'Adjust problem difficulty level',
        'exportPDF': 'Download worksheet as PDF file',
        'toggleAnswers': 'Show or hide the answer key',
        'customGrade': 'Select grade level for custom worksheet',
        'customDescription': 'Describe the worksheet you want AI to create',
        'generateCustom': 'Generate worksheet using AI (or demo mode if no API key)'
    };

    Object.entries(tooltipData).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element && !element.classList.contains('tooltip')) {
            wrapWithTooltip(element, text);
        }
    });
}

function wrapWithTooltip(element, text) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tooltip';
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);

    const tooltipText = document.createElement('span');
    tooltipText.className = 'tooltiptext';
    tooltipText.textContent = text;
    wrapper.appendChild(tooltipText);
}

// ============================================================================
// AI LOADING ANIMATION
// ============================================================================

function setupAILoading() {
    // Create loading overlay
    const backdrop = document.createElement('div');
    backdrop.className = 'ai-loading-backdrop';
    backdrop.id = 'aiLoadingBackdrop';

    const loading = document.createElement('div');
    loading.className = 'ai-loading';
    loading.id = 'aiLoading';
    loading.innerHTML = `
        <div class="ai-loading-spinner"></div>
        <div class="ai-loading-text">Generating Your Worksheet...</div>
        <div class="ai-loading-subtext">This may take a few moments</div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(loading);
}

function showAILoading(message = 'Generating Your Worksheet...') {
    const loading = document.getElementById('aiLoading');
    const backdrop = document.getElementById('aiLoadingBackdrop');
    const text = loading.querySelector('.ai-loading-text');

    if (text) text.textContent = message;
    if (loading) loading.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
}

function hideAILoading() {
    const loading = document.getElementById('aiLoading');
    const backdrop = document.getElementById('aiLoadingBackdrop');

    if (loading) loading.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
}

// Make functions globally available
window.showAILoading = showAILoading;
window.hideAILoading = hideAILoading;

// ============================================================================
// PREVIEW PANEL
// ============================================================================

function setupPreviewPanel() {
    const previewPanel = document.createElement('div');
    previewPanel.className = 'preview-panel';
    previewPanel.id = 'previewPanel';
    previewPanel.innerHTML = `
        <div class="preview-header">
            <h3>📋 Preview</h3>
            <button class="preview-close" onclick="closePreview()">×</button>
        </div>
        <div class="preview-content" id="previewContent">
            <p style="color: #6b7280; text-align: center;">Select options to see preview</p>
        </div>
    `;

    document.body.appendChild(previewPanel);

    // Add change listeners to show preview
    const grade = document.getElementById('grade');
    const subject = document.getElementById('subject');
    const topic = document.getElementById('topic');

    if (grade && subject && topic) {
        [grade, subject, topic].forEach(el => {
            el.addEventListener('change', updatePreview);
        });
    }
}

function updatePreview() {
    const grade = document.getElementById('grade')?.value;
    const subject = document.getElementById('subject')?.value;
    const topic = document.getElementById('topic')?.value;

    if (!grade || !subject || !topic) return;

    const panel = document.getElementById('previewPanel');
    const content = document.getElementById('previewContent');

    if (!panel || !content) return;

    try {
        const data = curriculumData[grade][subject][topic];
        const lessonCount = data.workbook?.length || 0;
        const firstLesson = data.workbook?.[0];

        content.innerHTML = `
            <div class="preview-stat">
                <span class="preview-stat-label">Grade:</span>
                <span class="preview-stat-value">${grade}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-stat-label">Subject:</span>
                <span class="preview-stat-value">${subject}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-stat-label">Topic:</span>
                <span class="preview-stat-value">${topic}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-stat-label">Lessons:</span>
                <span class="preview-stat-value">${lessonCount}</span>
            </div>
            <div class="preview-stat">
                <span class="preview-stat-label">Est. Pages:</span>
                <span class="preview-stat-value">${lessonCount * 2}-${lessonCount * 3}</span>
            </div>
            ${firstLesson ? `
                <div class="preview-sample">
                    <h4>First Lesson Preview:</h4>
                    <p><strong>${firstLesson.lessonTitle}</strong></p>
                    <p style="font-size: 0.85em; color: #6b7280;">
                        ${firstLesson.practice?.length || 0} practice problems
                    </p>
                </div>
            ` : ''}
        `;

        panel.classList.add('active');
    } catch (error) {
        console.error('Preview error:', error);
    }
}

function closePreview() {
    const panel = document.getElementById('previewPanel');
    if (panel) panel.classList.remove('active');
}

window.closePreview = closePreview;

// ============================================================================
// SUBJECT ICONS
// ============================================================================

function addSubjectIcons() {
    const subjectSelect = document.getElementById('subject');
    if (!subjectSelect) return;

    // Add icon class based on selected subject
    subjectSelect.addEventListener('change', () => {
        const value = subjectSelect.value.toLowerCase();
        subjectSelect.className = 'subject-icon';

        if (value.includes('math')) subjectSelect.classList.add('math');
        else if (value.includes('science')) subjectSelect.classList.add('science');
        else if (value.includes('english')) subjectSelect.classList.add('english');
        else if (value.includes('social')) subjectSelect.classList.add('social');
    });
}

// ============================================================================
// NEW BADGES
// ============================================================================

function addNewBadges() {
    // List of new topics to badge
    const newTopics = [
        'Persuasive Writing',
        'Literary Devices',
        'Grammar - Complex Sentences',
        'Research Skills',
        'Poetry Analysis',
        'Argumentative Writing',
        'Critical Analysis',
        'Advanced Grammar',
        'Media Analysis',
        'Novel Study Skills',
        'Formal Writing',
        'Text Features and Structures',
        'Informative Writing',
        'Grammar - Verb Tenses',
        'Compare and Contrast',
        'Media Literacy'
    ];

    // Add badges to topic dropdown options
    const topicSelect = document.getElementById('topic');
    if (!topicSelect) return;

    const observer = new MutationObserver(() => {
        Array.from(topicSelect.options).forEach(option => {
            if (newTopics.includes(option.value) && !option.textContent.includes('NEW')) {
                option.textContent += ' 🆕';
            }
        });
    });

    observer.observe(topicSelect, { childList: true });
}

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

window.showSuccessMessage = showSuccessMessage;

// ============================================================================
// ENHANCED GENERATE BUTTON
// ============================================================================

// Wrap the original generate button with loading animation
const originalGenerate = document.getElementById('generate');
if (originalGenerate) {
    originalGenerate.addEventListener('click', () => {
        showSuccessMessage('Generating worksheet...');
    });
}

// Wrap custom generate with AI loading
const customGenerate = document.getElementById('generateCustom');
if (customGenerate) {
    const originalHandler = customGenerate.onclick;
    customGenerate.onclick = function (e) {
        showAILoading('Generating AI Worksheet...');

        // Call original handler
        if (originalHandler) {
            originalHandler.call(this, e);
        }

        // Hide loading after delay (will be hidden when generation completes)
        setTimeout(() => {
            hideAILoading();
        }, 3000);
    };
}

console.log('[Enhancements] UI/UX enhancements loaded successfully');
