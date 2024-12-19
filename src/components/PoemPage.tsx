'use client';

import type { Poem } from '@/lib/poems';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

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
  const [isPending, startTransition] = useTransition();

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPoems && !isPending) {
      startTransition(() => {
        router.push(`/poem/${page}`, { scroll: false });
      });
    }
  }, [router, totalPoems, isPending]);

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