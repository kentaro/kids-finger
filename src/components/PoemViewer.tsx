'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useRouter } from 'next/navigation';

interface Poem {
  id: string;
  title: string;
  content: string;
  image: string;
}

interface PoemViewerProps {
  poems: Poem[];
  initialPage: number;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop';

export default function PoemViewer({ poems, initialPage }: PoemViewerProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (newPage: number) => {
    if (newPage === 1) {
      router.push('/');
    } else {
      router.push(`/poem/${newPage}`);
    }
    setCurrentPage(newPage);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < poems.length) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
  });

  const currentPoem = poems[currentPage - 1];

  return (
    <div 
      {...handlers}
      className="w-full h-screen flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <div className="relative aspect-[3/2] w-full mb-8">
          <Image
            src={currentPoem.image || FALLBACK_IMAGE}
            alt={currentPoem.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            priority
            className="object-cover rounded-lg"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{currentPoem.title}</h2>
          <div className="whitespace-pre-wrap font-serif text-lg">
            {currentPoem.content}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            前のページ
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === poems.length}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            次のページ
          </button>
        </div>
      </div>
    </div>
  );
} 