import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlineFileExcel,
  AiOutlineDownload,
} from 'react-icons/ai';
import FileViewerPopup from './FileViewerPopup';

// Fonction pour formater la date en format lisible
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ViewPopup = ({ isOpen, onClose, dossier }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const toast = useToast();

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const renderFileLink = (file) => {
    const fileType = file.url.split('.').pop().toLowerCase(); // Extraire l'extension du fichier

    switch (fileType) {
      case 'pdf':
        return (
          <Button
            colorScheme="blue"
            leftIcon={<AiOutlineFilePdf />}
            onClick={() => handleFileClick(file)}
          >
            Voir le PDF
          </Button>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <Button
            colorScheme="blue"
            leftIcon={<AiOutlineFileImage />}
            onClick={() => handleFileClick(file)}
          >
            Voir l'Image
          </Button>
        );
      case 'xlsx':
      case 'xls':
        return (
          <Button
            colorScheme="blue"
            leftIcon={<AiOutlineFileExcel />}
            onClick={() => handleFileClick(file)}
          >
            Voir le Fichier Excel
          </Button>
        );
      default:
        return (
          <Button
            colorScheme="blue"
            leftIcon={<AiOutlineDownload />}
            href={"http://localhost:5000/" + file.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Télécharger le fichier
          </Button>
        );
    }
  };

  if (!dossier) return null; // Assurez-vous que le dossier est fourni

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="80vh" overflowY="auto">
          <ModalHeader backgroundColor="#003366" color="white">
            Dossier ID: {dossier._id}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              <strong>Nom :</strong> {dossier.nom || 'N/A'}
            </Text>
            <Text mb={2}>
              <strong>Email :</strong> {dossier.prenom || 'N/A'}
            </Text>
            <Text mb={2}>
              <strong>Numéro de Téléphone :</strong> {dossier.numphone || 'N/A'}
            </Text>
            <Text mb={2}>
              <strong>Entreprise :</strong> {dossier.entreprise || 'N/A'}
            </Text>
            <Text mb={2}>
              <strong>Type :</strong> {dossier.typeDossier || 'N/A'}
            </Text>
            <Text mb={2}>
              <strong>Date de Soumission :</strong> {dossier.dateDeSoumission ? formatDate(dossier.dateDeSoumission) : 'N/A'}
            </Text>
            <Text mb={2}>
              <strong>Date Limite :</strong> {dossier.dateLimite ? formatDate(dossier.dateLimite) : 'N/A'}
            </Text>
            <Text mb={2}>
              <strong>État :</strong> {dossier.etat || 'N/A'}
            </Text>
            <Table variant="simple" mt={4}>
              <Thead>
                <Tr>
                  <Th>Nom du Fichier</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dossier.fichiers && dossier.fichiers.length > 0 ? (
                  dossier.fichiers.map((file, index) => (
                    <Tr key={index}>
                      <Td>{file.url.split('\\').pop()}</Td>
                      <Td>{renderFileLink(file)}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={2}>Aucun fichier disponible</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {selectedFile && (
        <FileViewerPopup
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          file={selectedFile}
        />
      )}
    </>
  );
};

export default ViewPopup;
