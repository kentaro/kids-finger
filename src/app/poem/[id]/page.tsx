import { getAllPoems, getPoem, getTotalPoems } from '@/lib/poems';
import PoemPage from '@/components/PoemPage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageParams {
  id: string;
}

interface Props {
  params: PageParams;
}

export default async function Page({ params }: Props) {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const poems = await getAllPoems();
  const page = Number.parseInt(params.id, 10);
  const poem = poems[page - 1];

  return {
    title: `${poem.title} - Web詩集`,
    description: poem.title,
  };
} 