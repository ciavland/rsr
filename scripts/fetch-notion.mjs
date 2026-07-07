import { Client } from '@notionhq/client';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/rants');

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error('Missing NOTION_TOKEN or NOTION_DATABASE_ID environment variable.');
  console.error('See README.md for how to set up the Notion integration.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function plainText(richTextArray) {
  return (richTextArray ?? []).map((t) => t.plain_text).join('');
}

function yamlString(value) {
  return JSON.stringify(value ?? '');
}

async function resolveDataSourceId(databaseId) {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  const dataSource = database.data_sources?.[0];
  if (!dataSource) {
    throw new Error(`No data source found on database ${databaseId}`);
  }
  return dataSource.id;
}

async function queryPublishedPages(dataSourceId) {
  const pages = [];
  let cursor;
  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      filter: { property: 'Status', select: { equals: 'Published' } },
    });
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function main() {
  const dataSourceId = await resolveDataSourceId(NOTION_DATABASE_ID);
  const pages = await queryPublishedPages(dataSourceId);

  console.log(`Found ${pages.length} published rant(s) in Notion.`);

  rmSync(OUTPUT_DIR, { recursive: true, force: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const page of pages) {
    const props = page.properties;
    const title = plainText(props.Title?.title) || 'Untitled';
    const slug = plainText(props.Slug?.rich_text) || slugify(title);
    const date = props.Date?.date?.start ?? new Date().toISOString().slice(0, 10);
    const excerpt = plainText(props.Excerpt?.rich_text);
    const tags = (props.Tags?.multi_select ?? []).map((t) => t.name);
    const wutlevel = props.Wutlevel?.number ?? 3;

    const { markdown } = await notion.pages.retrieveMarkdown({ page_id: page.id });

    const frontmatter = [
      '---',
      `title: ${yamlString(title)}`,
      `date: ${date}`,
      `excerpt: ${yamlString(excerpt)}`,
      `tags: ${JSON.stringify(tags)}`,
      `wutlevel: ${wutlevel}`,
      'draft: false',
      '---',
      '',
    ].join('\n');

    writeFileSync(path.join(OUTPUT_DIR, `${slug}.md`), frontmatter + markdown.trim() + '\n');
    console.log(`Wrote ${slug}.md`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
