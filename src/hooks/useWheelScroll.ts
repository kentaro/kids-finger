import { useEffect, useCallback, type RefObject } from "react";

export function useWheelScroll(
  contentRef: RefObject<HTMLDivElement | null>
): void {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (typeof window === "undefined" || window.innerWidth > 768) return;

      e.preventDefault();
      if (!contentRef.current) return;

      // 縦方向のスクロールが優先
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        contentRef.current.scrollTop += e.deltaY;
      } else {
        contentRef.current.scrollLeft += e.deltaX;
      }
    },
    [contentRef]
  );

  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof window === "undefined" || window.innerWidth > 768) {
      return;
    }

    content.addEventListener("wheel", handleWheel, { passive: false });
    return () => content.removeEventListener("wheel", handleWheel);
  }, [contentRef, handleWheel]);
}
