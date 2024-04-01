import React, {useMemo} from "react";
import InfiniteScroll from "../../components/InfiniteScroll";
import {firestore} from "../../api/firebase";
import {collection, DocumentData, orderBy, QueryDocumentSnapshot} from "firebase/firestore";
import {useParams} from "react-router-dom";

export default function RightPane() {
    const {chatId} = useParams();

    const collectionMemo = useMemo(() =>
        collection(firestore, `topics/${chatId}/chats`), [chatId]);
    const orderByMemo = useMemo(() =>
        orderBy("timestamp", "asc"), []);

    function userIcon(msg: QueryDocumentSnapshot<DocumentData, DocumentData>, isMessageOnRight: boolean) {
        const src = `${process.env.PUBLIC_URL}/chat/avatar/${msg.get("role").toLowerCase()}.webp`
        return (
            <div className={`flex items-end ${isMessageOnRight ? "ml-2" : ""}`}>
                <img src={src} alt={msg.get("role")}
                     className="w-8 h-8 rounded-full mr-2 sm:w-10 sm:h-10"/>
            </div>
        )
    }

    function getMessageStyle(isMessageOnRight: boolean) {
        const baseStyle = "rounded-lg px-4 py-2 max-w-[75vw] sm:max-w-xl";
        const rounding = isMessageOnRight ? "rounded-br-none text-right" : "rounded-bl-none text-left";
        const color = isMessageOnRight ? "bg-gray-300 text-black" : "bg-gray-800 text-white";

        return `${color} ${baseStyle} ${rounding}`;
    }

    return (
        <div className="p-4">
            <InfiniteScroll
                pageLimit={5}
                collection={collectionMemo}
                orderBy={orderByMemo}
                onResult={(message, index) => (
                    <div key={message.id}
                         className={`flex ${index % 2 ? 'justify-end' : 'justify-start'} items-end mb-4`}>
                        {!(index % 2) && userIcon(message, false)}
                        <div
                            className={getMessageStyle(index % 2 === 1)}>
                            <p className="font-bold">{message.get("role")}</p>
                            <p className="text-s mb-1">{message.get("timestamp").toDate().toLocaleTimeString()}</p>
                            <p className="text-s text-left">
                                {message.get("content")}
                            </p>
                        </div>
                        {!!(index % 2) && userIcon(message, true)}
                    </div>
                )}
            />
        </div>
    );
}
