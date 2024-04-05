import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../api/firebase";
import React, {useEffect, useState} from "react";
import {LeftPane, RightPane} from "./chat";
import {LeftPane_new, RightPane_new} from "./new_topic"

export default function BaseLayout() {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [user, loading, error] = useAuthState(auth);
    const {pathname} = useLocation();

    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [header, setHeader] = useState("");

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
                <div role="status" className="w-100 flex items-center justify-center p-2">
                    <svg aria-hidden="true"
                         className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
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
            {(!isMobileView || !subPath) &&
                <div
                    className="w-full md:w-1/4 bg-gray-100 overflow-y-auto flex flex-col"
                    style={{maxHeight: '100vh'}}>
                    <div className="bg-gray-800 p-3 flex items-center justify-center h-[70px]">
                        <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="Logo"
                             style={{filter: 'brightness(0) invert(1)'}} className="h-12 w-32"/>
                    </div>
                    <Routes>
                        <Route path="/new/*" element={<LeftPane_new />}/>
                        <Route path="/*" element={<LeftPane setHeader={setHeader}/>}/>
                    </Routes>
                    <div className="flex flex-grow"/>
                    <div className="p-4 flex justify-center">
                        <a href="https://github.com/rohittp0/charcha/"
                           className="font-bold" target="_blank" rel="noreferrer">
                            View on Github
                        </a>
                        <object type="image/svg+xml" data={`${process.env.PUBLIC_URL}/img/github.svg`}
                                className="h-6 w-6 ml-2">
                            Github Logo
                        </object>
                    </div>
                </div>
            }

            {(!isMobileView || subPath) &&
                <div className={"flex-1 overflow-y-auto"}
                     style={{
                         backgroundImage: `url(${process.env.PUBLIC_URL}/img/chat/bg.webp)`,
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
                        <h2 className="text-xl font-bold">{header}</h2>
                    </div>
                    <Routes>
                        <Route path="/chats/:chatId" element={<RightPane/>}/>
                        <Route path="/new/:userId" element={<RightPane_new/>}/>
                    </Routes>
                </div>
            }
        </div>
    );
}
