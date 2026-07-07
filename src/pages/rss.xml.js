import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const rants = await getCollection('rants', ({ data }) => !data.draft);
  const sorted = rants.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const site = new URL(import.meta.env.BASE_URL, context.site);

  return rss({
    title: 'RSR — Random Swiss Rants',
    description: 'Ein Ventil für 15 Jahre Schweizer Absurditäten, gesehen aus deutschen Augen.',
    site,
    items: sorted.map((rant) => ({
      title: rant.data.title,
      description: rant.data.excerpt,
      pubDate: rant.data.date,
      link: `rants/${rant.id}/`,
      categories: rant.data.tags,
    })),
  });
}
