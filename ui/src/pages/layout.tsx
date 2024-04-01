import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../api/firebase";
import {useEffect} from "react";

export default function BaseLayout() {
    const navigate = useNavigate(); // Hook to programmatically navigate
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user)
            navigate('/login');
    }, [loading, user, navigate]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-600">{error.message}</div>
            </div>
        );

    return (
        <div className="flex flex-col h-screen">

        </div>
    );
}
