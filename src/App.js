import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './style.scss';
import CustomItemContext from './context/itemContext';
import { AuthContext } from './context/AuthContext';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <CustomItemContext>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </CustomItemContext>
  );
}

export default App;
