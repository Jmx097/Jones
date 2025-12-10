// AI Integration Module for Custom Worksheet Generation
// Supports OpenAI GPT-4, Anthropic Claude, and Google Gemini

// ============================================================================
// CONFIGURATION
// ============================================================================

const AI_CONFIG = {
    // Set your preferred AI provider: 'openai', 'claude', or 'gemini'
    provider: 'openai',

    // API Keys (IMPORTANT: In production, use environment variables or secure backend)
    apiKeys: {
        openai: 'YOUR_OPENAI_API_KEY_HERE',
        claude: 'YOUR_CLAUDE_API_KEY_HERE',
        gemini: 'YOUR_GEMINI_API_KEY_HERE'
    },

    // Model selection
    models: {
        openai: 'gpt-4',  // or 'gpt-3.5-turbo' for faster/cheaper
        claude: 'claude-3-sonnet-20240229',
        gemini: 'gemini-pro'
    },

    // Rate limiting
    maxRequestsPerMinute: 10,
    requestCount: 0,
    lastRequestTime: Date.now()
};

// ============================================================================
// AI PROVIDER IMPLEMENTATIONS
// ============================================================================

/**
 * OpenAI GPT-4 Integration
 */
async function generateWithOpenAI(prompt, grade, subject) {
    const apiKey = AI_CONFIG.apiKeys.openai;

    if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
        throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are an expert Ontario curriculum educator creating worksheets for Grade ${grade} ${subject}. 
Create engaging, curriculum-aligned content that is age-appropriate and follows Ontario Ministry of Education standards.
Format your response as structured JSON with the following format:
{
    "title": "Worksheet Title",
    "instructions": "Clear instructions for students",
    "problems": [
        {
            "number": 1,
            "question": "The question text",
            "type": "multiple-choice|short-answer|long-answer|problem-solving",
            "options": ["A", "B", "C", "D"],  // for multiple choice only
            "answer": "The correct answer or solution",
            "explanation": "Step-by-step explanation"
        }
    ]
}`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.models.openai,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON response
        try {
            return JSON.parse(content);
        } catch (e) {
            // If not JSON, return as plain text
            return { rawContent: content };
        }

    } catch (error) {
        logger.error('OpenAI generation failed', error);
        throw error;
    }
}

/**
 * Anthropic Claude Integration
 */
async function generateWithClaude(prompt, grade, subject) {
    const apiKey = AI_CONFIG.apiKeys.claude;

    if (!apiKey || apiKey === 'YOUR_CLAUDE_API_KEY_HERE') {
        throw new Error('Claude API key not configured');
    }

    const systemPrompt = `You are an expert Ontario curriculum educator creating worksheets for Grade ${grade} ${subject}. Create engaging, curriculum-aligned content.`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.models.claude,
                max_tokens: 2000,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.content[0].text;

        try {
            return JSON.parse(content);
        } catch (e) {
            return { rawContent: content };
        }

    } catch (error) {
        logger.error('Claude generation failed', error);
        throw error;
    }
}

/**
 * Google Gemini Integration
 */
async function generateWithGemini(prompt, grade, subject) {
    const apiKey = AI_CONFIG.apiKeys.gemini;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Gemini API key not configured');
    }

    const fullPrompt = `You are an expert Ontario curriculum educator creating worksheets for Grade ${grade} ${subject}. ${prompt}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.models.gemini}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;

        try {
            return JSON.parse(content);
        } catch (e) {
            return { rawContent: content };
        }

    } catch (error) {
        logger.error('Gemini generation failed', error);
        throw error;
    }
}

// ============================================================================
// DEMO MODE (No API Key Required)
// ============================================================================

/**
 * Generate demo worksheet without API calls
 * Uses template-based generation with randomization
 */
