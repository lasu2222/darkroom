import { createRoot } from "react-dom/client";
import { Workbox } from "workbox-window";
import App from "./App";
import "./index.css";

// Register service worker
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');

  wb.addEventListener('activated', (event) => {
    if (!event.isUpdate) {
      console.log('App ready to work offline');
    }
  });

  wb.addEventListener('waiting', (event) => {
    if (confirm('New content available. Reload?')) {
      wb.messageSkipWaiting();
      window.location.reload();
    }
  });

  wb.register().catch(err => console.error('Service worker registration failed:', err));
}

createRoot(document.getElementById("root")!).render(<App />);