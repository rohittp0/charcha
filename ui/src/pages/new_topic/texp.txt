import React, { useEffect, useState,useMemo } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "../../api/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../api/firebase";


interface Topic {
    id: string;
    content: string;
    timestamp?: Date;
}

export default function LeftPane_new( ) {
    const [user, loading, error] = useAuthState(auth);
    const [topics, setTopics] = useState<Topic[]>([]);

    const topicsQuery = useMemo(() => {
        if (user) {
            return query(collection(firestore, `submissions/${user.uid}/topics`), orderBy("timestamp", "desc"));
        }
        return null;
    }, [user]);

    useEffect(() => {
        const fetchTopics = async () => {
            if (topicsQuery) {
                const querySnapshot = await getDocs(topicsQuery);
                const fetchedTopics = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTopics(fetchedTopics as Topic[]);
            }
        };

        if (!loading && !error && topicsQuery) {
            fetchTopics();
        }
    }, [topicsQuery, loading, error]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <div>
            {topics.map((topic) => (
                <div className="p-4 cursor-pointer hover:bg-gray-200">
                    <p className="font-semibold">{topic.content}</p>
                </div>
            ))}
        </div>
    );
}