function generateDemoWorksheet(description, grade, subject) {
    console.log('[AI Demo Mode] Generating worksheet without API');

    // Extract topic from description
    const topicMatch = description.match(/(?:on|about)\s+([^.,]+)/i);
    const topic = topicMatch ? topicMatch[1].trim() : subject || 'General Topic';

    // Extract number of questions
    const numMatch = description.match(/(\d+)\s+(?:questions?|problems?)/i);
    const numProblems = numMatch ? parseInt(numMatch[1]) : 5;

    // Generate problems based on subject
    const problems = [];
    for (let i = 1; i <= Math.min(numProblems, 8); i++) {
        problems.push(generateDemoProblem(i, subject, topic, grade));
    }

    return {
        title: `${topic} - Grade ${grade} Worksheet`,
        curriculumCode: `${grade}${subject.charAt(0).toLowerCase()}1 - Ontario Curriculum`,
        instructions: `Complete all problems. Show your work for full marks. This is a demo worksheet generated without AI.`,
        problems: problems,
        isDemo: true
    };
}

/**
 * Generate a single demo problem
 */
function generateDemoProblem(number, subject, topic, grade) {
    const types = ['multiple-choice', 'short-answer', 'problem-solving'];
    const type = types[Math.floor(Math.random() * types.length)];

    let problem = {
        number: number,
        type: type
    };

    // Subject-specific problem generation
    if (subject === 'Mathematics' || subject.includes('math')) {
        problem = generateMathProblem(number, type, topic, grade);
    } else if (subject === 'Science' || subject.includes('science')) {
        problem = generateScienceProblem(number, type, topic, grade);
    } else if (subject === 'English' || subject.includes('english')) {
        problem = generateEnglishProblem(number, type, topic, grade);
    } else {
        problem.question = `Question ${number} about ${topic}`;
        problem.answer = "Sample answer";
        problem.explanation = "This is a demo problem. Configure an API key for real AI generation.";
    }

    return problem;
}

/**
 * Generate math demo problem
 */
function generateMathProblem(number, type, topic, grade) {
    const problems = [
        {
            question: "If a rectangle has a length of 12 cm and a width of 8 cm, what is its area?",
            answer: "96 cm²",
            explanation: "Area = length × width = 12 × 8 = 96 cm²"
        },
        {
            question: "Solve for x: 3x + 7 = 22",
            answer: "x = 5",
            explanation: "1. Subtract 7 from both sides: 3x = 15\n2. Divide by 3: x = 5"
        },
        {
            question: "What is 3/4 + 1/2?",
            answer: "1 1/4 or 5/4",
            explanation: "1. Find common denominator: 4\n2. Convert: 3/4 + 2/4 = 5/4 = 1 1/4"
        },
        {
            question: "A store sells pencils for $0.75 each. How much do 8 pencils cost?",
            answer: "$6.00",
            explanation: "Cost = price × quantity = $0.75 × 8 = $6.00"
        }
    ];

    const selected = problems[number % problems.length];

    if (type === 'multiple-choice') {
        return {
            number: number,
            type: type,
            question: selected.question,
            options: [selected.answer, "Wrong answer A", "Wrong answer B", "Wrong answer C"].sort(() => Math.random() - 0.5),
            answer: selected.answer,
            explanation: selected.explanation
        };
    }

    return {
        number: number,
        type: type,
        question: selected.question,
        answer: selected.answer,
        explanation: selected.explanation
    };
}

/**
 * Generate science demo problem
 */
function generateScienceProblem(number, type, topic, grade) {
    const problems = [
        {
            question: "What are the three states of matter?",
            answer: "Solid, liquid, and gas",
            explanation: "Matter exists in three main states: solid (fixed shape), liquid (takes shape of container), and gas (fills entire container)."
        },
        {
            question: "What is photosynthesis?",
            answer: "The process plants use to make food using sunlight",
            explanation: "Photosynthesis is when plants convert sunlight, water, and CO₂ into glucose (food) and oxygen."
        },
        {
            question: "Name two renewable energy sources.",
            answer: "Solar and wind (or hydro, geothermal)",
            explanation: "Renewable energy sources can be replenished naturally. Examples include solar, wind, hydro, and geothermal."
        }
    ];

    const selected = problems[number % problems.length];

    return {
        number: number,
        type: type,
        question: selected.question,
        answer: selected.answer,
        explanation: selected.explanation
    };
}

