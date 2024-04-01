import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../api/firebase";
import React, {useEffect, useState} from "react";
import ChatUI from "./chat";

export default function BaseLayout() {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [user, loading, error] = useAuthState(auth);
    const {pathname} = useLocation();

    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!loading && !user)
            navigate('/login');
    }, [loading, user, navigate]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-600">{error.message}</div>
            </div>
        );

    const subPath = pathname.search(/\/.+\/.+/) !== -1

    return (
        <div className="flex h-screen overflow-hidden">
            <div
                className={`w-full md:w-1/4 bg-gray-100 overflow-y-auto ${isMobileView && subPath ? 'hidden' : ''}`}
                style={{maxHeight: '100vh'}}>
                <div className="bg-gray-800 p-3 flex items-center justify-center h-[70px]">
                    <img src={`${process.env.PUBLIC_URL}/chat/logo.png`} alt="Logo"
                         style={{filter: 'brightness(0) invert(1)'}} className="h-12 w-32"/>
                </div>
                <Routes>
                    <Route path="/chats" element={<div/>}/>
                </Routes>
            </div>

            {(!isMobileView || subPath)  &&
                <div className={"flex-1 overflow-y-auto"}
                     style={{
                         backgroundImage: `url(${process.env.PUBLIC_URL}/chat/bg.webp)`,
                         backgroundRepeat: 'repeat',
                         maxHeight: '100vh'
                     }}
                >
                    <div className="py-4 border-b border-gray-300 flex justify-between items-center px-4">
                        <button onClick={() => navigate(-1)}
                                className="md:hidden bg-black text-white p-2 mr-3 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                    </div>
                    <div className="p-4">
                        <Routes>
                            <Route path="/chats/:chat" element={<div/>}/>
                        </Routes>
                    </div>
                </div>
            }
        </div>
    );
}
