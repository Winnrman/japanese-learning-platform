import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import JapaneseLearning from '../JapaneseLearning';
import JapaneseDragDrop from '../JapaneseDragDrop';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Dashboard = () => {
    
    const [user, setUser] = React.useState(null);

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
            <p className = "text-2xl font-semibold">Welcome, {user.email}!</p>
            {/* <JapaneseLearning /> */}
            {/* <JapaneseDragDrop /> */}
        </div>
        </div>
    )
}

export default Dashboard;