import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export interface Poem {
  id: string;
  title: string;
  content: string;
  image: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop';

export function getAllPoems(): Poem[] {
  try {
    const poemsDirectory = join(process.cwd(), 'content/poems');
    console.log('Reading poems from directory:', poemsDirectory);
    
    const filenames = readdirSync(poemsDirectory);
    console.log('Found files:', filenames);
    
    return filenames
      .filter(filename => filename.endsWith('.md'))
      .map(filename => {
        const filePath = join(poemsDirectory, filename);
        const fileContents = readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        
        const poem = {
          id: filename.replace('.md', ''),
          title: data.title || '無題',
          content: content.trim(),
          image: data.image || FALLBACK_IMAGE,
        };
        console.log('Parsed poem:', poem);
        return poem;
      })
      .sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error('Error loading poems:', error);
    return [];
  }
}

export function getPoemById(id: string): Poem | undefined {
  try {
    console.log('Looking for poem with id:', id);
    const poems = getAllPoems();
    console.log('Available poems:', poems.map(p => ({ id: p.id, title: p.title })));
    const poem = poems.find(poem => poem.id === id);
    console.log('Found poem:', poem);
    return poem;
  } catch (error) {
    console.error('Error getting poem by id:', error);
    return undefined;
  }
} 