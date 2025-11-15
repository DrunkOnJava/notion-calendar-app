# Contributing to Notion Calendar

Thank you for your interest in contributing! We welcome contributions from everyone.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/notion-calendar.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit with a descriptive message
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm type-check
```

## Code Style

- Use TypeScript with strict typing
- Follow the existing code style
- Use functional components with hooks
- Write meaningful variable and function names
- Add comments for complex logic only
- Format code with Prettier (auto-formats on save in VS Code)
- Fix ESLint errors before committing

## Commit Message Guidelines

We follow conventional commit format:

```
<type>: <description>

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat: add recurring event support
fix: resolve date picker timezone issue
docs: update README installation steps
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Make sure code is properly formatted and linted
4. Update the README.md if you add new features
5. Your PR will be reviewed by maintainers
6. Address any feedback or requested changes
7. Once approved, your PR will be merged

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and version information

## Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml) and include:

- Problem you're trying to solve
- Proposed solution
- Alternative solutions considered
- Any relevant examples or mockups

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

Thank you for contributing! 🎉
