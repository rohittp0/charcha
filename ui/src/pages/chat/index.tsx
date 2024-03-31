import React, { useEffect, useState } from 'react';
import { fetchTopics, fetchMessagesForTopic } from '../../api/firebase';
import { Timestamp } from 'firebase/firestore';

interface Topic {
    id: string;
    prompt: string;
    active: boolean;
    completed: boolean;
}

interface Message {
    id: string;
    content: string;
    role: string;
    timestamp: Timestamp;
}

interface RoleStyle {
    bgColor: string;
    textColor: string;
    imgSrc: string;
}

const roleStyles: { [key: string]: RoleStyle } = {
    Alex: {
        bgColor: 'bg-gray-800',
        textColor: 'text-white',
        imgSrc: `${process.env.PUBLIC_URL}/chat/avatar/1.webp`,
    },
    Jordan: {
        bgColor: 'bg-gray-300',
        textColor: 'text-black',
        imgSrc: `${process.env.PUBLIC_URL}/chat/avatar/2.webp`,
    },
    Taylor: {
        bgColor: 'bg-gray-800',
        textColor: 'text-white',
        imgSrc: `${process.env.PUBLIC_URL}/chat/avatar/1.webp`,
    },
    Morgan: {
        bgColor: 'bg-gray-300',
        textColor: 'text-black',
        imgSrc: `${process.env.PUBLIC_URL}/chat/avatar/2.webp`,
    },
    Casey: {
        bgColor: 'bg-gray-800',
        textColor: 'text-white',
        imgSrc: `${process.env.PUBLIC_URL}/chat/avatar/1.webp`,
    },
};

const ChatUI = () => {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showChatList, setShowChatList] = useState(true);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // Adapt responsive design
    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth < 768;
            setIsMobileView(mobileView);
            // Reset to show chat list when resizing to desktop view
            if (!mobileView) setShowChatList(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchTopics().then(setTopics);
    }, []);

    useEffect(() => {
        const loadMessages = async () => {
            if (!activeTopicId) return;
            setLoading(true);
            const {messages: newMessages} = await fetchMessagesForTopic(activeTopicId);
            setMessages(newMessages);
            setLoading(false);
        };
        loadMessages();
    }, [activeTopicId]);

    const handleTopicSelection = (topicId: string) => {
        setActiveTopicId(topicId);
        if (isMobileView) {
            setShowChatList(false);
        }// On mobile, hide chat list when a topic is selected
    };

    const backToTopics = () => {
        if (isMobileView) setShowChatList(true); // On mobile, allow navigating back to the chat list
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {showChatList && (
                <div className={`w-full md:w-1/4 bg-gray-100 overflow-y-auto ${isMobileView && !showChatList ? 'hidden' : ''}`} style={{ maxHeight: '100vh' }}>
                    <div className="bg-gray-800 p-3 flex items-center justify-center h-[70px]">
                        <img src={`${process.env.PUBLIC_URL}/chat/logo.png`} alt="Logo" style={{ filter: 'brightness(0) invert(1)' }} className="h-12 w-32" />
                    </div>
                    {topics.map((topic) => (
                        <div key={topic.id} className={`p-4 cursor-pointer hover:bg-gray-200 ${activeTopicId === topic.id ? 'bg-gray-300' : ''}`} onClick={() => handleTopicSelection(topic.id)}>
                            <p className="font-semibold">{topic.prompt}</p>
                            <p className="text-sm text-gray-600">{topic.active ? 'Active' : 'Completed'}</p>
                        </div>
                    ))}
                </div>
            )}

            {(!showChatList || !isMobileView) && activeTopicId && (
                <div className={`flex-1 overflow-y-auto ${isMobileView && showChatList ? 'hidden' : ''}`} style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/chat/bg.webp)`, backgroundRepeat: 'repeat', maxHeight: '100vh' }}>
                    <div className="py-4 border-b border-gray-300 flex justify-between items-center px-4">
                        <button onClick={backToTopics}
                                className="md:hidden bg-black text-white p-2 mr-3 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold">{topics.find(topic => topic.id === activeTopicId)?.prompt || 'Select a topic'}</h2>
                    </div>
                    <div className="p-4">
                        {messages.map((message) => {
                            const isMessageOnRight = roleStyles[message.role]?.bgColor === 'bg-gray-800';
                            return (
                                <div key={message.id}
                                     className={`flex ${isMessageOnRight ? 'justify-end' : 'justify-start'} items-end mb-4`}>
                                    {!isMessageOnRight && (
                                        <div className="flex items-end">
                                            <img src={roleStyles[message.role]?.imgSrc} alt={message.role} className="w-8 h-8 rounded-full mr-2 sm:w-10 sm:h-10"/>
                                        </div>
                                    )}
                                    <div className={`${roleStyles[message.role]?.bgColor} ${roleStyles[message.role]?.textColor} rounded-lg px-4 py-2 max-w-[75vw] sm:max-w-xl ${isMessageOnRight ? 'rounded-br-none text-right' : 'rounded-bl-none text-left'}`}>
                                        <div className="font-bold">{message.role}</div>
                                        <p className="text-s ">{message.content}</p>
                                        <p className="text-s ">{message.timestamp.toDate().toLocaleTimeString()}</p>
                                    </div>
                                    {isMessageOnRight && (
                                        <div className="flex items-end ml-2">
                                            <img src={roleStyles[message.role]?.imgSrc} alt={message.role} className="w-8 h-8 rounded-full sm:w-10 sm:h-10"/>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {loading && <div>Loading more messages...</div>}
                    </div>
                </div>
    )}
        </div>
    );
};

export default ChatUI;
