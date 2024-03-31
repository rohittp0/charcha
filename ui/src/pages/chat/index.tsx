import {useEffect, useState} from 'react';

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
        <div>
            <div className="flex h-screen">
                {/* Toggle between chat list and chat details on mobile */}
                {showChatList && (
                    <div className="w-full md:w-1/4 bg-gray-100 overflow-auto">
                        <div className="bg-gray-800  p-3 flex items-center justify-center h-[70px]">
                            <img
                                src={`${process.env.PUBLIC_URL}/chat/logo.png`}
                                alt="Logo"
                                style={{filter: 'brightness(0) invert(1)'}}
                                className="h-12 w-32"
                            />
                        </div>
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
                    <div className="flex-1 relative"
                         style={{
                             backgroundImage: `url(${process.env.PUBLIC_URL}/chat/bg.webp)`,
                             backgroundRepeat: 'repeat',
                             backgroundSize: '110px 60px',
                         }} >

                    <div>
                            <div className="flex items-center justify-start gap-5 mb-4">
                                <div className="py-4 h-[70px] border-b border-gray-300 w-full flex justify-center">
                                    <h2 className="text-xl font-bold">{activeChat.name}</h2>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4 overflow-auto z-10 p-4">
                            {activeChat.messages.map((message) => (
                                    <div key={message.id}
                                         className={`flex ${message.sender === 'You' ? 'justify-end' : ''} mb-2 items-end`}>
                                        {message.sender !== 'You' &&
                                            <img src={message.photo} alt="Sender"
                                                 className="w-8 h-8 rounded-full mr-2"/>}
                                        <div
                                            className={`flex flex-row items-end rounded-lg max-w-lg ${message.sender === 'You' ? 'bg-gray-800  text-white' : 'bg-gray-300 text-black'} px-4 py-2 ${message.sender === 'You' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                            <span className="text-sm flex-1">{message.text}</span>
                                            <span className="text-xxs ml-2"
                                                  style={{fontSize: '0.6rem'}}>{message.time}</span>
                                        </div>

                                        {message.sender === 'You' &&
                                            <img src={message.photo} alt="You" className="w-8 h-8 rounded-full ml-2"/>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ChatUI;