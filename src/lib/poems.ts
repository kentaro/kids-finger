import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface Poem {
	title: string;
	content: string;
}

const POEMS_DIRECTORY = path.join(process.cwd(), "content/poems");

export async function getAllPoems(): Promise<Poem[]> {
	const fileNames = fs.readdirSync(POEMS_DIRECTORY);
	const poems = fileNames
		.filter((fileName) => fileName.endsWith(".md"))
		.map((fileName) => {
			const fullPath = path.join(POEMS_DIRECTORY, fileName);
			const fileContents = fs.readFileSync(fullPath, "utf8");
			const { data, content } = matter(fileContents);

			return {
				title: data.title || "",
				content: content,
			};
		});

	return poems;
}

export async function getPoem(id: number): Promise<Poem | null> {
	try {
		const fileName = `${String(id).padStart(3, "0")}.md`;
		const fullPath = path.join(POEMS_DIRECTORY, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf8");
		const { data, content } = matter(fileContents);

		return {
			title: data.title || "",
			content: content,
		};
	} catch {
		return null;
	}
}

export async function getTotalPoems(): Promise<number> {
	const fileNames = fs.readdirSync(POEMS_DIRECTORY);
	return fileNames.filter((fileName) => fileName.endsWith(".md")).length;
}
