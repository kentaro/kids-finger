'use client';

import type { Poem } from '@/lib/poems';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const PoemViewer = dynamic(() => import('@/components/PoemViewer'), { ssr: false });

export default function PoemPage({ initialPoems }: { initialPoems: Poem[] }) {
  const params = useParams();
  const router = useRouter();
  const [poems] = useState<Poem[]>(initialPoems);
  const [currentPage, setCurrentPage] = useState<number>(
    params?.id ? Number.parseInt(params.id as string, 10) : 1
  );

  useEffect(() => {
    const newPage = params?.id ? Number.parseInt(params.id as string, 10) : 1;
    if (!Number.isNaN(newPage) && newPage >= 1 && newPage <= poems.length) {
      setCurrentPage(newPage);
    } else {
      router.push('/');
    }
  }, [params?.id, poems.length, router]);

  useEffect(() => {
    const currentPoem = poems[currentPage - 1];
    if (!currentPoem) {
      router.push('/');
    }
  }, [currentPage, poems, router]);

  if (!currentPage) {
    return null;
  }

  const currentPoem = poems[currentPage - 1];
  if (!currentPoem) {
    return null;
  }
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= poems.length) {
      setCurrentPage(page);
      router.push(`/poem/${page}`);
    }
  };

  return (
    <div className="min-h-screen">
      <PoemViewer 
        poem={currentPoem} 
        initialPage={currentPage} 
        totalPoems={poems.length}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 