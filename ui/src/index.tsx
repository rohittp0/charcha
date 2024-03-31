import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './pages/chat/chat.css';
import ChatUI from "./pages/chat"; // Assuming ChatUI is the default export from './pages/chat/index.js' or './pages/chat/index.tsx'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ChatUI /> {/* Embedding ChatUI component */}
    </React.StrictMode>
);
