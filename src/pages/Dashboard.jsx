import React, { useEffect, useState } from 'react';
import { useAuth } from '../pages/auth/AuthContext';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import QuickModules from '../components/quickModules';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFirstName(userData.firstName || '');
          } else {
            console.error('No such user document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not logged in.</div>;
  }

  return (
    <>
    <div className = "w-screen h-screen">
    <div className="h-fit bg-gradient-to-r from-red-200 to-blue-200 sm:p-4">
      <div className="w-1/2 mx-auto">
        <h1 className="text-2xl font-light">Dashboard</h1>
        <p className="text-2xl font-semibold">Welcome, {firstName}!</p>
        <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
      </div>
    </div>

    <div className = "w-screen h-full p-1 bg-slate-100">
      <QuickModules />
    </div>
    </div>
    </>
  );
};

export default Dashboard;
