import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInAnonymously, getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AuthDetails from '../authDetails';
// import logo from '../../assets/logo.png';
import { useAuth } from '../auth/AuthContext'


const SignIn = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);

    const signIn = (e) => {

        // const { login } = useAuth();
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential) //Got this far on June 9 -- Will continue later. 
            //store userToken in localstorage
            localStorage.setItem("authToken", userCredential.authToken)
            navigate('/dashboard');
        }).catch((error) => {
            console.log(error);
            if(error.message == "Firebase: Error (auth/invalid-credential).") {
                setError("Invalid email or password");
            }
        });
    }

    const handleSignInAnonymously = () => {
        const auth = getAuth();
        signInAnonymously(auth)
        .then(() => {
            navigate('/dashboard_v2')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setError(errorMessage);
        });
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
          .then((userCredential) => {
            navigate('/dashboard');
          })
          .catch((error) => {
            console.log(error);
            setError(error.message);
          });
    }

    const handleForgotPassword = (e) => {
        e.preventDefault();
        sendPasswordResetEmail(auth, email, {
            url: 'http://localhost:3000/', // The page to redirect to after resetting password
            handleCodeInApp: true,
        })
        .then(() => {
            setResetMessage("Password reset email sent. Please check your inbox.");
            setShowResetPassword(false);
        })
        .catch((error) => {
            setError(error.message);
        });
    }

    return (
       <div className="min-h-screen bg-gradient-to-r from-red-200 to-blue-200 sm:p-4 flex items-center justify-center">
  <div className="w-full h-screen sm:h-fit w-fit flex flex-row items-center bg-white rounded-lg shadow-md">

                <div className="p-6">
                    <form className="flex flex-col" onSubmit={signIn}>
                        {/* <div className="flex justify-center mb-6">
                            <img src={logo} className="w-24 h-24" alt="Logo"/>
                        </div> */}
                        <h2 className="text-3xl font-medium mb-6 text-center">Login to your Account</h2>
                        {error && <p className="flex items-center gap-2 text-red-600 text-sm bg-red-200 my-2 rounded-md p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </p>}
                        {resetMessage && <p className="flex items-center gap-2 text-green-600 text-sm bg-green-200 my-2 rounded-md p-2">{resetMessage}</p>}
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className="border border-gray-300 rounded-md shadow-sm text-sm p-2 w-full focus:outline-none mb-2" type="email" placeholder="Email" required></input>
                        {!showResetPassword && (
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className="border border-gray-300 rounded-md text-sm shadow-sm p-2 w-full focus:outline-none mb-2" type="password" placeholder="Password" required></input>
                        )}
                        <div className="flex justify-between mb-4">
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-2"></input>
                                <p className="text-sm">Remember me</p>
                            </div>
                            <button 
                                type="button"
                                className="text-sm text-blue-500"
                                onClick={() => setShowResetPassword(!showResetPassword)}
                            >
                                {showResetPassword ? 'Back to Login' : 'Forgot password?'}
                            </button>
                        </div>
                        {showResetPassword ? (
                            <button onClick={handleForgotPassword} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md p-2 w-full mb-4">Reset Password</button>
                        ) : (
                            <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-semibold text-sm rounded-lg shadow-md p-2 w-full mb-4">Log in</button>
                        )}
                        
                        <div className="text-center text-sm font-light mb-4">or</div>
                    </form>

                    <div className="flex flex-col gap-4 mb-4">
                        <button onClick={signInWithGoogle} className="flex justify-center items-center bg-white hover:bg-slate-100 ring-1 ring-slate-200 text-black rounded-lg shadow-md p-2 w-full">
                            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" />
                            <span className="ml-2 text-sm">Sign in with Google</span>
                        </button>
                        <button onClick={handleSignInAnonymously} className="flex justify-center items-center bg-slate-700 hover:bg-slate-800 ring-1 ring-slate-200 text-white rounded-lg shadow-md p-2 w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm">Sign in as Guest</span>
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-light">Don't have an account? <a href="/signup" className="text-blue-500 font-semibold">Sign up</a></p>
                    </div>
                </div>
                {/* <div className="flex-1 flex w-16 h-full p-2 bg-red-500">
                </div> */}
            </div>
        </div>
    );
}

export default SignIn;