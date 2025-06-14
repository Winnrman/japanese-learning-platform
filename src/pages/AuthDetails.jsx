import React, {useEffect, useState} from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthDetails = () => {

    const [authUser, setAuthUser] = useState(null);
    
        useEffect(() => {
            const listen = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setAuthUser(user);
                }
                else{
                    setAuthUser(null);
                }
            });

            return () => {
                listen();
            }
        }, []);

        const userSignOut = () => {
            signOut(auth).then(() => {
                console.log('sign out successful')
            }).catch(error => console.log(error))
        }
    
        return (
            <div>
                <div>
                    { authUser ? <><img src = {authUser.photoURL} alt = "user" /> <p>Signed in as: {authUser.email}</p><button onClick = {userSignOut}>Sign Out</button></> : <p>Logged Out</p>}
                </div>
            </div>
        );
    }

    export default AuthDetails;

