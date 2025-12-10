// curriculumData is loaded from curriculum.js

// ============================================================================
// ERROR HANDLING & LOGGING SYSTEM
// ============================================================================

const DEBUG_MODE = true; // Set to false in production

// Logging utility
const logger = {
    log: (message, data = null) => {
        if (DEBUG_MODE) {
            console.log(`[Workbook Generator] ${message}`, data || '');
        }
    },
    error: (message, error = null) => {
        console.error(`[ERROR] ${message}`, error || '');
    },
    warn: (message, data = null) => {
        console.warn(`[WARNING] ${message}`, data || '');
    }
};

// Error display utility
function showError(message, details = '') {
    const errorHTML = `
        <div style="background: #fee; border-left: 4px solid #c00; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #c00; margin-top: 0;">⚠️ Error</h3>
            <p><strong>${message}</strong></p>
            ${details ? `<p style="color: #666; font-size: 0.9em;">${details}</p>` : ''}
            <p style="margin-bottom: 0; font-size: 0.9em;">
                <em>If this problem persists, please refresh the page or contact support.</em>
            </p>
        </div>
    `;
    workbookContent.innerHTML = errorHTML;
    workbook.classList.remove('hidden');
    logger.error(message, details);
}

// Success message utility
function showSuccess(message) {
    logger.log('Success:', message);
}

// Validate curriculum data
function validateCurriculumData() {
    try {
        if (typeof curriculumData === 'undefined') {
            throw new Error('Curriculum data not loaded');
        }
        if (Object.keys(curriculumData).length === 0) {
            throw new Error('Curriculum data is empty');
        }
        logger.log('Curriculum data validated successfully', {
            grades: Object.keys(curriculumData).length,
            totalTopics: Object.values(curriculumData).reduce((sum, grade) =>
                sum + Object.values(grade).reduce((s, subject) => s + Object.keys(subject).length, 0), 0)
        });
        return true;
    } catch (error) {
        logger.error('Curriculum data validation failed', error);
        showError('Failed to load curriculum data', 'Please refresh the page. If the problem continues, the curriculum file may be corrupted.');
        return false;
    }
}

// Safe element getter
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        logger.warn(`Element not found: ${id}`);
    }
    return element;
}

// Initialize and validate on load
document.addEventListener('DOMContentLoaded', () => {
    logger.log('Application initializing...');
    validateCurriculumData();
});

// Mode switching
const standardModeBtn = document.getElementById('standardMode');
const customModeBtn = document.getElementById('customMode');
const standardSection = document.getElementById('standardSection');
const customSection = document.getElementById('customSection');

standardModeBtn.addEventListener('click', () => {
    standardModeBtn.classList.add('active');
    customModeBtn.classList.remove('active');
    standardSection.classList.remove('hidden');
    customSection.classList.add('hidden');
});

customModeBtn.addEventListener('click', () => {
    customModeBtn.classList.add('active');
    standardModeBtn.classList.remove('active');
    customSection.classList.remove('hidden');
    standardSection.classList.add('hidden');
});

// Standard workflow elements
const gradeSelect = document.getElementById('grade');
const subjectSelect = document.getElementById('subject');
const topicSelect = document.getElementById('topic');
const formatSelect = document.getElementById('format');
const generateBtn = document.getElementById('generate');
const workbook = document.getElementById('workbook');
const workbookContent = document.getElementById('workbook-content');

// Custom AI elements
const customGradeSelect = document.getElementById('customGrade');
const customDescription = document.getElementById('customDescription');
const generateCustomBtn = document.getElementById('generateCustom');
const aiLoading = document.getElementById('aiLoading');

// Advanced Options elements
const advancedToggle = document.getElementById('advancedToggle');
const advancedOptions = document.getElementById('advancedOptions');
const includeAnswersCheck = document.getElementById('includeAnswers');
const difficultySelect = document.getElementById('difficulty');
const toggleAnswersBtn = document.getElementById('toggleAnswers');
const exportPDFBtn = document.getElementById('exportPDF');

// State for features
let answersIncluded = false;
let answersVisible = false;

