import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface Poem {
  id: string;
  title: string;
  content: string;
  image: string;
}

export async function getAllPoems(): Promise<Poem[]> {
  const poemsDirectory = join(process.cwd(), 'content/poems');
  const filenames = readdirSync(poemsDirectory);
  
  const poems = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = join(poemsDirectory, filename);
      const fileContents = readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        id: data.id,
        title: data.title,
        content: content.trim(),
        image: data.image,
      } as Poem;
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  return poems;
}

export async function getPoemById(id: string): Promise<Poem | undefined> {
  const poems = await getAllPoems();
  return poems.find(poem => poem.id === id);
} 