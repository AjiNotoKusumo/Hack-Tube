import { getItem } from "expo-secure-store";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext(false)

export default function AuthProvider({ children }) {
    const [isSignedIn, setIsSignedIn] = useState(false)
    
    useEffect(() => {
        const token = getItem("accessToken")
        if (token) {
            setIsSignedIn(true)
        }
    }, [])

    return (
        <AuthContext value={{isSignedIn, setIsSignedIn}}>
            {children}
        </AuthContext>
    )
}