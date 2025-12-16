import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export interface Poem {
  title: string;
  content: string;
}

const POEMS_DIRECTORY = path.join(process.cwd(), "content/poems");

export async function getAllPoems(): Promise<Poem[]> {
  const fileNames = await fs.readdir(POEMS_DIRECTORY);
  const mdFiles = fileNames.filter((fileName) => fileName.endsWith(".md")).sort();

  const poems = await Promise.all(
    mdFiles.map(async (fileName) => {
      const fullPath = path.join(POEMS_DIRECTORY, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        title: (data.title as string) || "",
        content,
      };
    })
  );

  return poems;
}

export async function getPoem(id: number): Promise<Poem | null> {
  try {
    const fileName = `${String(id).padStart(3, "0")}.md`;
    const fullPath = path.join(POEMS_DIRECTORY, fileName);
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      title: (data.title as string) || "",
      content,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    console.error(`Failed to read poem ${id}:`, error);
    return null;
  }
}

export async function getTotalPoems(): Promise<number> {
  const fileNames = await fs.readdir(POEMS_DIRECTORY);
  return fileNames.filter((fileName) => fileName.endsWith(".md")).length;
}
