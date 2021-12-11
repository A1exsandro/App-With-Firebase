import { signInWithPopup } from "@firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, provider } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthConstextProvider = {
  children: ReactNode;
}

export const AuthConstext = createContext({} as AuthContextType);


export function AuthConstextProvider(props: AuthConstextProvider) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const { displayName, photoURL, uid } = user
  
        if(!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }  
    })

    return () => {
      unsubscribe(); //verificar o funcionamento
    }
  }, [])

  async function signInWithGoogle() {
    

    const result = await signInWithPopup(auth, provider);
    
    if(result.user) {
      const { displayName, photoURL, uid } = result.user

      if(!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    } 

  }
    return (
        <AuthConstext.Provider value={{user, signInWithGoogle}}>
          {props.children}
        </AuthConstext.Provider>
        
    );
}