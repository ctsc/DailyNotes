# Carter's Personal Notes

A beautiful, feature-rich desktop notes and task management application built with Electron, React, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- 📝 **Rich Note Taking** - Markdown support with live preview
- ✅ **Task Management** - Priority levels, drag-and-drop, completion tracking
- 🎯 **Goals Tracking** - Weekly and monthly goals with progress visualization
- 📅 **Multiple Calendar Views** - Weekly, monthly, and yearly perspectives
- 🔍 **Powerful Search** - Find notes and tasks instantly
- 🌓 **Light/Dark Mode** - Automatic theme detection with manual override
- 📊 **Analytics Dashboard** - Productivity trends and statistics
- 💾 **Local Storage** - All data stored securely on your machine
- 🔐 **Privacy First** - No cloud, no tracking, no external services
- ⌨️ **Keyboard Shortcuts** - Fast navigation for power users
- 📤 **Import/Export** - Backup and restore your data easily

## Screenshots

<img width="1690" height="921" alt="image" src="https://github.com/user-attachments/assets/7e722a0e-d443-4561-8f35-54c031a982bb" />

<img width="1652" height="918" alt="image" src="https://github.com/user-attachments/assets/51a699b3-64b8-410e-837c-3c0bbe58cfe7" />

<img width="1683" height="892" alt="image" src="https://github.com/user-attachments/assets/0bec8ae1-e2f1-47ac-9c29-230865492820" />



## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning)

## Installation

### Option 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ctsc/carters-personal-notes.git

# Navigate to the project directory
cd carters-personal-notes

# Install dependencies
npm install
```

### Option 2: Download and Extract

1. Download the repository as a ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder
4. Run `npm install`

## Project Structure

Create the following directory structure:

```
carters-personal-notes/
├── public/
│   ├── electron.js
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── WeeklyView.jsx
│   │   ├── DailyView.jsx
│   │   ├── MonthlyCalendar.jsx
│   │   ├── YearlyCalendar.jsx
│   │   ├── Archive.jsx
│   │   └── Settings.jsx
│   ├── utils/
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── index.jsx
├── assets/
│   ├── icon.png
│   ├── icon.ico
│   └── icon.icns
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
```
## Development

### Running in Development Mode

```bash
# Start React development server and Electron
npm start
```

This will:
1. Start the React development server on `http://localhost:3000`
2. Launch the Electron application
3. Enable hot-reloading for instant updates

### Building for Production

#### Build for Current Platform

```bash
# Build for your current operating system
npm run build
npm run electron-pack
```

#### Build for Specific Platforms

```bash
# Build for Windows
npm run electron-pack:win

# Build for macOS
npm run electron-pack:mac

# Build for Linux
npm run electron-pack:linux

# Build for all platforms
npm run electron-pack:all
```

The built applications will be in the `dist/` folder.

## Configuration

### package.json Setup

Ensure your `package.json` includes:

```json
{
  "name": "carters-personal-notes",
  "version": "1.0.0",
  "main": "public/electron.js",
  "homepage": "./",
  "scripts": {
    "start": "concurrently \"npm run react-start\" \"wait-on http://localhost:3000 && electron .\"",
    "react-start": "react-scripts start",
    "build": "react-scripts build",
    "electron-pack": "electron-builder",
    "electron-pack:win": "electron-builder --win",
    "electron-pack:mac": "electron-builder --mac",
    "electron-pack:linux": "electron-builder --linux",
    "electron-pack:all": "electron-builder -mwl"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "electron-store": "^8.1.0"
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.4",
    "concurrently": "^8.2.0",
    "wait-on": "^7.0.1",
    "react-scripts": "^5.0.1",
    "tailwindcss": "^3.3.3",
    "autoprefixer": "^10.4.15",
    "postcss": "^8.4.29"
  },
  "build": {
    "appId": "com.carter.personalnotes",
    "productName": "Carter's Personal Notes",
    "files": [
      "build/**/*",
      "node_modules/**/*",
      "public/electron.js"
    ],
    "directories": {
      "buildResources": "assets"
    },
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon.png"
    }
  }
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New task |
| `Ctrl/Cmd + F` | Search |
| `Ctrl/Cmd + ,` | Settings |
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + D` | Toggle dark mode |
| `Ctrl/Cmd + W` | Close window |
| `Ctrl/Cmd + Q` | Quit application |
| `Escape` | Close dialogs/modals |
| `Arrow Keys` | Navigate between days |

## Data Storage

- All data is stored locally in JSON files
- Default location:
  - **Windows**: `%APPDATA%/carters-personal-notes/`
  - **macOS**: `~/Library/Application Support/carters-personal-notes/`
  - **Linux**: `~/.config/carters-personal-notes/`

### Data Files

- `notes.json` - All notes and entries
- `tasks.json` - Task data
- `goals.json` - Goals tracking
- `settings.json` - User preferences
- `backup/` - Automatic daily backups

## Troubleshooting

### Application Won't Start

1. Delete `node_modules` folder
2. Run `npm install` again
3. Try `npm start`

### Build Fails

1. Ensure all dependencies are installed: `npm install`
2. Clear cache: `npm cache clean --force`
3. Try building again

### Data Not Saving

1. Check file permissions in the data directory
2. Ensure you have write access
3. Check console for error messages

### Dark Mode Issues

1. Go to Settings
2. Toggle theme manually
3. Restart the application

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        // Add custom colors
      }
    }
  }
}
```

### Modifying Data Location

In `src/utils/storage.js`, update the storage path configuration.

### Custom Icon

Replace files in `assets/` folder:
- `icon.ico` - Windows icon (256x256)
- `icon.icns` - macOS icon
- `icon.png` - Linux icon (512x512)

## System Requirements

### Minimum

- OS: Windows 10, macOS 10.13, Ubuntu 18.04 or equivalent
- RAM: 2GB
- Storage: 100MB free space
- Screen: 1280x720 resolution

### Recommended

- OS: Latest version of Windows 10/11, macOS 11+, Ubuntu 20.04+
- RAM: 4GB+
- Storage: 500MB free space
- Screen: 1920x1080 or higher

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: cartertierney0@gmail.com

## Future Roadmap 

- [ ] Cloud sync 
- [ ] Mobile companion app
- [ ] Collaborative notes
- [ ] Plugin system
- [ ] Custom themes
- [ ] Voice notes
- [ ] Attachments support

---

**Made with ❤️ by Carter**

Version 1.3.0 | Last Updated: October 2025
