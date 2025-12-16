"use client";

import type { Poem } from "@/lib/poems";
import { notoSerifJP } from "@/lib/fonts";
import { useSwipeIndicator, useDragScroll, useWheelScroll } from "@/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointer } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRef } from "react";
import styles from "./PoemViewer.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSwipeable } from "react-swipeable";

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
  onPageChange,
}: PoemViewerProps) {
  const params = useParams();
  const currentPage = params?.id ? Number.parseInt(params.id as string, 10) : 1;
  const contentRef = useRef<HTMLDivElement>(null);

  const { showSwipeIndicator, shouldFadeOut } = useSwipeIndicator();
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } =
    useDragScroll(contentRef);
  useWheelScroll(contentRef);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPoems;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (canGoPrev) {
        onPageChange(currentPage - 1);
      }
    },
    onSwipedRight: () => {
      if (canGoNext) {
        onPageChange(currentPage + 1);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
    delta: 10,
    swipeDuration: 500,
  });

  const handlePrevPage = () => {
    if (canGoPrev && prevPoem) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext && nextPoem) {
      onPageChange(currentPage + 1);
    }
  };

  const poemLines = poem.content.split("\n");

  return (
    <section
      className={`${styles.container} ${notoSerifJP.className}`}
      aria-label="詩の表示エリア"
    >
      <div className={styles.imageContainer} {...swipeHandlers}>
        <Image
          src={`/images/poems/${currentPage}.jpg`}
          alt={poem.title}
          fill
          className={styles.image}
          priority
        />
      </div>
      <div
        className={styles.poemContainer}
        ref={contentRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <h1 className={styles.title}>{poem.title}</h1>
        <div className={styles.content}>
          {poemLines.map((line, index) => (
            <div key={`line-${index}`} className={styles.line}>
              {line}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.pageIndicator}>
        {currentPage} / {totalPoems}
      </div>
      <div
        className={`${styles.swipeIndicator} ${shouldFadeOut ? styles.fadeOut : ""} ${!showSwipeIndicator ? styles.swipeIndicatorHidden : ""}`}
      >
        <FontAwesomeIcon icon={faHandPointer} />
      </div>
      {prevPoem && canGoPrev && (
        <button
          onClick={handlePrevPage}
          className={`${styles.navButton} ${styles.prevButton}`}
          aria-label={`前の詩：${prevPoem.title}`}
          type="button"
        />
      )}
      {nextPoem && canGoNext && (
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
