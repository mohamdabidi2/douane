// PDFViewer.js
import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

const PDFViewer = ({ url }) => {
  const finalUrl = url.startsWith('blob:') ? url : `http://localhost:5000/${url}`;
  return (
    <Box>
      <iframe
        src={finalUrl}
        title="PDF Viewer"
        style={{ width: '600px', height: '600px', border: 'none' }}
      />
    </Box>
  );
};

export default PDFViewer;
