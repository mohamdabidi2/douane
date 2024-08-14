import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a context for user data
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user data from the server
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use token for authentication
        },
      });
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user data', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
