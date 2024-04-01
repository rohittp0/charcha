import React, {useMemo} from "react";
import {useNavigate} from "react-router-dom";
import InfiniteScroll from "../../components/InfiniteScroll";
import {collection, DocumentData, orderBy} from "firebase/firestore";
import {firestore} from "../../api/firebase";

export default function LeftPane() {
    const navigate = useNavigate();

    const collectionMemo = useMemo(() =>
        collection(firestore, "/topics"), []);

    const orderByMemo = useMemo(() =>
        orderBy("last_seen", "desc"), []);

    function getTopicState(topic: DocumentData){
        if(topic.get("active"))
            return 'Active'
        if(topic.get("completed"))
            return 'Completed';

        return 'Pending';
    }

    return (
        <InfiniteScroll
            pageLimit={5}
            collection={collectionMemo}
            orderBy={orderByMemo}
            onResult={(doc) => (
                <div key={doc.id}
                     className={`p-4 cursor-pointer hover:bg-gray-200 ${doc.get("active") ? 'bg-gray-300' : ''}`}
                     onClick={() => navigate(`/chats/${doc.id}`)}>
                    <p className="font-semibold">{doc.get("prompt")}</p>
                    <p className="text-sm text-gray-600">{getTopicState(doc)}</p>
                </div>
            )}
        />
    )
}
