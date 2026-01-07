import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load repository metadata
const repositoriesPath = path.join(__dirname, '../src/data/repositories.json');
const repositories = JSON.parse(fs.readFileSync(repositoriesPath, 'utf-8'));

// Directories
const analysisBaseDir = path.join(__dirname, '../../analysis/by-category');
const outputDir = path.join(__dirname, '../src/content/analyses');
const comparisonsOutputDir = path.join(__dirname, '../src/content/comparisons');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
} else {
  // Clean existing files
  const existingFiles = fs.readdirSync(outputDir);
  existingFiles.forEach(file => {
    fs.unlinkSync(path.join(outputDir, file));
  });
}

console.log('Preparing analysis content...');

repositories.forEach(repo => {
  const categoryFolder = `0${repo.categoryNumber}-${repo.category}`;
  const sourceFile = path.join(analysisBaseDir, categoryFolder, `${repo.slug}-analysis.md`);
  const destFile = path.join(outputDir, `${repo.slug}.md`);

  if (!fs.existsSync(sourceFile)) {
    console.warn(`⚠️  Warning: Analysis file not found for ${repo.slug}`);
    return;
  }

  // Read the original markdown
  let content = fs.readFileSync(sourceFile, 'utf-8');

  // Inject frontmatter
  const frontmatter = `---
repository: "${repo.name}"
category: "${repo.category}"
categoryName: "${repo.categoryName}"
techStack: "${repo.techStack}"
distributionModel: "${repo.distributionModel}"
purpose: "${repo.purpose}"
githubUrl: "${repo.githubUrl}"
---

`;

  // Rewrite relative links to GitHub URLs
  // Pattern: [text](../../../repo-name/path/to/file#L123)
  content = content.replace(
    /\[([^\]]+)\]\(\.\.\/\.\.\/\.\.\/([^\/]+)\/([^)]+)\)/g,
    (match, text, repoName, filePath) => {
      return `[${text}](${repo.githubUrl}/blob/main/${filePath})`;
    }
  );

  // Write the processed file
  const processedContent = frontmatter + content;
  fs.writeFileSync(destFile, processedContent, 'utf-8');
  console.log(`✓ Processed: ${repo.slug}`);
});

console.log(`\n✓ Successfully prepared ${repositories.length} analysis files`);

// --- Process Comparisons ---

// Create comparisons output directory
if (!fs.existsSync(comparisonsOutputDir)) {
  fs.mkdirSync(comparisonsOutputDir, { recursive: true });
} else {
  // Clean existing files
  const existingFiles = fs.readdirSync(comparisonsOutputDir);
  existingFiles.forEach(file => {
    fs.unlinkSync(path.join(comparisonsOutputDir, file));
  });
}

console.log('\nPreparing comparison content...');

// Group repositories by category
const categoriesMap = new Map();
repositories.forEach(repo => {
  if (!categoriesMap.has(repo.category)) {
    categoriesMap.set(repo.category, {
      categoryNumber: repo.categoryNumber,
      categoryName: repo.categoryName,
      techStack: repo.techStack,
      repositories: []
    });
  }
  categoriesMap.get(repo.category).repositories.push(repo.name);
});

// Comparison file types to process
const comparisonTypes = [
  { filename: 'comparative-analysis.md', type: 'comparative-analysis', titleSuffix: 'Comparative Analysis' },
  { filename: 'github-workflows-comparison-report.md', type: 'github-workflows-comparison', titleSuffix: 'GitHub Workflows Comparison' }
];

let comparisonCount = 0;

categoriesMap.forEach((categoryInfo, category) => {
  const categoryFolder = `0${categoryInfo.categoryNumber}-${category}`;
  const categoryPath = path.join(analysisBaseDir, categoryFolder);

  comparisonTypes.forEach(({ filename, type, titleSuffix }) => {
    const sourceFile = path.join(categoryPath, filename);

    if (!fs.existsSync(sourceFile)) {
      return; // Skip if file doesn't exist
    }

    // Read the original markdown
    let content = fs.readFileSync(sourceFile, 'utf-8');

    // Generate output filename
    const outputFilename = `${category}-${type}.md`;
    const destFile = path.join(comparisonsOutputDir, outputFilename);

    // Create frontmatter
    const frontmatter = `---
title: "${categoryInfo.categoryName} ${titleSuffix}"
category: "${category}"
categoryName: "${categoryInfo.categoryName}"
techStack: "${categoryInfo.techStack}"
type: "${type}"
description: "${type === 'comparative-analysis'
  ? `Comparative analysis of ${categoryInfo.categoryName.toLowerCase()} repositories`
  : `GitHub workflows comparison across ${categoryInfo.categoryName.toLowerCase()} repositories`}"
repositories: ${JSON.stringify(categoryInfo.repositories)}
---

`;

    // Write the processed file
    const processedContent = frontmatter + content;
    fs.writeFileSync(destFile, processedContent, 'utf-8');
    console.log(`✓ Processed comparison: ${outputFilename}`);
    comparisonCount++;
  });
});

console.log(`\n✓ Successfully prepared ${comparisonCount} comparison files`);
