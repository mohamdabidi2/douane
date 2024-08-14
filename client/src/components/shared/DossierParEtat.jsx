import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, Stack, Center } from '@chakra-ui/react';
import { FaSadTear, FaMeh, FaSmile } from 'react-icons/fa';
import axios from 'axios';

const DossierBox = ({ label, color, icon, count, width }) => (
  <Box width={width} flex="1" textAlign="center" bg={color} p={4} borderRadius="md">
    <Center mb={2}>
      <Box as={icon} color="white" boxSize="2em" />
    </Center>
    <Text fontSize="2xl" fontWeight="bold" color="white">{count}</Text>
    <Text fontSize="md" color="white">{label}</Text>
  </Box>
);

const StatistiquesDossiers = () => {
  const [dossierData, setDossierData] = useState({ 'En attente': 0, 'Accepté': 0, 'Refusé': 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stat/dossiers');
        setDossierData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const totalDossiers = dossierData['En attente'] + dossierData['Accepté'] + dossierData['Refusé'];

  return (
    <Box margin={"10px 0"} width={'67%'} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" boxShadow="md">
      <Box mb={4}>
        <Heading size="sm">Statistiques</Heading>
        <Text fontSize="md" color="gray.500">Dossiers par État</Text>
      </Box>
      <Stack direction="row" spacing={4}>
        <DossierBox
          label="Refusé"
          color="#FF718B"
          icon={FaSadTear}
          count={dossierData['Refusé']}
          width={`${(dossierData['Refusé'] / totalDossiers) * 100}%`}
        />
        <DossierBox
          label="En cours"
          color="#FFEB3A"
          icon={FaMeh}
          count={dossierData['En attente']}
          width={`${(dossierData['En attente'] / totalDossiers) * 100}%`}
        />
        <DossierBox
          label="Accepté"
          color="#7FE47E"
          icon={FaSmile}
          count={dossierData['Accepté']}
          width={`${(dossierData['Accepté'] / totalDossiers) * 100}%`}
        />
      </Stack>
    </Box>
  );
};

export default StatistiquesDossiers;