// Toggle Advanced Options
advancedToggle.addEventListener('click', () => {
    advancedOptions.classList.toggle('hidden');
    advancedToggle.textContent = advancedOptions.classList.contains('hidden')
        ? '⚙️ Advanced Options'
        : '⚙️ Hide Advanced Options';
});

// PDF Export (uses browser print dialog)
exportPDFBtn.addEventListener('click', () => {
    window.print();
});

// Toggle Answer Visibility
toggleAnswersBtn.addEventListener('click', () => {
    answersVisible = !answersVisible;
    const answerElements = document.querySelectorAll('.answer-key');
    answerElements.forEach(elem => {
        elem.style.display = answersVisible ? 'block' : 'none';
    });
    toggleAnswersBtn.textContent = answersVisible ? '🙈 Hide Answers' : '👁️ Show Answers';
});

// Enable custom generate button when both inputs filled
function checkCustomInputs() {
    const hasGrade = customGradeSelect.value !== '';
    const hasDescription = customDescription.value.trim().length > 10;
    generateCustomBtn.disabled = !(hasGrade && hasDescription);
}

customGradeSelect.addEventListener('change', checkCustomInputs);
customDescription.addEventListener('input', checkCustomInputs);

// Generate custom worksheet
generateCustomBtn.addEventListener('click', () => {
    const grade = customGradeSelect.value;
    const description = customDescription.value.trim();

    generateCustomBtn.disabled = true;
    aiLoading.classList.remove('hidden');

    // Simulate AI generation
    setTimeout(() => {
        generateAIWorksheet(grade, description);
        aiLoading.classList.add('hidden');
        generateCustomBtn.disabled = false;
        workbook.classList.remove('hidden');
        workbook.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
});

// When grade is picked, load subjects
gradeSelect.addEventListener('change', () => {
    const grade = gradeSelect.value;

    subjectSelect.innerHTML = '<option value="">-- Choose --</option>';
    topicSelect.innerHTML = '<option value="">-- Choose --</option>';
    subjectSelect.disabled = true;
    topicSelect.disabled = true;
    generateBtn.disabled = true;

    if (grade) {
        const subjects = Object.keys(curriculumData[grade] || {});
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
        subjectSelect.disabled = false;
    }
});

// When subject is picked, load topics
subjectSelect.addEventListener('change', () => {
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;

    topicSelect.innerHTML = '<option value="">-- Choose --</option>';
    topicSelect.disabled = true;
    generateBtn.disabled = true;

    if (subject) {
        const topics = Object.keys(curriculumData[grade][subject] || {});
        topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            topicSelect.appendChild(option);
        });
        topicSelect.disabled = false;
    }
});

// When topic is picked, enable generate button
topicSelect.addEventListener('change', () => {
    generateBtn.disabled = !topicSelect.value;
});


// Generate workbook
generateBtn.addEventListener('click', () => {
    const grade = gradeSelect.value;
    const subject = subjectSelect.value;
    const topic = topicSelect.value;
    const format = formatSelect.value;

    try {
        logger.log('Generating workbook', { grade, subject, topic, format });

        // Show loading indicator
        if (typeof showAILoading === 'function') {
            showAILoading('Generating Worksheet...');
        }

        // Capture advanced options
        answersIncluded = includeAnswersCheck.checked;
        const difficulty = difficultySelect.value;
        const answerKeyMode = document.getElementById('answerKeyMode')?.value || 'inline';

        // Validate data exists
        if (!curriculumData[grade]) {
            throw new Error(`Grade ${grade} not found in curriculum data`);
        }
        if (!curriculumData[grade][subject]) {
            throw new Error(`Subject "${subject}" not found for Grade ${grade}`);
        }
        if (!curriculumData[grade][subject][topic]) {
            throw new Error(`Topic "${topic}" not found in ${subject} for Grade ${grade}`);
        }

        const data = curriculumData[grade][subject][topic];

        // Small delay to show loading indicator
        setTimeout(() => {
            if (format === 'workbook') {
                generateCompleteWorkbook(data, grade, subject, topic, answersIncluded, difficulty, answerKeyMode);
            } else {
                generateSingleWorksheet(data, grade, subject, topic, 0, answersIncluded, difficulty, answerKeyMode);
            }

            // Hide loading indicator
            if (typeof hideAILoading === 'function') {
                hideAILoading();
            }
        }, 100);

        // Show/hide toggle answers button
        if (answersIncluded) {
            toggleAnswersBtn.style.display = 'inline-block';
            answersVisible = false; // Start with answers hidden
        } else {
            toggleAnswersBtn.style.display = 'none';
        }

        workbook.classList.remove('hidden');
        workbook.scrollIntoView({ behavior: 'smooth' });

        showSuccess(`Generated ${format} for Grade ${grade} ${subject} - ${topic}`);

    } catch (error) {
        logger.error('Failed to generate workbook', error);
        showError(
            'Unable to generate workbook',
            `There was a problem creating the ${format} for ${subject} - ${topic}. ${error.message}`
        );
    }
});

