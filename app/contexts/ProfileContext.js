import { useQuery } from "@apollo/client/react";
import { createContext, useContext, useEffect } from "react";
import { GET_PROFILE } from "../queries/user";
import { AuthContext } from "./AuthContext";


export const ProfileContext = createContext(null)

export default function ProfileProvider({ children }) {
    const {isSignedIn} = useContext(AuthContext)
    
    const {data, loading, error, refetch} = useQuery(GET_PROFILE,{
        skip: !isSignedIn,
        fetchPolicy: "cache-and-network",
    })
    

    return (
        <ProfileContext.Provider value={{data, loading, error, refetch}}>
            {children}
        </ProfileContext.Provider>
    )
}