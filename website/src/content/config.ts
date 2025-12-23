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

export const collections = {
  analyses: analysesCollection,
};
