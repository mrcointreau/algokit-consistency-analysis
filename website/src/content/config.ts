import { defineCollection, z } from 'astro:content';

const analysesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    repository: z.string(),
    category: z.string(),
    categoryName: z.string(),
    techStack: z.enum(['Python', 'TypeScript']),
    distributionModel: z.string(),
    purpose: z.string(),
    githubUrl: z.string().url(),
  }),
});

const comparisonsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    categoryName: z.string(),
    techStack: z.enum(['Python', 'TypeScript']),
    type: z.enum(['comparative-analysis', 'github-workflows-comparison']),
    description: z.string(),
    repositories: z.array(z.string()),
  }),
});

export const collections = {
  analyses: analysesCollection,
  comparisons: comparisonsCollection,
};
