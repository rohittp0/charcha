import React, {useMemo} from "react";
import {useNavigate} from "react-router-dom";
import InfiniteScroll from "../../components/InfiniteScroll";
import {collection, DocumentData, orderBy, QueryDocumentSnapshot} from "firebase/firestore";
import {firestore} from "../../api/firebase";

interface PaneProps {
    setHeader: (header: string) => void;
}

export default function LeftPane({setHeader}: PaneProps) {
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

    function goToTopic(doc: QueryDocumentSnapshot) {
        setHeader(doc.get("prompt"));
        return navigate(`/chats/${doc.id}`);
    }

    return (
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
    )
}
