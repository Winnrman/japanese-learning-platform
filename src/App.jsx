// // App.jsx
import React, { useState } from 'react';
// // import JapaneseDictionary from './JapaneseDictionary';
// // import { createSRS } from './SpacedRepetitionSystem';
// import JapaneseLearning from './JapaneseLearning';
import Dashboard from './pages/Dashboard';

// // const dictionary = new JapaneseDictionary();
// // const vocabulary = Array.from(dictionary.words.values());
// // const srs = createSRS(vocabulary);

// export default function App() {
//   const [mode, setMode] = useState('home');
//   const [currentCard, setCurrentCard] = useState(null);
//   const [showAnswer, setShowAnswer] = useState(false);

//   const startReview = () => {
//     const next = srs.getNextCard();
//     setCurrentCard(next);
//     setShowAnswer(false);
//     setMode('review');
//   };

//   const handleAnswer = (isCorrect) => {
//     srs.recordAnswer(currentCard.id, isCorrect);
//     const next = srs.getNextCard();
//     setCurrentCard(next);
//     setShowAnswer(false);
//   };

//   return (
//     // <div className="p-6 max-w-xl mx-auto">
//     //   <h1 className="text-3xl font-bold mb-4">Language Learning App</h1>
//     //   {mode === 'home' && (
//     //     <div className="space-y-4">
//     //       <button onClick={startReview} className="px-4 py-2 bg-blue-500 text-white rounded">Start Review</button>
//     //       <button onClick={() => setMode('vocab')} className="px-4 py-2 bg-gray-500 text-white rounded">View Vocabulary</button>
//     //     </div>
//     //   )}

//     //   {mode === 'review' && currentCard && (
//     //     <div className="space-y-4">
//     //       <div className="text-xl">{currentCard.japanese}</div>
//     //       {showAnswer ? (
//     //         <div>
//     //           <div className="text-green-700 font-semibold mb-2">{currentCard.english}</div>
//     //           <button onClick={() => handleAnswer(true)} className="px-4 py-2 bg-green-500 text-white rounded mr-2">I knew this</button>
//     //           <button onClick={() => handleAnswer(false)} className="px-4 py-2 bg-red-500 text-white rounded">I didn't know</button>
//     //         </div>
//     //       ) : (
//     //         <button onClick={() => setShowAnswer(true)} className="px-4 py-2 bg-blue-700 text-white rounded">Show Answer</button>
//     //       )}
//     //     </div>
//     //   )}

//     //   {mode === 'vocab' && (
//     //     <div className="space-y-2">
//     //       {vocabulary.map((item) => (
//     //         <div key={item.id} className="p-2 border rounded">
//     //           <div className="font-semibold">{item.japanese}</div>
//     //           <div className="text-gray-700">{item.english}</div>
//     //         </div>
//     //       ))}
//     //       <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded" onClick={() => setMode('home')}>Back</button>
//     //     </div>
//     //   )}
//     // </div>
//     <JapaneseLearning />
//   );
// }


// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import JapaneseDragDrop from './JapaneseDragDrop';

// function App() {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <JapaneseDragDrop />
//     </DndProvider>
//   );
// }

// export default App; 

// import logo from './logo.svg';
import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';

import ErrorPage from './pages/errorPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResetPassword from './pages/auth/ResetPassword';


function App() {
  return (
    <Router>
      <Routes>
          <Route path = "/" element = {<SignIn/>} />
          <Route path = "/signup" element = {<SignUp/>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path = "/authdetails" element = {<AuthDetails/>} /> */}
          <Route path = "/dashboard" element = {<Dashboard/>} />
          {/* <Route path = "/new" element = {<NewPost/>} /> */}
          <Route path = "*" element = {<ErrorPage/>} />
          {/* <Route path = "/folder/:folderId" element = {<FolderView/>} /> */}
          {/* <Route path = "/posts/edit/:postId" element = {<EditPost/>} /> */}
          {/* <Route path = "/dashboard_v2" element = {<Dashboard_v2/>} /> */}
          {/* <Route path = "/post/:postId" element = {<PostView/>} /> */}
        </Routes>
    </Router>
  );
}

export default App;