function generateAIWorksheet(grade, description) {
    // Parse description
    const topicMatch = description.match(/(?:on|about)\s+([^.,]+)/i);
    const topic = topicMatch ? topicMatch[1].trim() : 'Custom Topic';

    const numQuestionsMatch = description.match(/(\d+)\s+(?:questions?|problems?)/i);
    const numQuestions = numQuestionsMatch ? parseInt(numQuestionsMatch[1]) : 5;

    let html = `
        <div class="workbook-page">
            <div class="worksheet-header">
                <div>Name: _________________________</div>
                <div>Date: _________________________</div>
            </div>
            <h2 style="font-family: 'Lora', serif; color: #1e293b; font-size: 2rem; margin-bottom: 15px;">
                ${topic}
            </h2>
            <h3 style="color: #667eea; font-size: 1.3rem; margin-bottom: 25px;">
                Grade ${grade} - Custom Worksheet
            </h3>
            
            <div class="tutorial-section">
                <div class="section-badge">📚 LEARN</div>
                <h3>Understanding the Topic</h3>
                <p>This worksheet focuses on: ${description}</p>
                <p>Take your time and show all your work. Remember to check your answers!</p>
            </div>
            
            <div class="examples-section">
                <div class="section-badge">💡 EXAMPLE</div>
                <div class="example-box">
                    <div class="example-header">Sample Problem</div>
                    <div class="problem"><strong>Problem:</strong> This is a sample problem based on your description.</div>
                    <div class="solution-steps">
                        <strong>Solution Steps:</strong>
                        <div class="step">1. Read the problem carefully</div>
                        <div class="step">2. Identify what you need to find</div>
                        <div class="step">3. Apply the appropriate method</div>
                        <div class="step">4. Show your work clearly</div>
                    </div>
                    <div class="final-answer"><strong>Answer:</strong> Check your solution</div>
                </div>
            </div>
            
            <div class="practice-section">
                <div class="section-badge">✏️ PRACTICE</div>
                <p class="practice-instruction">Complete these practice problems. Show your work!</p>
                <ol class="practice-questions">
    `;

    for (let i = 1; i <= numQuestions; i++) {
        html += `
            <li class="practice-item">
                <div class="question-text">Problem ${i}: Apply what you learned about ${topic} to solve this problem.</div>
                <div class="answer-space" style="height: 100px;"></div>
            </li>
        `;
    }

    html += `
                </ol>
                <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-left: 5px solid #667eea; border-radius: 8px;">
                    <strong>💡 Reflection:</strong> What did you learn from completing this worksheet?
                    <div class="answer-space" style="height: 80px; margin-left: 0;"></div>
                </div>
            </div>
        </div>
    `;

    workbookContent.innerHTML = html;
}

