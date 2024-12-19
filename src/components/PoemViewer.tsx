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
  const hasRunRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);

  const STORAGE_KEY = 'swipeIndicatorLastShown';
  const SHOW_COUNT_KEY = 'swipeIndicatorShowCount';
  const MAX_SHOWS = 3;
  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (window.innerWidth <= 768 && !hasRunRef.current) {
      hasRunRef.current = true;
      const showCount = Number.parseInt(localStorage.getItem(SHOW_COUNT_KEY) || '0', 10);
      const lastShown = localStorage.getItem(STORAGE_KEY);
      console.log('Show count:', showCount);

      // 最後の表示から1ヶ月経過していたらカウントをリセット
      if (lastShown) {
        const lastShownTime = Number.parseInt(lastShown, 10);
        if (Date.now() - lastShownTime > ONE_MONTH) {
          localStorage.setItem(SHOW_COUNT_KEY, '0');
          console.log('Reset count after one month');
        }
      }

      const currentCount = Number.parseInt(localStorage.getItem(SHOW_COUNT_KEY) || '0', 10);
      const shouldShow = currentCount < MAX_SHOWS;
      console.log('Current count after reset check:', currentCount);
      console.log('Should show:', shouldShow);

      if (shouldShow) {
        setShowSwipeIndicator(true);
        const newCount = currentCount + 1;
        console.log('New count:', newCount);
        localStorage.setItem(SHOW_COUNT_KEY, newCount.toString());
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
    }
  }, []);

  useEffect(() => {
    if (showSwipeIndicator) {
      setShouldFadeOut(false);
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showSwipeIndicator]);

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
      <div className={`${styles.swipeIndicator} ${shouldFadeOut ? styles.fadeOut : ''} ${!showSwipeIndicator ? styles.swipeIndicatorHidden : ''}`}>
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