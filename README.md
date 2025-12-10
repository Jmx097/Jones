# 📚 Ontario Curriculum Workbook Generator

> Professional learning materials aligned with Ontario curriculum expectations for Grades 5-8

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A comprehensive web application that generates customized worksheets and workbooks for Ontario curriculum topics across Mathematics, Science, English, and Social Studies.

---

## ✨ Features

### **📖 100+ Curriculum Topics**
- Grades 5-8 coverage
- Mathematics, Science, English, Social Studies
- Aligned with Ontario curriculum expectations
- Pre-built comprehensive workbooks

### **🤖 AI-Powered Custom Worksheets**
- Describe worksheets in plain English
- Demo mode (no API key required)
- Support for OpenAI, Claude, and Gemini
- Template-based realistic generation

### **🎨 Modern User Interface**
- 🌙 Dark mode with persistence
- ⌨️ 7 keyboard shortcuts for efficiency
- 🔍 Live search across all topics
- 📋 Preview panel with topic details
- 💡 Interactive tutorials and tooltips

### **⚙️ Advanced Options**
- Answer keys with detailed solutions
- Difficulty levels (Easy, Medium, Hard, Mixed)
- Multiple answer key modes (inline, separate page, side-by-side)
- PDF export capability
- Print-optimized formatting

### **♿ Accessibility**
- Keyboard navigation
- Screen reader friendly
- High contrast support
- Focus indicators
- Responsive design

---

## 🚀 Quick Start

### **Running Locally**

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser
3. **Done!** No build process or dependencies required

```bash
# Optional: Serve via local server for better performance
python -m http.server 8000
# Then open http://localhost:8000
```

### **First Use**

1. A welcome tutorial will appear automatically
2. Choose between **Standard Mode** or **Custom Mode**
3. **Standard:** Select Grade → Subject → Topic → Format
4. **Custom:** Describe your worksheet (e.g., "Grade 7 math fractions worksheet with 8 problems")
5. Click "Generate Workbook" or press `Ctrl+G`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+G` | Generate worksheet |
| `Ctrl+P` | Print / Export PDF |
| `Ctrl+S` | Save configuration |
| `Ctrl+N` | Reset worksheet |
| `Ctrl+D` | Toggle dark mode |
| `/` | Focus search |
| `Esc` | Close modals |
| `?` | Show help |

---

## 📂 Project Structure

```
worksheet-generator/
├── index.html              # Main application
├── styles.css              # Global styles
├── script.js               # Core functionality
├── enhancements.css        # UI enhancements styles
├── enhancements.js         # UI enhancements logic
├── polish.css              # Search & help styles
├── search.js               # Search functionality
├── help.js                 # Help system
├── ai-integration.js       # AI worksheet generation
├── answer-key-modes.css    # Answer key styling
├── data/
│   ├── curriculum.js       # Grade 5 base curriculum
│   ├── grade7-english-expansion.js  # Grade 7 English topics
│   └── grade8-english-expansion.js  # Grade 8 English topics
├── AI_SETUP_GUIDE.md       # AI integration instructions
├── DEBUG_REPORT.md         # Debugging and improvements
└── README.md               # This file
```

---

## 🎯 Curriculum Coverage

### **Grade 5**
- **Math:** 17 topics (Fractions, Decimals, Measurement, Geometry, etc.)
- **English:** 11 topics (Reading, Grammar, Writing, Vocabulary)
- **Science:** 7 topics (Matter, Forces, Energy, Body Systems)
- **Social Studies:** 6 topics (Geography, Early Peoples, Economics)

### **Grade 6**
- **Math:** 14 topics
- **English:** 11 topics
- **Science:** 5 topics
- **Social Studies:** 4 topics

### **Grade 7**
- **Math:** 12 topics
- **English:** 10 topics (including NEW expansions)
- **Science:** 6 topics
- **Social Studies:** 4 topics

### **Grade 8**
- **Math:** 11 topics
- **English:** 10 topics (including NEW expansions)
- **Science:** 5 topics
- **Social Studies:** 5 topics

**Total:** 100+ comprehensive topics

---

## 🤖 AI Integration

### **Demo Mode (Default)**
- Works immediately without configuration
- Template-based generation
- Realistic practice problems
- No API costs

### **Real AI Mode (Optional)**
Supports three providers:

1. **OpenAI** (GPT-4/GPT-3.5-Turbo)
2. **Anthropic** (Claude 3)
3. **Google** (Gemini Pro)

See `AI_SETUP_GUIDE.md` for configuration instructions.

---

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling (no frameworks)
- **Vanilla JavaScript** - Functionality (no dependencies)
- **LocalStorage** - Preferences & configs
- **CSS Variables** - Theming support
- **SVG** - Icons and favicon
- **Fetch API** - AI integration (optional)

**Zero dependencies!** Pure HTML/CSS/JS for fast loading and easy deployment.

---

## 🎨 Color Scheme

### Light Mode
- Primary: `#6366f1` (Indigo)
- Background: `#ffffff` (White)
- Text: `#111827` (Dark Gray)