function generateCompleteWorkbook(data, grade, subject, topic, includeAnswers = false, difficulty = 'mixed') {
    let html = '';

    // Cover Page
    html += `
        <div class="workbook-page cover-page">
            <div class="cover-content">
                <h1>${data.title}</h1>
                <h2>Grade ${grade} ${subject}</h2>
                <div class="curriculum-code">
                    <strong>Ontario Curriculum:</strong> ${data.curriculumCode}<br>
                    <strong>Overall Expectation:</strong> ${data.overallExpectation}
                </div>
                <div class="student-info-cover">
                    <p>Name: _______________________________</p>
                    <p>Class: _______________________________</p>
                    <p>Date: _______________________________</p>
                </div>
                <div class="workbook-toc">
                    <h3>Table of Contents</h3>
                    <ol>
                        ${data.workbook.map(lesson => `
                            <li>Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}</li>
                        `).join('')}
                        ${includeAnswers ? '<li>Answer Key</li>' : ''}
                    </ol>
                </div>
            </div>
        </div>
        <div class="page-break"></div>
    `;

    // Generate each lesson
    data.workbook.forEach((lesson, index) => {
        html += generateLesson(lesson, index + 1, data.workbook.length, includeAnswers, difficulty);
        if (index < data.workbook.length - 1) {
            html += '<div class="page-break"></div>';
        }
    });

    // Add Answer Key Page if requested
    if (includeAnswers) {
        html += '<div class="page-break"></div>';
        html += generateAnswerKey(data, difficulty);
    }

    workbookContent.innerHTML = html;
}


function generateLesson(lesson, lessonNum, totalLessons, includeAnswers = false, difficulty = 'mixed') {
    let html = `
        <div class="workbook-page lesson-page">
            <div class="lesson-header">
                <div class="lesson-number">Lesson ${lesson.lessonNumber} of ${totalLessons}</div>
                <h2>${lesson.lessonTitle}</h2>
            </div>
    `;

    // Tutorial Section
    if (lesson.tutorial) {
        html += `
            <div class="tutorial-section">
                <div class="section-badge">📚 LEARN</div>
                ${formatTutorial(lesson.tutorial)}
            </div>
        `;
    }

    // Key Terms
    if (lesson.keyTerms && lesson.keyTerms.length > 0) {
        html += `
            <div class="key-terms">
                <strong>📝 Key Terms:</strong> ${lesson.keyTerms.join(', ')}
            </div>
        `;
    }

    // Worked Examples
    if (lesson.examples && lesson.examples.length > 0) {
        html += `
            <div class="examples-section">
                <div class="section-badge">💡 EXAMPLES</div>
        `;

        lesson.examples.forEach((example, index) => {
            html += `
                <div class="example-box">
                    <div class="example-header">Example ${index + 1}</div>
                    <div class="problem"><strong>Problem:</strong> ${example.problem}</div>
                    <div class="solution-steps">
                        <strong>Solution Steps:</strong>
                        ${example.steps.map(step => `<div class="step">${step}</div>`).join('')}
                    </div>
                    <div class="final-answer"><strong>Answer:</strong> ${example.solution}</div>
                </div>
            `;
        });

        html += `</div>`;
    }

    // Practice Questions
    if (lesson.practice && lesson.practice.length > 0) {
        html += `
            <div class="practice-section">
                <div class="section-badge">✏️ PRACTICE</div>
                <p class="practice-instruction">Complete these practice problems. Show your work!</p>
                <ol class="practice-questions">
        `;

        lesson.practice.forEach(q => {
            html += `
                <li class="practice-item">
                    <div class="question-text">${q.text}</div>
                    ${q.space ? `<div class="answer-space" style="height: ${q.space}px;"></div>` : ''}
                </li>
            `;
        });

        html += `
                </ol>
            </div>
        `;
    }

    html += `</div>`;

    return html;
}

function formatTutorial(tutorialText) {
    // First, convert escaped newlines to actual newlines
    let text = tutorialText.replace(/\\n/g, '\n');

    // Split into lines for processing
    let lines = text.split('\n');
    let html = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (!line) {
            // Empty line - close lists
            if (inList) {
                html.push('</ul>');
                inList = false;
            }
            continue;
        }

        // Process headers
        if (line.startsWith('### ')) {
            if (inList) { html.push('</ul>'); inList = false; }
            html.push('<h5>' + line.substring(4) + '</h5>');
        } else if (line.startsWith('## ')) {
            if (inList) { html.push('</ul>'); inList = false; }
            html.push('<h4>' + line.substring(3) + '</h4>');
        } else if (line.startsWith('# ')) {
            if (inList) { html.push('</ul>'); inList = false; }
            html.push('<h3>' + line.substring(2) + '</h3>');
        }
        // Process list items
        else if (line.startsWith('- ')) {
            if (!inList) {
                html.push('<ul>');
                inList = true;
            }
            html.push('<li>' + formatInline(line.substring(2)) + '</li>');
        }
        // Process numbered lists
        else if (/^\d+\./.test(line)) {
            html.push('<p>' + formatInline(line) + '</p>');
        }
        // Regular paragraph
        else {
            if (inList) { html.push('</ul>'); inList = false; }
            html.push('<p>' + formatInline(line) + '</p>');
        }
    }

    // Close any open lists
    if (inList) {
        html.push('</ul>');
    }

    return html.join('');
}

