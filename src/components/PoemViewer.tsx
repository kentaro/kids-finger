'use client';

import type { Poem } from '@/lib/poems';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './PoemViewer.module.css';
import { Noto_Serif_JP } from 'next/font/google';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export interface PoemViewerProps {
  poem: Poem;
  prevPoem: Poem | null;
  nextPoem: Poem | null;
  totalPoems: number;
  onPageChange: (page: number) => void;
}

export default function PoemViewer({ 
  poem, 
  prevPoem,
  nextPoem,
  totalPoems, 
  onPageChange 
}: PoemViewerProps) {
  const params = useParams();
  const currentPage = params?.id ? Number.parseInt(params.id as string, 10) : 1;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  const handleScroll = useCallback(() => {
    // スクロールによるページ送りを無効化
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      if (contentRef.current) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          contentRef.current.scrollTop += e.deltaY;
          return;
        }
        contentRef.current.scrollLeft += e.deltaX;
      }
    }
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (content && window.innerWidth <= 768) {
      content.addEventListener('wheel', handleWheel, { passive: false });
      return () => content.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    },
    onSwipedRight: () => {
      if (currentPage < totalPoems) {
        onPageChange(currentPage + 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
    delta: 10,
    swipeDuration: 500,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (contentRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - contentRef.current.offsetLeft);
      setScrollLeft(contentRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (contentRef.current) {
      const x = e.pageX - contentRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      contentRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && prevPoem) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPoems && nextPoem) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <section 
      className={`${styles.container} ${notoSerifJP.className}`}
      aria-label="詩の表示エリア"
    >
      <div 
        className={styles.imageContainer}
        {...swipeHandlers}
      >
        <Image
          src={`/kids-finger/images/poems/${currentPage}.jpg`}
          alt={poem.title}
          fill
          className={styles.image}
          priority
        />
      </div>
      <div 
        className={styles.poemContainer}
        ref={contentRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <h1 className={styles.title}>{poem.title}</h1>
        <div className={styles.content}>
          {poem.content.split('\n').map((line, index) => (
            <div 
              key={`${line.slice(0, 10)}-${index}`} 
              className={styles.line}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.pageIndicator}>
        {currentPage} / {totalPoems}
      </div>
      <div className={`${styles.swipeIndicator} ${shouldFadeOut ? styles.fadeOut : ''}`}>
        <i className="fa-solid fa-hand-pointer" />
      </div>
      {prevPoem && currentPage > 1 && (
        <button 
          onClick={handlePrevPage}
          className={`${styles.navButton} ${styles.prevButton}`}
          aria-label={`前の詩：${prevPoem.title}`}
          type="button"
        />
      )}
      {nextPoem && currentPage < totalPoems && (
        <button 
          onClick={handleNextPage}
          className={`${styles.navButton} ${styles.nextButton}`}
          aria-label={`次の詩：${nextPoem.title}`}
          type="button"
        />
      )}
      <Link
        href="/"
        className={`${styles.homeButton} group`}
        aria-label="トップページに戻る"
      >
        <span className="relative text-2xl text-white md:text-xl">⌂</span>
      </Link>
    </section>
  );
} 