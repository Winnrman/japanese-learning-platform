import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUpComponent = () => {

    const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const signUp = async(e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          uid: user.uid,
          lastLogin: new Date(),
          proficiency: 0,
          username: username,
          longestStreak: 0,
          currentStreak: 0,
          totalWordsLearned: 0,
          totalQuestionsAnswered: 0,
        });

        console.log("User and Firestore doc created:", user.uid);

        // Redirect to the dashboard or any other page
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Signup error:", error);
        setError(error.message);
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        console.log(userCredential);
        // You might want to redirect the user or update the UI here
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-700 to-slate-800 p-4 flex items-start sm:items-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form className="flex flex-col" onSubmit={signUp}>
            <h2 className="text-2xl font-semibold mb-6">
              Create an Account
            </h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

<div className = "flex flex-row justify-between gap-2">
            {/* <label className="text-sm font-medium mb-2">First Name</label> */}
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 rounded-md text-sm shadow-sm p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            type="text"
            placeholder="First Name"
            required
            />
            {/* <label className="text-sm font-medium mb-2">Last Name</label> */}
            <input value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 rounded-md text-sm shadow-sm p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            type="text"
            placeholder="Last Name"
            required
            />
            </div>

            <input value={username} onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md text-sm shadow-sm p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            type="text"
            placeholder="Username (visible throughout the app)"
            required
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md text-sm shadow-sm p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              type="email"
              placeholder="Email"
              required
            />
            <div className="flex flex-row items-center gap-2 mb-4">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md text-sm shadow-sm p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Password"
                required
              />
              <button className="text-xs h-auto p-2 border border-slate-300 rounded-md ">
                Show
              </button>
            </div>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 mb-4 rounded-md text-sm shadow-sm p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                placeholder="Confirm Password"
                required
              />

            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <p className="text-sm">Remember me</p>
              </div>
              <a href="#" className="text-sm text-blue-500">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-md text-sm p-2 font-semibold w-full mb-4"
            >
              Create Account
            </button>
            <div className="text-center text-sm font-light mb-4">or</div>
          </form>
          <button
            onClick={signInWithGoogle}
            className="flex justify-center items-center bg-white hover:bg-slate-100 ring-1 ring-slate-200 text-black rounded-lg shadow-md p-2 w-full mb-4"
          >
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google logo"
            />
            <span className="ml-2 text-sm">Sign up with Google</span>
          </button>
          <div className="text-center">
            <p className="text-sm font-light">
              Already have an account?
              <a href="/" className="text-blue-500 font-semibold ml-1">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpComponent;
