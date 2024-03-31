import React, {useEffect, useState} from 'react';

interface Message {
    id: number;
    text: string;
    sender: string;
    photo: string;
    time: string;
}

interface Chat {
    id: number;
    name: string;
    lastMessage: string;
    time: string;
    messages: Message[];
}

const chats: Chat[] = [
    {
        id: 1,
        name: 'John Doe',
        lastMessage: 'Hey, how are you?',
        time: '12:45 pm',
        messages: [
            {
                id: 1,
                text: 'Hey Jordan! Do you have any plans for the weekend? 🤔',
                sender: 'John Doe',
                photo: `${process.env.PUBLIC_URL}/chat/avatar/1.webp`,
                time: '11:30pm'
            },
            {
                id: 2,
                text: 'Hey Alex! Not really, was thinking about maybe catching a movie or something. What about you?',
                sender: 'You',
                photo: `${process.env.PUBLIC_URL}/chat/avatar/2.webp`,
                time: '11:30pm'
            },
        ],
    },
    {
        id: 2,
        name: 'Jane Doe',
        lastMessage: 'Let\'s catch up tomorrow!',
        time: '11:30 am',
        messages: [
            {
                id: 1,
                text: 'Let\'s catch up tomorrow!',
                sender: 'Jane Doe',
                photo: `${process.env.PUBLIC_URL}/chat/avatar/1.webp`,
                time: '11:30pm'
            },
        ],
    },
];

const ChatUI = () => {
    const [activeChat, setActiveChat] = useState<Chat>(chats[0]);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showChatList, setShowChatList] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setShowChatList(true); // Always show chat list on non-mobile views
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChatSelection = (chat: Chat) => {
        setActiveChat(chat);
        if (isMobileView) {
            setShowChatList(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Toggle between chat list and chat details on mobile */}
            {showChatList && (
                <div className="w-full md:w-1/4 bg-gray-100 overflow-auto">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`p-4 flex justify-between cursor-pointer hover:bg-gray-200 ${activeChat.id === chat.id ? 'bg-gray-300' : ''}`}
                            onClick={() => handleChatSelection(chat)}
                        >
                            <div>
                                <p className="font-semibold">{chat.name}</p>
                                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                            </div>
                            <span className="text-sm text-gray-500">{chat.time}</span>
                        </div>
                    ))}
                </div>
            )}

            {(!showChatList || !isMobileView) && (
                <div className="flex-1 p-4 relative"
                     style={{backgroundImage: `url(${process.env.PUBLIC_URL}/chat/bg.webp)`, backgroundSize: 'cover'}}
                >

                    {/*<div className="absolute inset-0 flex justify-center items-center">*/}
                    {/*    <img src={`${process.env.PUBLIC_URL}/chat/logo.png`} alt="Logo" className="w-64 h-64" /> /!* Adjust size as needed *!/*/}
                    {/*</div>*/}

                    <div className="flex items-center justify-start gap-5 mb-4">
                        <button
                            className="md:hidden rounded-full p-1 bg-black text-white flex items-center justify-center shadow-lg"
                            onClick={() => setShowChatList(true)}
                            style={{width: '35px', height: '35px'}} // Adjusted the size of the button
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-bold">{activeChat.name}</h2>
                            <p className="text-gray-600">Last seen recently</p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 overflow-auto z-10">
                        {activeChat.messages.map((message) => (
                            <div key={message.id}
                                 className={`flex ${message.sender === 'You' ? 'justify-end' : ''} mb-2 items-end`}>
                                {message.sender !== 'You' &&
                                    <img src={message.photo} alt="Sender" className="w-8 h-8 rounded-full mr-2"/>}

                                {/* Use flex-row for the bubble to lay out text and time in a row */}
                                <div
                                    className={`flex flex-row items-end rounded-lg max-w-lg ${message.sender === 'You' ? 'bg-black text-white' : 'bg-gray-300 text-black'} px-4 py-2 ${message.sender === 'You' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                    <span className="text-sm flex-1">{message.text}</span>
                                    <span className="text-xxs ml-2"
                                          style={{fontSize: '0.6rem'}}>{message.time}</span> {/* Custom smaller text size */}
                                </div>

                                {message.sender === 'You' &&
                                    <img src={message.photo} alt="You" className="w-8 h-8 rounded-full ml-2"/>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatUI;
