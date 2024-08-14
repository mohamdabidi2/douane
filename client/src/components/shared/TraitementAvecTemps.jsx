import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box, Button, Text, Stack, Heading } from '@chakra-ui/react';
import axios from 'axios';

const TraitementAvecTemps = () => {
  const [timeScale, setTimeScale] = useState('jour');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stat/get/${timeScale}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [timeScale]);

  return (
    <Box width="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" boxShadow="md">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Heading size="sm">Statistiques</Heading>
          <Text fontSize="md" color="gray.500">Traitement des dossiers à temps</Text>
        </Box>
        <Stack direction="row" spacing={2}>
          {['jour', 'semaine', 'mois', 'annee'].map((scale) => (
            <Button
              key={scale}
              onClick={() => setTimeScale(scale)}
              bg={timeScale === scale ? '#003366' : '#9291A5'}
              color="white"
              _hover={{ bg: timeScale === scale ? '#003366' : '#9291A5' }}
            >
              {scale.charAt(0).toUpperCase() + scale.slice(1)}
            </Button>
          ))}
        </Stack>
      </Stack>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Dossier" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TraitementAvecTemps;
