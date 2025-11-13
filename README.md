# Notion Calendar

A modern, feature-rich calendar application built with Next.js 16, React 19, and TypeScript.

## 🚀 Features

- **Multiple Calendar Views** - Day, Week, Month, and Agenda views
- **Event Management** - Create, edit, and delete events with drag-and-drop support
- **Recurring Events** - Support for complex recurrence patterns
- **Database Views** - Table and Board views for event management
- **Scheduling Links** - Share availability and let others book time
- **Time Finding** - Smart suggestions to find meeting times
- **Import/Export** - Support for calendar data import and export
- **Multi-calendar Support** - Manage multiple calendars with different colors
- **Search & Command Palette** - Quick access to all features
- **Notifications** - Stay updated with event reminders
- **Dark Mode** - Beautiful dark and light themes
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Date Management:** [date-fns](https://date-fns.org/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/notion-calendar.git
cd notion-calendar

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧑‍💻 Development

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm type-check # Run TypeScript type checking
```

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/              # Static assets
```

### VS Code Setup

This project includes VS Code workspace configuration with:
- Auto-formatting on save
- ESLint auto-fix
- TypeScript auto-imports
- Tailwind CSS IntelliSense
- GitHub Copilot optimizations
- Debug configurations

See `.vscode/README.md` for details.

## 🎨 Component Library

Built with [shadcn/ui](https://ui.shadcn.com/) for a consistent, accessible component system:
- Buttons, Cards, Dialogs
- Forms with validation
- Date pickers and calendars
- Popovers, tooltips, dropdowns
- And much more...

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components
- [Vercel](https://vercel.com) for hosting and deployment platform

---

Built with ❤️ using Next.js and TypeScript
