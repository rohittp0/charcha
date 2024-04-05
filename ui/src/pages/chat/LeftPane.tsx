import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "../../components/InfiniteScroll";
import { collection, DocumentData, orderBy, QueryDocumentSnapshot } from "firebase/firestore";
import { firestore } from "../../api/firebase";
import { useAuthState } from "react-firebase-hooks/auth"; // Import useAuthState
import { auth } from "../../api/firebase"; // Ensure you have the auth module exported from your Firebase config

interface PaneProps {
    setHeader: (header: string) => void;
}

export default function LeftPane({ setHeader }: PaneProps) {
    const navigate = useNavigate();
    const [user] = useAuthState(auth); // Get the current user

    const collectionMemo = useMemo(() => collection(firestore, "/topics"), []);

    const orderByMemo = useMemo(() => orderBy("last_seen", "desc"), []);

    function getTopicState(topic: DocumentData) {
        if (topic.get("active")) return 'Active';
        if (topic.get("completed")) return 'Completed';

        return 'Pending';
    }

    function goToTopic(doc: QueryDocumentSnapshot) {
        setHeader(doc.get("prompt"));
        return navigate(`/chats/${doc.id}`);
    }

    function handleNewTopicClick() {
        if (user) {
            navigate(`/new/${user.uid}`); // Use the user's UID for navigation
        }
    }

    return (
        <>
            <InfiniteScroll
                pageLimit={5}
                collection={collectionMemo}
                orderBy={orderByMemo}
                onResult={(doc) => (
                    <div key={doc.id}
                         className={`p-4 cursor-pointer hover:bg-gray-200 ${doc.get("active") ? 'bg-gray-300' : ''}`}
                         onClick={() => goToTopic(doc)}>
                        <p className="font-semibold">{doc.get("prompt")}</p>
                        <p className="text-sm text-gray-600">{getTopicState(doc)}</p>
                    </div>
                )}
            />
            <button
                onClick={handleNewTopicClick}
                style={{position: 'fixed', bottom: '1vh', left: '25px', zIndex: 1000}}
                className="flex items-center justify-center p-0 w-12 h-12 bg-black rounded-full hover:bg-gray-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
            </button>

        </>
    );
}
