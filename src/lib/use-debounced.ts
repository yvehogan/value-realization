"use client";

import { useEffect, useState } from "react";

/** `value`, updated only after it has stopped changing for `delay` ms (e.g. search-as-you-type). */
export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