// Format inline markdown (bold text)
function formatInline(text) {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// Generate Answer Key Page
function generateAnswerKey(data, difficulty = 'mixed') {
    let html = `
        <div class="workbook-page lesson-page answer-key" style="display:none;">
            <div class="lesson-header">
                <div class="lesson-number">ANSWER KEY</div>
                <h2>📝 Practice Problem Answers</h2>
            </div>
            <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #f59e0b;">
                <strong>⚠️ Teacher/Parent Note:</strong> These are sample answers. Student responses may vary while still being correct.
            </div>
    `;

    data.workbook.forEach((lesson, lessonIdx) => {
        if (lesson.practice && lesson.practice.length > 0) {
            html += `
                <div style="margin: 30px 0; padding: 25px; background: #f8fafc; border-radius: 12px; border-left: 5px solid #667eea;">
                    <h3 style="color: #667eea; margin-bottom: 15px;">Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}</h3>
                    <ol style="padding-left: 30px;">
            `;

            lesson.practice.forEach((q, qIdx) => {
                const answer = generateSampleAnswer(q.text, difficulty, lesson.lessonTitle);
                html += `
                    <li style="margin: 15px 0; line-height: 1.8;">
                        <strong>Q:</strong> ${q.text}<br>
                        <strong style="color: #10b981;">A:</strong> ${answer}
                    </li>
                `;
            });

            html += `
                    </ol>
                </div>
            `;
        }
    });

    html += `</div>`;
    return html;
}

// Generate sample answer based on question and difficulty
function generateSampleAnswer(questionText, difficulty, lessonTitle) {
    // This is a simplified answer generator
    // In a real implementation, you might want more sophisticated logic

    const difficultyText = {
        'easy': '(Basic level answer)',
        'medium': '(Detailed answer)',
        'hard': '(Advanced answer with explanation)'
    };

    // Generic answer that adapts to difficulty
    if (difficulty === 'easy') {
        return 'Sample answer: [Student should provide basic response based on lesson concepts]';
    } else if (difficulty === 'medium') {
        return 'Sample answer: [Student should provide detailed response with explanation using concepts from the tutorial]';
    } else if (difficulty === 'hard') {
        return 'Sample answer: [Student should provide comprehensive response with detailed explanation, examples, and connection to real-world applications]';
    } else {
        return 'Sample answer: [Answers will vary - assess based on understanding of key concepts from the lesson]';
    }
}

function generateSingleWorksheet(data, grade, subject, topic, lessonIndex, includeAnswers = false, difficulty = 'mixed') {
    const lesson = data.workbook[lessonIndex];
    let html = `
        <div class="workbook-page">
            <div class="worksheet-header">
                <div>Name: _________________________</div>
                <div>Date: _________________________</div>
            </div>
            <h2 style="font-family: 'Lora', serif;">${data.title} - ${lesson.lessonTitle}</h2>
            <h3 style="color: #667eea;">Grade ${grade} ${subject}</h3>
            <div class="curriculum-info">
                <small><strong>Curriculum:</strong> ${data.curriculumCode}</small>
            </div>
            ${generateLesson(lesson, lessonIndex + 1, data.workbook.length, includeAnswers, difficulty)}
        </div>
    `;

    // Add answer key for single worksheet if requested
    if (includeAnswers) {
        html += '<div class="page-break"></div>';
        html += `
            <div class="workbook-page answer-key" style="display:none;">
                <h2>📝 Answer Key</h2>
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <strong>Note:</strong> Sample answers provided. Student responses may vary.
                </div>
        `;

        if (lesson.practice && lesson.practice.length > 0) {
            html += '<ol style="padding-left: 30px;">';
            lesson.practice.forEach((q) => {
                const answer = generateSampleAnswer(q.text, difficulty, lesson.lessonTitle);
                html += `
                    <li style="margin: 15px 0;">
                        <strong>Q:</strong> ${q.text}<br>
                        <strong style="color: #10b981;">A:</strong> ${answer}
                    </li>
                `;
            });
            html += '</ol>';
        }

        html += '</div>';
    }

    workbookContent.innerHTML = html;
}

// Generate AI Custom Worksheet (simulated)
function generateAIWorksheet(grade, description) {
    const html = `
        <div class="workbook-page">
            <div class="page-header">
                <h1>Ontario Curriculum Worksheet</h1>
                <div class="page-subheader">
                    <span>Grade ${grade}</span>
                    <span>Custom Generated</span>
                </div>
            </div>

            <div class="lesson-section">
                <h2>📝 Custom Worksheet</h2>
                <p><strong>Generated based on:</strong> ${description}</p>
            </div>

            <div class="lesson-section">
                <div class="info-box">
                    <h3>🤖 AI Worksheet Generation (Demo Mode)</h3>
                    <p>This is a <strong>simulation</strong> of AI-powered worksheet generation.</p>
                    <p><strong>Your request:</strong> "${description}"</p>
                    <p style="margin-top: 15px;"><strong>To enable real AI generation:</strong></p>
                    <ol style="padding-left: 25px; margin-top: 10px;">
                        <li>Integrate OpenAI API or similar service</li>
                        <li>Configure API credentials</li>
                        <li>Implement prompt engineering for educational content</li>
                        <li>Add content validation and safety filters</li>
                    </ol>
                </div>
            </div>

            <div class="lesson-section">
                <h3>Sample Problems (Placeholder)</h3>
                <p>Below is example content that would be AI-generated based on your description:</p>
                
                <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 8px;">
                    <h4 style="margin-top: 0;">Problem 1</h4>
                    <p>This problem would be generated based on: "${description}"</p>
                    <div style="height: 60px; border-bottom: 1px solid #ccc; margin: 10px 0;"></div>
                </div>

                <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 8px;">
                    <h4 style="margin-top: 0;">Problem 2</h4>
                    <p>This problem would be generated based on: "${description}"</p>
                    <div style="height: 60px; border-bottom: 1px solid #ccc; margin: 10px 0;"></div>
                </div>

                <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 8px;">
                    <h4 style="margin-top: 0;">Problem 3</h4>
                    <p>This problem would be generated based on: "${description}"</p>
                    <div style="height: 60px; border-bottom: 1px solid #ccc; margin: 10px 0;"></div>
                </div>

                <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 8px;">
                    <h4 style="margin-top: 0;">Problem 4</h4>
                    <p>This problem would be generated based on: "${description}"</p>
                    <div style="height: 60px; border-bottom: 1px solid #ccc; margin: 10px 0;"></div>
                </div>

                <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 8px;">
                    <h4 style="margin-top: 0;">Problem 5</h4>
                    <p>This problem would be generated based on: "${description}"</p>
                    <div style="height: 60px; border-bottom: 1px solid #ccc; margin: 10px 0;"></div>
                </div>
            </div>

            <div class="lesson-section">
                <div class="info-box" style="background: #fffbeb; border-left-color: #f59e0b;">
                    <h3>💡 Development Note</h3>
                    <p><strong>Current Status:</strong> This feature displays placeholder content to demonstrate the interface.</p>
                    <p><strong>For Production:</strong> Replace this function with actual AI API calls to generate curriculum-aligned content based on the user's description and selected grade level.</p>
                    <p><strong>Recommended Services:</strong></p>
                    <ul style="padding-left: 25px; margin-top: 10px;">
                        <li>OpenAI GPT-4 (excellent for educational content)</li>
                        <li>Anthropic Claude (strong reasoning capabilities)</li>
                        <li>Google Gemini (good for multimodal content)</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    workbookContent.innerHTML = html;
    answersIncluded = false;
    toggleAnswersBtn.style.display = 'none';
}
