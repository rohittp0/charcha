import React, {useMemo} from "react";
import InfiniteScroll from "../../components/InfiniteScroll";
import {collection, orderBy} from "firebase/firestore";
import {firestore} from "../../api/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../api/firebase";


export default function LeftPane_new( ) {
    const [user] = useAuthState(auth);

    const collectionMemo = useMemo(() =>
        collection(firestore, `submissions/${user?.uid}/topics`), []);
    const orderByMemo = useMemo(() =>
        orderBy("timestamp", "desc"), []);


    return (
        <>
            <InfiniteScroll
                pageLimit={5}
                collection={collectionMemo}
                orderBy={orderByMemo}
                onResult={(doc) => (
                    <div key={doc.id}
                         className={`p-4 cursor-pointer hover:bg-gray-200 'bg-gray-300'`}>
                        <p className="font-semibold">{doc.get("content")}</p>
                        <p className="text-sm text-gray-600">{doc.get("timestamp").toDate().toLocaleTimeString()}</p>
                    </div>
                )}
            />
        </>
    );
}
