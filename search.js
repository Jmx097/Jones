// ============================================================================
// SEARCH FUNCTIONALITY
// Live search across all curriculum topics
// ============================================================================

class CurriculumSearch {
    constructor() {
        this.searchIndex = [];
        this.initialized = false;
    }

    // Build search index from curriculum data
    buildIndex() {
        if (this.initialized) return;

        console.log('[Search] Building search index...');
        this.searchIndex = [];

        try {
            for (const [grade, subjects] of Object.entries(curriculumData)) {
                for (const [subject, topics] of Object.entries(subjects)) {
                    for (const [topicKey, topicData] of Object.entries(topics)) {
                        this.searchIndex.push({
                            grade,
                            subject,
                            topicKey,
                            title: topicData.title || topicKey,
                            code: topicData.curriculumCode || '',
                            searchText: `${grade} ${subject} ${topicKey} ${topicData.title || ''} ${topicData.curriculumCode || ''}`.toLowerCase()
                        });
                    }
                }
            }
            this.initialized = true;
            console.log(`[Search] Index built with ${this.searchIndex.length} topics`);
        } catch (error) {
            console.error('[Search] Error building index:', error);
        }
    }

    // Search for matching topics
    search(query) {
        if (!this.initialized) this.buildIndex();
        if (!query || query.length < 2) return [];

        const lowerQuery = query.toLowerCase();
        const words = lowerQuery.split(/\s+/).filter(w => w.length > 0);

        return this.searchIndex
            .filter(item => {
                // Match if all words are found in the search text
                return words.every(word => item.searchText.includes(word));
            })
            .slice(0, 10); // Limit to top 10 results
    }

    // Select a search result
    selectResult(result) {
        console.log('[Search] Selected:', result);

        // Populate the dropdowns
        const gradeSelect = document.getElementById('grade');
        const subjectSelect = document.getElementById('subject');
        const topicSelect = document.getElementById('topic');

        if (gradeSelect && subjectSelect && topicSelect) {
            // Set grade
            gradeSelect.value = result.grade;
            gradeSelect.dispatchEvent(new Event('change'));

            // Wait for subject dropdown to populate
            setTimeout(() => {
                subjectSelect.value = result.subject;
                subjectSelect.dispatchEvent(new Event('change'));

                // Wait for topic dropdown to populate
                setTimeout(() => {
                    topicSelect.value = result.topicKey;
                    topicSelect.dispatchEvent(new Event('change'));

                    // Show success message
                    if (typeof showSuccessMessage === 'function') {
                        showSuccessMessage(`Selected: ${result.title}`);
                    }

                    // Scroll to controls
                    gradeSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }, 100);
        }
    }
}

// Create global search instance
const curriculumSearcher = new CurriculumSearch();

// ============================================================================
// SEARCH UI
// ============================================================================

function initializeSearch() {
    // Create search bar in header
    const header = document.querySelector('.main-header');
    if (!header) {
        console.warn('[Search] Header not found');
        return;
    }

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-wrapper">
            <input 
                type="text" 
                id="searchInput" 
                class="search-input" 
                placeholder="Search topics... (Press / to focus)"
                autocomplete="off"
            />
            <div id="searchResults" class="search-results"></div>
        </div>
    `;

    header.appendChild(searchContainer);

    // Add event listeners
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;

        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300); // Debounce 300ms
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Focus on search with / key (already handled in keyboard shortcuts)

    console.log('[Search] Search UI initialized');
}

function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    const results = curriculumSearcher.search(query);

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No topics found</div>';
        searchResults.classList.add('active');
        return;
    }

    const html = results.map((result, index) => `
        <div class="search-result-item" data-index="${index}" onclick="selectSearchResult(${index})">
            <div class="search-result-title">${highlightMatch(result.title, query)}</div>
            <div class="search-result-meta">Grade ${result.grade} • ${result.subject}</div>
        </div>
    `).join('');

    searchResults.innerHTML = html;
    searchResults.classList.add('active');

    // Store results for selection
    window.currentSearchResults = results;
}

function highlightMatch(text, query) {
    const words = query.toLowerCase().split(/\s+/);
    let highlighted = text;

    words.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });

    return highlighted;
}

function selectSearchResult(index) {
    if (!window.currentSearchResults || !window.currentSearchResults[index]) return;

    const result = window.currentSearchResults[index];
    curriculumSearcher.selectResult(result);

    // Clear search
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchInput) searchInput.value = '';
    if (searchResults) {
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
    }
}

// Make function globally available
window.selectSearchResult = selectSearchResult;

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
    initializeSearch();
}

console.log('[Search] Search module loaded');
