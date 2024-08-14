// ImageViewer.js
import React, { useEffect } from 'react';
import { Image } from '@chakra-ui/react';

const ImageViewer = ({ url }) => {
  useEffect(() => {
    
  
 console.log(url)
  }, [])
  
  return <Image src={"http://localhost:5000/"+url} alt={""} />;
};

export default ImageViewer;
