// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, query, orderBy, startAfter, limit, getDocs, QueryConstraint, Timestamp } from "firebase/firestore";
import firebaseConfig from "../firebase-config";


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


const fetchTopics = async ( ) => {
    try {
        const q = query(collection(firestore, "topics"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log(doc.id,data.prompt)
            return {
                id: doc.id,
                prompt: data.prompt,
                active: data.active,
                completed: data.completed,
            };
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
};

const fetchMessagesForTopic = async (topicId: string, lastVisibleTimestamp: Timestamp | null = null, limitValue: number = 10) => {
    const messagesRef = collection(firestore, `topics/${topicId}/chats`);
    let queryConstraints: QueryConstraint[] = [orderBy("timestamp"), limit(limitValue)];

    if (lastVisibleTimestamp) {
        queryConstraints.push(startAfter(lastVisibleTimestamp));
    }

    const q = query(messagesRef, ...queryConstraints);
    const documentSnapshots = await getDocs(q);

    const messages = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as { content: string, role: string, timestamp: Timestamp }
    }));

    // Assuming the lastVisible is being managed correctly elsewhere
    const newLastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

    return { messages, lastVisible: newLastVisible ? newLastVisible.data().timestamp : null };
};



export { firestore, auth, googleProvider, fetchTopics, fetchMessagesForTopic };
