import { useState, useCallback, type RefObject, type MouseEvent } from "react";

interface DragState {
  isDragging: boolean;
  startX: number;
  scrollLeft: number;
}

interface UseDragScrollResult {
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
}

export function useDragScroll(
  contentRef: RefObject<HTMLDivElement | null>
): UseDragScrollResult {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!contentRef.current) return;
      setDragState({
        isDragging: true,
        startX: e.pageX - contentRef.current.offsetLeft,
        scrollLeft: contentRef.current.scrollLeft,
      });
    },
    [contentRef]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !contentRef.current) return;
      e.preventDefault();
      const x = e.pageX - contentRef.current.offsetLeft;
      const walk = (x - dragState.startX) * 2;
      contentRef.current.scrollLeft = dragState.scrollLeft - walk;
    },
    [contentRef, dragState]
  );

  const handleMouseUp = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}
