// src/app/providers.tsx
"use client";

import React from 'react';

// This component can be used to wrap your application with any client-side context providers.
// For now, it's a simple wrapper but can be extended (e.g., with ThemeProvider, AuthProvider, etc.)

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
