import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../api/firebase"; // Adjust the path as necessary
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { firestore } from "../../api/firebase"; // Adjust the path as necessary

interface IMessage {
    content: string;
    timestamp?: Date;
}

export default function RightPane_new() {
    const [user] = useAuthState(auth);
    const [message, setMessage] = useState("");
    const [recentMessage, setRecentMessage] = useState<IMessage | null>(null);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === "" || !user) return;

        const newMessage: IMessage = {
            content: message,
            timestamp: new Date() // Set current client timestamp
        };

        try {
            await addDoc(collection(firestore, `submissions/${user.uid}/topics`), {
                content: message,
                timestamp: serverTimestamp(), // Will be set in Firestore but not awaited here
            });
            setRecentMessage(newMessage); // Display the message immediately
            setMessage(""); // Clear the input after sending
        } catch (err) {
            console.error("Error adding topic:", err);
        }
    };

    return (
        <div className="p-4 flex flex-col h-[95vh]">
            {/* Display the most recent message */}
            {recentMessage && (
                <div className={"flex flex-col justify-around items-end"}>
                    {/* Message Cloud for the Recent Message */}
                    <div className="mb-4 max-w-lg self-end">
                        <div className="p-4 rounded-lg bg-black text-white">
                            <p>{recentMessage.content}</p>
                            <p className="text-xs text-gray-500">
                                {recentMessage.timestamp?.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                    {/* Message Cloud for the Review Notification */}
                    <div className="mb-4 max-w-lg self-start">
                        <div className="p-4 rounded-lg bg-gray-300 text-black">
                            <p className="text-sm text-green-500 mt-1">
                                Your topic is submitted for review, it will be added to charcha once the moderator approves.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-auto">
                <form onSubmit={sendMessage}
                      className="flex items-center justify-between p-3 border-t-2 border-gray-200">
                    <input
                        type="text"
                        placeholder="Type a topic..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 p-2 rounded-lg border-2 border-gray-300 mr-2"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-black text-white rounded-full flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="feather feather-send">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
