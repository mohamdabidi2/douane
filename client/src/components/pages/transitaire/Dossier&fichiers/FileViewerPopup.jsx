import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import useMeasure from 'react-use-measure';

import ExcelViewer from '../../../shared/ExcelViewer';
import PDFViewer from '../../../shared/PDFViewer';
import ImageViewer from '../../../shared/ImageViewer';

import { getFileExtension, getMimeType, getFileName } from '../../../utils/fileUtils';

const FileViewerPopup = ({ isOpen, onClose, file }) => {
  const [ref, { height }] = useMeasure();
  const modalSize = height < 600 ? '2xl' : height < 900 ? 'lg' : 'xl';

  const extension = getFileExtension(file.url);
  const name = getFileName(file.url);
  const mimeType = getMimeType(extension);

  const renderFileContent = () => {
    const { url } = file;

    if (mimeType === 'application/pdf') {
      return <PDFViewer name={name} url={url} />;
    } else if (mimeType.startsWith('image/')) {
      return <ImageViewer name={name} url={url} />;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return <ExcelViewer name={name} url={url} />;
    } else {
      return <Box>Type de fichier non pris en charge</Box>;
    }
  };

  const openInNewWindow = () => {
    window.open("http://localhost:5000/" + file.url, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <ModalOverlay />
      <ModalContent
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="md"
        shadow="lg"
        width="auto"
        height="auto"
        maxW="90%"
        maxH="90%"
      >
        <ModalHeader>Visualiser le fichier : {name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody ref={ref}>
          {renderFileContent()}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Fermer
          </Button>
          <Button colorScheme="teal" onClick={openInNewWindow} ml={3}>
            Ouvrir dans une nouvelle fenêtre
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FileViewerPopup;
