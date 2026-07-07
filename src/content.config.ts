import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const rants = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rants' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    wutlevel: z.number().min(1).max(5).default(3),
    draft: z.boolean().default(false),
  }),
});

export const collections = { rants };
