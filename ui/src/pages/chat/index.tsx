import React, {useEffect, useState} from 'react';

interface Message {
    id: number;
    text: string;
    sender: string;
    photo: string;
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
            { id: 1, text: 'Hey, how are you?', sender: 'John Doe', photo: `${process.env.PUBLIC_URL}/chat/avatar/1.webp` },
            { id: 2, text: 'I\'m good, thanks! And you?', sender: 'You', photo: `${process.env.PUBLIC_URL}/chat/avatar/2.webp` },
        ],
    },
    {
        id: 2,
        name: 'Jane Doe',
        lastMessage: 'Let\'s catch up tomorrow!',
        time: '11:30 am',
        messages: [
            { id: 1, text: 'Let\'s catch up tomorrow!', sender: 'Jane Doe', photo: `${process.env.PUBLIC_URL}/chat/avatar/1.webp` },
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
                <div className="w-full md:w-1/3 bg-gray-100 overflow-auto">
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
                <div className="flex-1 p-4">
                    <button className="md:hidden mb-4" onClick={() => setShowChatList(true)}>Back</button>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">{activeChat.name}</h2>
                        <p className="text-gray-600">Last seen recently</p>
                    </div>
                    <div className="flex flex-col space-y-4 overflow-auto">
                        {activeChat.messages.map(message => (
                            <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : ''}`}>
                                {message.sender !== 'You' && <img src={message.photo} alt="Sender" className="w-10 h-10 rounded-full mr-2" />}
                                <div className={`rounded-lg px-4 py-2 max-w-xs ${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                {message.sender === 'You' && <img src={message.photo} alt="Sender" className="w-10 h-10 rounded-full ml-2" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatUI;