/**
 * Generate English demo problem
 */
function generateEnglishProblem(number, type, topic, grade) {
    const problems = [
        {
            question: "Identify the simile in this sentence: 'Her smile was as bright as the sun.'",
            answer: "'as bright as the sun'",
            explanation: "A simile compares two things using 'like' or 'as'. Here, the smile is compared to the sun using 'as'."
        },
        {
            question: "What is the main idea of a paragraph?",
            answer: "The central point or message the paragraph conveys",
            explanation: "The main idea is what the paragraph is mostly about. Supporting details provide evidence for the main idea."
        },
        {
            question: "Rewrite in active voice: 'The ball was thrown by Sarah.'",
            answer: "Sarah threw the ball.",
            explanation: "Active voice: subject performs action. Passive voice: subject receives action. Active is usually clearer."
        }
    ];

    const selected = problems[number % problems.length];

    return {
        number: number,
        type: type,
        question: selected.question,
        answer: selected.answer,
        explanation: selected.explanation
    };
}

// ============================================================================
// MAIN AI GENERATION FUNCTION
// ============================================================================

/**
 * Generate custom worksheet using AI
 * @param {string} description - User's description of desired worksheet
 * @param {string} grade - Grade level (5-8)
 * @param {string} subject - Subject area (optional, extracted from description if not provided)
 * @returns {Promise<Object>} Generated worksheet data
 */
