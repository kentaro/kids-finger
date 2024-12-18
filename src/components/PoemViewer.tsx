'use client';

import type { Poem } from '@/lib/poems';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { TouchEvent } from 'react';
import styles from './PoemViewer.module.css';
import { Noto_Serif_JP } from 'next/font/google';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export interface PoemViewerProps {
  poem: Poem;
  initialPage: number;
  totalPoems: number;
  onPageChange: (page: number) => void;
}

export default function PoemViewer({ poem, initialPage, totalPoems, onPageChange }: PoemViewerProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showNavButtons, setShowNavButtons] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hideScrollIndicator, setHideScrollIndicator] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentPage > 1) {
        onPageChange(currentPage - 1);
        router.push(`/poem/${currentPage - 1}`);
      } else if (e.key === 'ArrowLeft' && currentPage < totalPoems) {
        onPageChange(currentPage + 1);
        router.push(`/poem/${currentPage + 1}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPoems, router, onPageChange]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // コンテンツが横スクロール可能で、まだ最後まで到達していない場合は
    // ページ送りを行わない
    if (contentRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = contentRef.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      if (!isAtEnd && scrollWidth > clientWidth) return;
    }

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage > 1) {
        // 左スワイプ → 前のページ
        onPageChange(currentPage - 1);
        router.push(`/poem/${currentPage - 1}`);
      } else if (diff < 0 && currentPage < totalPoems) {
        // 右スワイプ → 次のページ
        onPageChange(currentPage + 1);
        router.push(`/poem/${currentPage + 1}`);
      }
    }
    setTouchStart(null);
  };

  const handlePrevPage = () => {
    if (currentPage < totalPoems) {
      onPageChange(currentPage + 1);
      router.push(`/poem/${currentPage + 1}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      router.push(`/poem/${currentPage - 1}`);
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setHideScrollIndicator(true);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (contentRef.current) {
      contentRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener('wheel', handleWheel, { passive: false });
      return () => content.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideScrollIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <section 
      className={`${styles.container} ${notoSerifJP.className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="詩の表示エリア"
    >
      <div className={styles.imageContainer}>
        <Image
          src={`/kids-finger/images/poems/${currentPage}.jpg`}
          alt={poem.title || ''}
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
      <>
        {currentPage < totalPoems && (
          <button 
            onClick={handlePrevPage}
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="前のページ"
            type="button"
          />
        )}
        {currentPage > 1 && (
          <button 
            onClick={handleNextPage}
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="次のページ"
            type="button"
          />
        )}
      </>
    </section>
  );
} 