### Dark Mode
- Primary: `#818cf8` (Light Indigo)
- Background: `#1f2937` (Dark Gray)
- Text: `#f9fafb` (Off White)

---

## 📝 Usage Examples

### **Standard Mode**
```
1. Select "Grade 5"
2. Select "Mathematics"
3. Select "Fractions"
4. Select "Complete Workbook"
5. Open "Advanced Options"
6. Check "Include Answer Keys"
7. Select "Medium" difficulty
8. Click "Generate Workbook"
```

### **Custom Mode**
```
Examples:
- "Create a Grade 7 math worksheet on solving linear equations with 6 problems"
- "Grade 6 science worksheet about ecosystems with food chain questions"
- "Grade 8 English persuasive writing worksheet with examples"
```

---

## 🐛 Troubleshooting

### **Dropdowns are disabled**
→ Select previous options first (Grade → Subject → Topic)

### **Custom worksheet not generating**
→ Using demo mode (works without API keys)

### **Can't find a topic**
→ Use search (press `/`) or check different subject

### **Print formatting issues**
→ Try "Export PDF" button for better formatting

### **Console warnings about postMessage**
→ Normal when running as `file://`, use local server for cleaner console

---

## 🚀 Deployment

### **GitHub Pages**
1. Push to GitHub repository
2. Enable Pages in repository settings
3. Select branch and root folder
4. Access via `https://username.github.io/repo-name`

### **Netlify/Vercel**
1. Connect GitHub repository
2. No build command needed
3. Publish directory: `/` (root)
4. Deploy automatically

### **Any Web Server**
Simply upload all files to your web host. No server-side processing required.

---

## 🔒 Privacy & Security

- **No data collection** - Everything runs locally in your browser
- **No cookies** - Uses only localStorage for preferences
- **No tracking** - No analytics or external requests (except optional AI)
- **API keys** - If using AI, keys stay in browser (never uploaded)

---

## 📜 License

MIT License - Feel free to use, modify, and distribute.

---

## 🙏 Credits

- **Ontario Curriculum** - Educational standards and expectations
- **Google Fonts** - Inter and Lora typefaces
- **Emoji** - Visual icons and favicon

---

## 🗺️ Roadmap

### **Completed ✅**
- [x] 100+ curriculum topics
- [x] Dark mode
- [x] AI custom worksheets
- [x] Search functionality
- [x] Keyboard shortcuts
- [x] Answer key modes
- [x] Help system
- [x] Print optimization

### **In Progress 🚧**
- [ ] Difficulty progression (generate 3 levels at once)
- [ ] Curriculum coverage tracker
- [ ] More Grade 6-8 content

### **Planned 📋**
- [ ] Export to Word (.docx)
- [ ] Visual diagrams (auto-generated)
- [ ] Progressive Web App (PWA)
- [ ] Worksheet templates
- [ ] User accounts (save history)
- [ ] Sharing worksheets via link

---

## 📧 Support

- **Help:** Press `?` or click "Help & Shortcuts" in footer
- **AI Setup:** See `AI_SETUP_GUIDE.md`
- **Debugging:** See `DEBUG_REPORT.md`

---

## ⭐ Star This Project

If you find this useful, please star the repository!

---

**Made with ❤️ for Ontario educators**
