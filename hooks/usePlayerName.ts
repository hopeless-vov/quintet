'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'seq:name';

export function usePlayerName() {
  const [name, setNameState] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY) ?? '';
  });

  const setName = useCallback((value: string) => {
    setNameState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  return { name, setName };
}
