// src/hooks/useToggle.ts
'use client';

import { useState, useCallback } from 'react';

/**
 * هوك عام لإدارة الحالات الثنائية (فتح/غلق، ظهور/اختفاء)
 * @param initialState - الحالة الابتدائية (افتراضي: false)
 * @returns كائن يحتوي على: state, toggle, open, close, set
 */
export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState((prev) => !prev), []);
  const open = useCallback(() => setState(true), []);
  const close = useCallback(() => setState(false), []);

  return { state, toggle, open, close, setState };
}