async function generateAIWorksheetReal(description, grade, subject = null) {
    // Extract subject from description if not provided
    if (!subject) {
        subject = extractSubject(description);
    }

    // Check if API key is configured - if not, use demo mode
    const apiKey = AI_CONFIG.apiKeys[AI_CONFIG.provider];
    const isApiKeyConfigured = apiKey && !apiKey.includes('YOUR_') && !apiKey.includes('_KEY_HERE');

    if (!isApiKeyConfigured) {
        console.log('[AI] No API key configured - using demo mode');
        // Use demo mode
        return generateDemoWorksheet(description, grade, subject);
    }

    // Rate limiting check
    const now = Date.now();
    if (now - AI_CONFIG.lastRequestTime < 60000) {
        AI_CONFIG.requestCount++;
        if (AI_CONFIG.requestCount > AI_CONFIG.maxRequestsPerMinute) {
            throw new Error('Rate limit exceeded. Please wait a moment before generating another worksheet.');
        }
    } else {
        AI_CONFIG.requestCount = 1;
        AI_CONFIG.lastRequestTime = now;
    }

    // Build comprehensive prompt
    const prompt = buildPrompt(description, grade, subject);

    logger.log('Generating AI worksheet', { provider: AI_CONFIG.provider, grade, subject });

    try {
        let result;

        switch (AI_CONFIG.provider) {
            case 'openai':
                result = await generateWithOpenAI(prompt, grade, subject);
                break;
            case 'claude':
                result = await generateWithClaude(prompt, grade, subject);
                break;
            case 'gemini':
                result = await generateWithGemini(prompt, grade, subject);
                break;
            default:
                throw new Error(`Unknown AI provider: ${AI_CONFIG.provider}`);
        }

        logger.log('AI generation successful', result);
        return result;

    } catch (error) {
        logger.error('AI generation failed, falling back to demo mode', error);
        // Fallback to demo mode on error
        return generateDemoWorksheet(description, grade, subject);
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract subject from description
 */
function extractSubject(description) {
    const desc = description.toLowerCase();

    if (desc.includes('math') || desc.includes('number') || desc.includes('fraction') || desc.includes('algebra')) {
        return 'Mathematics';
    }
    if (desc.includes('science') || desc.includes('ecosystem') || desc.includes('energy') || desc.includes('matter')) {
        return 'Science';
    }
    if (desc.includes('english') || desc.includes('writing') || desc.includes('reading') || desc.includes('grammar')) {
        return 'English';
    }
    if (desc.includes('social') || desc.includes('history') || desc.includes('geography')) {
        return 'Social Studies';
    }

    return 'General';
}

/**
 * Build comprehensive prompt for AI
 */
function buildPrompt(description, grade, subject) {
    return `Create a Grade ${grade} ${subject} worksheet based on this description: "${description}"

Requirements:
1. Align with Ontario curriculum expectations for Grade ${grade}
2. Include 5-10 problems/questions appropriate for the grade level
3. Vary question types (multiple choice, short answer, problem-solving)
4. Provide clear instructions
5. Include answer key with explanations
6. Make content engaging and relevant to students' lives

Format the response as JSON with this structure:
{
    "title": "Worksheet title",
    "curriculumCode": "Ontario curriculum code if applicable",
    "instructions": "Clear student instructions",
    "problems": [
        {
            "number": 1,
            "question": "Question text",
            "type": "multiple-choice|short-answer|problem-solving",
            "options": ["A", "B", "C", "D"],
            "answer": "Correct answer",
            "explanation": "Step-by-step solution"
        }
    ]
}`;
}

/**
 * Format AI-generated content into HTML worksheet
 */
function formatAIWorksheet(aiData, grade, description) {
    let html = `
        <div class="workbook-page">
            <div class="page-header">
                <h1>Ontario Curriculum Worksheet</h1>
                <div class="page-subheader">
                    <span>Grade ${grade}</span>
                    <span>AI Generated</span>
                </div>
            </div>
    `;

    // Handle raw content (non-JSON response)
    if (aiData.rawContent) {
        html += `
            <div class="lesson-section">
                <h2>📝 ${aiData.title || 'Custom Worksheet'}</h2>
                <div style="white-space: pre-wrap;">${aiData.rawContent}</div>
            </div>
        `;
    } else {
        // Structured JSON response
        html += `
            <div class="lesson-section">
                <h2>📝 ${aiData.title || 'Custom Worksheet'}</h2>
                ${aiData.curriculumCode ? `<p><strong>Curriculum Code:</strong> ${aiData.curriculumCode}</p>` : ''}
                ${aiData.instructions ? `<p><strong>Instructions:</strong> ${aiData.instructions}</p>` : ''}
            </div>
        `;

        // Add problems
        if (aiData.problems && aiData.problems.length > 0) {
            html += '<div class="lesson-section"><h3>Problems</h3>';

            aiData.problems.forEach(problem => {
                html += `
                    <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 8px;">
                        <h4 style="margin-top: 0;">Problem ${problem.number}</h4>
                        <p><strong>Q:</strong> ${problem.question}</p>
                `;

                // Add options for multiple choice
                if (problem.type === 'multiple-choice' && problem.options) {
                    html += '<ul style="list-style-type: none; padding-left: 20px;">';
                    problem.options.forEach(option => {
                        html += `<li style="margin: 5px 0;">○ ${option}</li>`;
                    });
                    html += '</ul>';
                }

                // Add answer space
                html += `
                        <div style="height: ${problem.type === 'long-answer' ? '100px' : '60px'}; border-bottom: 1px solid #ccc; margin: 10px 0;"></div>
                    </div>
                `;
            });

            html += '</div>';

            // Add answer key
            html += `
                <div class="lesson-section answer-key" style="display: none;">
                    <h3>📋 Answer Key</h3>
            `;

            aiData.problems.forEach(problem => {
                html += `
                    <div style="margin: 15px 0; padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px;">
                        <p><strong>Problem ${problem.number}:</strong></p>
                        <p><strong style="color: #10b981;">Answer:</strong> ${problem.answer}</p>
                        ${problem.explanation ? `<p><strong>Explanation:</strong> ${problem.explanation}</p>` : ''}
                    </div>
                `;
            });

            html += '</div>';
        }
    }

    html += '</div>';
    return html;
}

// ============================================================================
// EXPORT
// ============================================================================

// Make functions available globally
if (typeof window !== 'undefined') {
    window.generateAIWorksheetReal = generateAIWorksheetReal;
    window.formatAIWorksheet = formatAIWorksheet;
    window.AI_CONFIG = AI_CONFIG;
}
