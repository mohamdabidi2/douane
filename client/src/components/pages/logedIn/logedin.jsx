import React, { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../connection/login';
import DashboardDouane from '../transitaire/dashboard/tableaudeboard';
import DossiersFichiers from '../transitaire/Dossier&fichiers/DossiersFichiers';
import Profile from '../transitaire/profile/profile';
import AjouterDossier from '../transitaire/ajouterDossier/ajouterDossier';
import Register from '../connection/register';
import { useUser } from '../../utils/UserContext';
import DossiersFichiersDouane from './../douane/Dossier&fichiers/DossiersFichiers';
import Users from '../admin/users';

const roleRoutes = {
  admin: [
    "/dashboard",
    "/dossiers-fichiers",
    "/profile",
    "/ajouter-dossier",
    "/dossiers-fichiers-douane",
    "/users"
  ],
  douane: [
    "/dashboard",
    "/dossiers-fichiers-douane",
    "/profile"
  ],
  transitaire: [
    "/dashboard",
    "/dossiers-fichiers",
    "/profile",
    "/ajouter-dossier"
  ]
};

const ProtectedRoute = ({ element, allowedRoles, ...rest }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.profile)) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

const PublicRoute = ({ element, ...rest }) => {
  const { user } = useUser();
  return !user ? element : <Navigate to="/dashboard" />;
};

const LogedIn = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/validate-token', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data.valid) {
          throw new Error('Token is invalid');
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
      }
    };

    checkToken();
  }, [setUser, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ChakraProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashboardDouane />} allowedRoles={['Admin', 'Douane', 'Transitaire']} />} />
        <Route path="/dossiers-fichiers" element={<ProtectedRoute element={<DossiersFichiers />} allowedRoles={['Admin', 'Transitaire']} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={['Admin', 'Douane', 'Transitaire']} />} />
        <Route path="/ajouter-dossier" element={<ProtectedRoute element={<AjouterDossier />} allowedRoles={['Admin', 'Transitaire']} />} />
        <Route path="/dossiers-fichiers-douane" element={<ProtectedRoute element={<DossiersFichiersDouane />} allowedRoles={['Admin', 'Douane']} />} />
        <Route path="/users" element={<ProtectedRoute element={<Users />} allowedRoles={['Admin']} />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </ChakraProvider>
  );
};

export default LogedIn;
