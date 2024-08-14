// ExcelViewer.js
import React, { useState, useEffect } from 'react';
import { Box, Table, Tbody, Tr, Td, Thead, Th, Spinner } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

const ExcelViewer = ({ url }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const finalUrl = url.startsWith('blob:') ? url : `http://localhost:5000/${url}`;
  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch(finalUrl);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      setData(worksheet);
      setLoading(false);
    };

    fetchData();
  }, [url]);

  if (loading) return <Spinner />;

  return (
    <Box>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            {data[0].map((col, index) => (
              <Th key={index}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.slice(1).map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Td key={cellIndex}>{cell}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ExcelViewer;
