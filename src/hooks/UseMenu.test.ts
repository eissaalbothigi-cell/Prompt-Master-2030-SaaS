// src/hooks/useToggle.ts
'use client';

import { useState } from 'react';

export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = () => setState((prev) => !prev);
  const open = () => setState(true);
  const close = () => setState(false);

  return { state, toggle, open, close };
}