# AlgoKit Analysis Website

This is an Astro-powered static website that displays analysis results for 17 AlgoKit repositories.

## Features

- **Homepage**: Overview with statistics and key findings
- **Browse by Category**: 9 categories organized by repo type and distribution model
- **Browse by Tech Stack**: Filter by Python or TypeScript
- **Repository Pages**: Full analysis reports for each repository
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS

## Local Development

### Prerequisites

- Node.js 20 or later
- npm

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The site will be available at `http://localhost:4321/`

**Note:** The development server uses the root path `/` for simplicity. The base path `/algokit-consistency-analysis` is only applied for production builds deployed to GitHub Pages.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
website/
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── layout/       # Layout components (Header, Footer, Layout)
│   │   └── cards/        # Card components (CategoryCard, RepositoryCard)
│   ├── content/          # Content collections
│   │   ├── config.ts     # Collection schemas
│   │   └── analyses/     # Generated analysis Markdown files (gitignored)
│   ├── data/             # Static data files
│   │   ├── repositories.json   # Repository metadata
│   │   └── categories.json     # Category definitions
│   ├── pages/            # Page routes
│   │   ├── index.astro                   # Homepage
│   │   ├── categories/                   # Category pages
│   │   ├── tech-stack/                   # Tech stack pages
│   │   └── repositories/[slug].astro     # Dynamic repository pages
│   └── styles/           # Global styles
├── scripts/
│   └── prepare-content.js    # Build script to process analysis files
├── astro.config.mjs          # Astro configuration
├── tailwind.config.mjs       # Tailwind CSS configuration
└── package.json
```

## How It Works

1. **Build Script**: The `prepare-content.js` script runs before each build to:
   - Copy analysis Markdown files from `/analysis/by-category/`
   - Inject frontmatter with repository metadata
   - Rewrite relative links to GitHub URLs
   - Save processed files to `src/content/analyses/`

2. **Content Collections**: Astro content collections provide type-safe access to analysis files

3. **Dynamic Routes**: Repository pages are generated at build time using `getStaticPaths()`

4. **Static Output**: The entire site is pre-rendered to static HTML for deployment

## Adding New Analyses

1. Add new analysis Markdown file to `/analysis/by-category/XX-category-name/`
2. Update `src/data/repositories.json` with repository metadata
3. Update `src/data/categories.json` if adding a new category
4. Build the site - new pages are automatically generated

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

The deployment workflow (`.github/workflows/deploy-website.yaml`) handles:
- Building the site
- Uploading the build artifact
- Deploying to GitHub Pages

### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to GitHub Pages (requires proper permissions)
# The workflow handles this automatically
```

## Technologies

- **Astro**: Static site generator
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Remark GFM**: GitHub Flavored Markdown support
- **GitHub Pages**: Free static site hosting

## Configuration

### Site URL

The site URL is configured in `astro.config.mjs`:

```javascript
{
  site: 'https://mrcointreau.github.io',
  base: isDev ? '/' : '/algokit-consistency-analysis',
}
```

The base path is environment-aware:
- **Development** (`npm run dev`): Uses `/` for local testing at `http://localhost:4321/`
- **Production** (`npm run build`): Uses `/algokit-consistency-analysis` for GitHub Pages deployment

Update these values if deploying to a different URL.

### Styling

Tailwind configuration is in `tailwind.config.mjs`. AlgoKit brand colors are defined:

```javascript
{
  colors: {
    'algo-primary': '#00D2B8',
    'algo-secondary': '#0081C9',
  }
}
```

## License

Part of the AlgoKit consistency analysis project.
