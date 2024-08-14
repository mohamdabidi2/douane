import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Select,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import Countdown from 'react-countdown';
import { FaTrashAlt, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import ShowImage from '../../../shared/ImageViewer';
import ShowPdf from '../../../shared/PDFViewer';
import ShowExcel from '../../../shared/ExcelViewer';
import { getFileExtension, getFileName } from '../../../utils/fileUtils';

const EditPopup = ({ isOpen, onClose, dossier, fetchData }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file
      }));
      setFiles([...files, ...newFiles]);
    }
  });

  const [files, setFiles] = useState(dossier?.fichiers || []);
  const [deletedFiles, setDeletedFiles] = useState([]); // Track deleted files
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    typeDossier: dossier?.typeDossier || '',
    informations: dossier?.informations || [],
  });

  useEffect(() => {
    if (dossier) {
      setFiles(dossier.fichiers || []);
      setFormData({
        typeDossier: dossier.typeDossier,
        informations: dossier.informations,
      });
    }
  }, [dossier]);

  const handleDeleteFile = (url) => {
    setFiles(files.filter(file => file.url !== url));
    setDeletedFiles([...deletedFiles, url]); // Add to deleted files list
  };

  const handleShowFile = (file) => {
    setSelectedFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append('typeDossier', formData.typeDossier);
    formData.informations.forEach(info => data.append('informations', info));
    files.forEach(file => {
      if (file.file) {
        data.append('files', file.file);
      }
    });
    data.append('deletedFiles', JSON.stringify(deletedFiles)); // Convert deletedFiles to JSON string

    try {
      const res = await axios.put(`http://localhost:5000/api/dossier/${dossier._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming you're using token-based auth
        }
      });
      fetchData();
      console.log('Updated dossier:', res.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const renderFileViewer = () => {
    if (!selectedFile) return null;
    const fileExtension = selectedFile.name
      ? getFileExtension(selectedFile.name).toLowerCase()
      : getFileExtension(selectedFile.url).toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <ShowImage url={selectedFile.url} />;
    } else if (fileExtension === 'pdf') {
      return <ShowPdf url={selectedFile.url} />;
    } else if (['xls', 'xlsx'].includes(fileExtension)) {
      return <ShowExcel url={selectedFile.url} />;
    } else {
      return <Alert status="error">Unsupported file type</Alert>;
    }
  };

  if (!dossier) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Éditer Dossier</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error">
              <AlertIcon />
              Aucun dossier sélectionné.
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Fermer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Éditer Dossier</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction={{ base: 'column', md: 'row' }}>
              <Box flex="1" mr={{ md: 5 }} mb={{ base: 5, md: 0 }}>
                <VStack align="start" spacing={4}>
                  <HStack spacing={4} width="100%">
                    <Box flex="1">
                      <Text>ID</Text>
                      <Input value={dossier._id} isDisabled borderColor="#003366" />
                    </Box>
                    <Box flex="1">
                      <Text>Date de Soumission</Text>
                      <Input value={dossier.dateDeSoumission} isDisabled borderColor="#003366" />
                    </Box>
                  </HStack>
                  <HStack spacing={4} width="100%">
                    <Box flex="1">
                      <Text>Date Limite</Text>
                      <Input value={dossier.dateLimite} isDisabled borderColor="#003366" />
                    </Box>
                    <Box flex="1">
                      <Text>Type</Text>
                      <Select
                        name="typeDossier"
                        value={formData.typeDossier}
                        onChange={handleInputChange}
                        borderColor="#003366"
                      >
                        <option value="import">Import</option>
                        <option value="export">Export</option>
                      </Select>
                    </Box>
                  </HStack>
                  <Box width="100%">
                    <Text>Fichiers</Text>
                    <VStack align="start" spacing={2} width="100%">
                      {files.map((file, index) => (
                        <HStack key={index} spacing={3} border="1px solid #003366" p={2} borderRadius="md" width="100%">
                          <Text flex="1">{file.name || getFileName(file.url)}</Text>
                          <Icon
                            as={FaInfoCircle}
                            w={5}
                            h={5}
                            cursor="pointer"
                            color="blue.500"
                            _hover={{ color: 'blue.700' }}
                            onClick={() => handleShowFile(file)}
                          />
                          <Icon
                            as={FaTrashAlt}
                            w={5}
                            h={5}
                            cursor="pointer"
                            color="red.500"
                            _hover={{ color: 'red.700' }}
                            onClick={() => handleDeleteFile(file.url)}
                          />
                        </HStack>
                      ))}
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <Box p={5} border="2px dashed #003366" textAlign="center" borderRadius="md" width="100%">
                          Glissez et déposez des fichiers ici, ou cliquez pour sélectionner des fichiers
                        </Box>
                      </div>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
              <Box flex="1">
                <Text>Minuteur</Text>
                <Box border="1px solid #003366" p={4} borderRadius="md" textAlign="center" mb={5}>
                  <Countdown date={new Date(dossier.dateLimite)} />
                </Box>
                <Box>
                  <Text>Informations Supplémentaires</Text>
                  <VStack spacing={4}>
                    {formData.informations.map((info, index) => (
                      <Alert key={index} status="info" borderRadius="md" border="1px solid #003366">
                        <AlertIcon />
                        {info}
                      </Alert>
                    ))}
                  </VStack>
                </Box>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Enregistrer
            </Button>
            <Button variant="ghost" onClick={onClose}>Annuler</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={!!selectedFile} onClose={() => setSelectedFile(null)} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Afficher Fichier</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {renderFileViewer()}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelectedFile(null)}>Fermer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditPopup;
