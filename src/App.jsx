// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import SignIn from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';
import ResetPassword from './pages/auth/ResetPassword';
import ErrorPage from './pages/errorPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './pages/auth/AuthContext';
import JapaneseLearning from './JapaneseLearning';
import JapaneseDragDrop from './JapaneseDragDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/lesson" element={<JapaneseDragDrop />} />
        
        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
    </AuthProvider>
    </DndProvider>
  );
}

export default App;
