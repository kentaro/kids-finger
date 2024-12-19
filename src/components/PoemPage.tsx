'use client';

import type { Poem } from '@/lib/poems';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const PoemViewer = dynamic(() => import('@/components/PoemViewer'), { ssr: false });

interface PoemPageProps {
  currentPoem: Poem;
  prevPoem: Poem | null;
  nextPoem: Poem | null;
  totalPoems: number;
}

export default function PoemPage({ 
  currentPoem,
  prevPoem,
  nextPoem,
  totalPoems 
}: PoemPageProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPoems) {
      router.push(`/poem/${page}`);
    }
  };

  return (
    <div className="min-h-screen">
      <PoemViewer 
        poem={currentPoem}
        prevPoem={prevPoem}
        nextPoem={nextPoem}
        totalPoems={totalPoems}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 