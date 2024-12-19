import { getPoem, getTotalPoems } from '@/lib/poems';
import PoemPage from '@/components/PoemPage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { id: string } }
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

export default async function Page({ 
  params,
}: { 
  params: { id: string } 
}) {
  const id = Number.parseInt(params.id, 10);
  const totalPoems = await getTotalPoems();

  if (Number.isNaN(id) || id < 1 || id > totalPoems) {
    notFound();
  }

  const currentPoem = await getPoem(id);
  if (!currentPoem) {
    notFound();
  }

  const prevId = id > 1 ? id - 1 : null;
  const nextId = id < totalPoems ? id + 1 : null;

  const [prevPoem, nextPoem] = await Promise.all([
    prevId ? getPoem(prevId) : null,
    nextId ? getPoem(nextId) : null,
  ]);

  return (
    <PoemPage 
      currentPoem={currentPoem}
      prevPoem={prevPoem}
      nextPoem={nextPoem}
      totalPoems={totalPoems}
    />
  );
}

export async function generateStaticParams() {
  const totalPoems = await getTotalPoems();
  return Array.from({ length: totalPoems }, (_, i) => ({
    id: String(i + 1),
  }));
} 