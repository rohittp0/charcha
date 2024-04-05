import './index.css';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import {StrictMode} from "react";
import {createRoot} from "react-dom/client";

import BaseLayout from "./pages/layout";
import LoginPage from './pages/login';


const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/*",
        element: <BaseLayout/>,
    },

]);

const root = createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
