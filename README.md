# 🎯 SolveStack

**A modern task management app that helps you focus on what matters**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://react.dev/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📖 About

SolveStack is a productivity application that combines task management with a Pomodoro-style timer. It uses a **stack-based approach** where you focus on the top task, complete it, and move to the next.

### ✨ Features

- 🎯 **Focus-First Design**: Work on one task at a time with a distraction-free interface
- ⏱️ **Built-in Timer**: Pomodoro-style timer for each task to maintain focus
- 📝 **Drag & Drop**: Easily reorder tasks by dragging them
- 💾 **Auto-Save**: Your tasks are automatically saved in browser storage
- 📱 **Responsive**: Works beautifully on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface built with React and Tailwind CSS

## 🎬 Demo

Try the app live: [SolveStack Demo](https://devonepao.github.io/solvestack/)

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/devonepao/solvestack.git
   cd solvestack
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the app running!

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory. You can preview the production build with:

```bash
npm run preview
```

## 🎮 Usage

### Adding Tasks

1. Enter a task title in the input field
2. Set the duration (in minutes) for the task
3. Click the **+** button to add it to your stack

### Managing Your Stack

- **Start/Pause Timer**: Click the play/pause button on the active task
- **Reset Timer**: Click the reset button to restart the current task timer
- **Complete Task**: Click the checkmark to mark the current task as complete
- **Edit Task**: Click on the task title or duration to edit inline
- **Reorder Tasks**: Drag and drop tasks to change their priority
- **Delete Task**: Click the trash icon to remove a task
- **Focus on a Task**: Click on any task to bring it to the top of the stack

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/) 19
- **Build Tool**: [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser LocalStorage

## 📁 Project Structure

```
solvestack/
├── components/          # React components
│   ├── Footer.tsx      # Footer component
│   ├── StackLayer.tsx  # Individual task card
│   └── TimerDisplay.tsx # Timer UI component
├── services/           # Service layer
│   └── storage.ts      # LocalStorage utilities
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
├── types.ts           # TypeScript type definitions
├── index.html         # HTML template
├── index.css          # Global styles
└── vite.config.ts     # Vite configuration
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

### Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/devonepao/solvestack/issues)!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vite.dev/)
- Icons from [Lucide](https://lucide.dev/)
- UI styling with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

Created by [@devonepao](https://github.com/devonepao)

---

<div align="center">

**If you find this project useful, please consider giving it a ⭐!**

[Report Bug](https://github.com/devonepao/solvestack/issues) • [Request Feature](https://github.com/devonepao/solvestack/issues)

</div>

