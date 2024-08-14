import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // Extend as needed

const PaysStat = () => {
  const [data, setData] = useState([]);
  const [weeklyCount, setWeeklyCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for the countries' stats
        const response = await axios.get('http://localhost:5000/api/stat/countries');
        setData(response.data);

        // Fetch data for the weekly count
        const weeklyResponse = await axios.get('http://localhost:5000/api/stat/weekly');
        setWeeklyCount(weeklyResponse.data.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Flex margin="10px 0" direction="column" justify="space-between" p={5} width="30%" borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" boxShadow="md">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Heading size="sm">Statistiques</Heading>
          <Text fontSize="md">Dossier</Text>
        </Box>
        <Box>
          <Heading size="sm">Cette semaine</Heading>
          <Text fontSize="md">{weeklyCount}</Text> {/* Updated to show the correct weekly count */}
        </Box>
      </div>
      <Box w="100%">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="dossier"
              nameKey="country"
              label={""}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const { name, value } = payload[0];
                  return (
                    <div style={{ padding: '5px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '3px' }}>
                      <p style={{ margin: 0 }}><strong>{name}</strong></p>
                      <p style={{ margin: 0 }}>{`${value} dossiers`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Flex>
  );
};

export default PaysStat;
