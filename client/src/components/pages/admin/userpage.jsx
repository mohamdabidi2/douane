import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  VStack,
  Input,
  Button,
  HStack,
  Switch,
} from '@chakra-ui/react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }

      try {
        // Récupérer les données depuis votre API avec le token dans les en-têtes
        const response = await axios.get('http://localhost:5000/api/user/all', {
          headers: {
            Authorization: `Bearer ${token}`, // Attacher le token dans l'en-tête Authorization
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        setError('Erreur lors de la récupération des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Optionnellement, mettre en place un intervalle pour rafraîchir périodiquement la liste des utilisateurs
    const interval = setInterval(fetchUsers, 60000); // Rafraîchir toutes les minutes

    return () => clearInterval(interval); // Nettoyer à la désactivation du composant
  }, []);

  const handleSearch = () => {
    const filtered = users.filter(user =>
      (user.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (userId, newStatus) => {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

    if (!token) {
      console.error('Aucun token trouvé');
      return;
    }

    try {
      // Faire la requête API avec le token dans les en-têtes
      await axios.put(
        `http://localhost:5000/api/user/${userId}`,
        { status: newStatus }, // Assurez-vous que le statut est inclus dans le corps de la requête
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attacher le token dans l'en-tête Authorization
          },
        }
      );

      // Rafraîchir la liste des utilisateurs pour obtenir des données mises à jour
      const response = await axios.get('http://localhost:5000/api/user/all', {
        headers: {
          Authorization: `Bearer ${token}`, // Attacher le token dans l'en-tête Authorization
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  if (loading) return <Text>Chargement...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={5}>
      <Flex mb={5} justify="space-between">
        <VStack align="start">
          <Text fontSize="2xl" fontWeight="bold">
            Gestion des Utilisateurs
          </Text>
          <Text fontSize="md" color="gray.500">
            Gérer les comptes utilisateurs
          </Text>
        </VStack>
        <HStack>
          <Input
            placeholder="Rechercher par nom d'utilisateur"
            size="md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}>Rechercher</Button>
        </HStack>
      </Flex>

      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead bg="gray.100">
            <Tr style={{ border: '1px solid gray' }}>
              <Th style={{ border: '1px solid gray' }}>Nom</Th>
              <Th style={{ border: '1px solid gray' }}>Email</Th>
              <Th style={{ border: '1px solid gray' }}>Profil</Th>
              <Th style={{ border: '1px solid gray' }}>Statut</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map(user => (
              <Tr key={user._id}>
                <Td style={{ border: '1px solid gray' }}>{user.nom}</Td>
                <Td style={{ border: '1px solid gray' }}>{user.email}</Td>
                <Td style={{ border: '1px solid gray' }}>{user.profile}</Td>
                <Td style={{ border: '1px solid gray' }}>
                  <Switch
                    isChecked={user.status === true}
                    onChange={(e) => handleStatusChange(user._id, e.target.checked ? true : false)}
                  />
                  <Text ml={2}>{user.status ? 'Actif' : 'Inactif'}</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
