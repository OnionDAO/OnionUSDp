// Polyfills for Solana libraries - must be imported first
import { Buffer } from 'buffer';
import process from 'process';

// Make Buffer and process available globally immediately
if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).Buffer = Buffer;
  (window as any).process = process;
  
  // Ensure Buffer is available on the global object as well
  if (!(window as any).global.Buffer) {
    (window as any).global.Buffer = Buffer;
  }
}

// Also make it available on globalThis for broader compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).process = process;
  (globalThis as any).global = globalThis;
}

// Set up additional Node.js-like environment
if (typeof window !== 'undefined') {
  // Ensure crypto is available
  if (!window.crypto) {
    (window as any).crypto = globalThis.crypto;
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
