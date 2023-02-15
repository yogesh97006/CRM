// import { useContext,createContext,useEffect,useState } from "react";
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     onAuthStateChanged,
//     signOut
// } from 'firebase/auth'
// import { auth } from "./Config";


// const UserAuthContext=createContext();

// export function UserAuthContextProvider({children}){
//    const [User,setUser]=useState({});

//    function Login(email,password){
//     return signInWithEmailAndPassword(auth,email,password)
//    }

//    function SignUp(email,password,username,userid,usertype){
//     return createUserWithEmailAndPassword(auth,email,password,username,userid,usertype)
//    }

//    function LogOut(){
//     return signOut(auth)
//    }

//    useEffect(()=>{
//     const unsubscribe=onAuthStateChanged(auth,(CurrentUser)=>{
//        console.log("Auth",CurrentUser);
//        setUser(CurrentUser)
//     });

//     return ()=>{
//         unsubscribe();
//     };
//    },[]);

//    return (
//     <UserAuthContext.Provider value={{User,Login,SignUp,LogOut}}>{children}</UserAuthContext.Provider>
//    )
// }

// export function useUserAuth(){
//     return useContext(UserAuthContext);
// }