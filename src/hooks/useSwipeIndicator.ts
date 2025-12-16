import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "swipeIndicatorLastShown";
const SHOW_COUNT_KEY = "swipeIndicatorShowCount";
const MAX_SHOWS = 3;
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const FADE_OUT_DELAY_MS = 4500;

interface UseSwipeIndicatorResult {
  showSwipeIndicator: boolean;
  shouldFadeOut: boolean;
}

export function useSwipeIndicator(): UseSwipeIndicatorResult {
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth > 768 || hasRunRef.current) {
      return;
    }

    hasRunRef.current = true;

    const lastShown = localStorage.getItem(STORAGE_KEY);
    let showCount = Number.parseInt(localStorage.getItem(SHOW_COUNT_KEY) || "0", 10);

    // 最後の表示から1ヶ月経過していたらカウントをリセット
    if (lastShown) {
      const lastShownTime = Number.parseInt(lastShown, 10);
      if (Date.now() - lastShownTime > ONE_MONTH_MS) {
        showCount = 0;
        localStorage.setItem(SHOW_COUNT_KEY, "0");
      }
    }

    if (showCount < MAX_SHOWS) {
      setShowSwipeIndicator(true);
      localStorage.setItem(SHOW_COUNT_KEY, (showCount + 1).toString());
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  }, []);

  useEffect(() => {
    if (!showSwipeIndicator) return;

    setShouldFadeOut(false);
    const timer = setTimeout(() => {
      setShouldFadeOut(true);
    }, FADE_OUT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [showSwipeIndicator]);

  return { showSwipeIndicator, shouldFadeOut };
}
