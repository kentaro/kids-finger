'use client';

import type { Poem } from '@/lib/poems';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const PoemViewer = dynamic(() => import('@/components/PoemViewer'), { ssr: false });

export default function PoemPage({ initialPoems }: { initialPoems: Poem[] }) {
  const params = useParams();
  const [poems] = useState<Poem[]>(initialPoems);
  const page = params?.id ? Number.parseInt(params.id as string, 10) : 1;

  // ページ番号が不正な場合は最初のページにリダイレクト
  if (Number.isNaN(page) || page < 1 || page > poems.length) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-screen">
      <PoemViewer poems={poems} initialPage={page} />
    </div>
  );
} 