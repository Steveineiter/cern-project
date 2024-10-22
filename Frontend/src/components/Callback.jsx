import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const { userManager } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userManager) {
        userManager
          .signinRedirectCallback()
          .then(() => {
            navigate('/dashboard'); // Redirect to the home page after successful login
          })
          .catch((error) => {
            console.error('Authentication error:', error);
          });
      }
  }, [userManager, navigate]);

  return <div>Loading...</div>;
};

export default Callback;