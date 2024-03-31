import * as React from "react";
import * as ReactDOM from "react-dom/client";
import './index.css';
import './pages/chat/chat.css';
import ChatUI from "./pages/chat";
import LoginPage from './pages/login';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>
    },
    {
        path: "/chat",
        element: <ChatUI/>,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
