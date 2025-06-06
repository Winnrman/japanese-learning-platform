import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import JapaneseLearning from '../JapaneseLearning';
import JapaneseDragDrop from '../JapaneseDragDrop';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc} from "firebase/firestore";


const Dashboard = () => {

    const [user, setUser] = React.useState(null);
    const [firstName, setFirstName] = React.useState('');
    const [loading, setLoading] = React.useState(true);


    useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
        console.log('User data:', userData);

          setFirstName(userData.firstName);
        } else {
          console.error('No such user document!');
        }
      }
      else{
        console.log('No user is logged in');
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);
    

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
  }, []);

  if (!user) {
        return <div>Loading... (user may not be logged in)</div>;
    }

    return (

        <div className = "h-fit bg-gradient-to-r from-red-200 to-blue-200 sm:p-4">

<div className = "w-1/2 mx-auto">
            <h1 className = "text-2xl font-light">Dashboard</h1>
            <p className = "text-2xl font-semibold">Welcome, {firstName}!</p>
            {/* <JapaneseLearning /> */}
            {/* <JapaneseDragDrop /> */}
        </div>
        </div>
    )
}

export default Dashboard;