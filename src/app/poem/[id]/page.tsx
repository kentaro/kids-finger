import { getPoem, getTotalPoems } from '@/lib/poems';
import PoemPage from '@/components/PoemPage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface GenerateMetadataProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: GenerateMetadataProps
): Promise<Metadata> {
  const id = Number.parseInt(params.id, 10);
  const poem = await getPoem(id);

  if (!poem) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: `${poem.title}`,
    description: poem.content.slice(0, 100),
  };
}

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const id = Number.parseInt(params.id, 10);
  const totalPoems = await getTotalPoems();

  if (Number.isNaN(id) || id < 1 || id > totalPoems) {
    notFound();
  }

  const poem = await getPoem(id);
  if (!poem) {
    notFound();
  }

  return <PoemPage initialPoems={[poem]} />;
}

export async function generateStaticParams() {
  const totalPoems = await getTotalPoems();
  return Array.from({ length: totalPoems }, (_, i) => ({
    id: String(i + 1),
  }));
} 