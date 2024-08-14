import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  VStack,
  Box,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

const RefusalPopup = ({ isOpen, onClose, dossier, setState }) => {
  const [reason, setReason] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const informations = reason ? [reason] : [];
      const values = {
        ...dossier,
        informations,
        dateLimite: newDate.toISOString(), // Ensure the date is in ISO format
        etat: 'Refusé',
      };

      const response = await axios.put(
        `http://localhost:5000/api/dossier/${dossier._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Log the response data

      if (response.status === 200) {
        toast({
          title: 'Dossier mis à jour.',
          description: 'Le dossier a été refusé avec succès.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setState(prevState => ({
          ...prevState,
          dossier: {
            ...dossier,
            informations,
            dateLimite: newDate,
            etat: 'Refusé',
          }
        }));
        onClose();
      }
    } catch (error) {
      console.error('Error updating dossier:', error);
      toast({
        title: 'Erreur.',
        description: "Une erreur s'est produite lors de la mise à jour du dossier.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg={useColorModeValue('white', 'gray.800')}
        borderRadius="md"
        shadow="lg"
        p={5}
      >
        <ModalHeader>Raison du Refus</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Raison de refus</FormLabel>
              <Input
                placeholder="Entrez la raison"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nouvelle date</FormLabel>
              <Box
                borderWidth="1px"
                borderRadius="md"
                p={2}
                w="100%"
                bg={useColorModeValue('white', 'gray.700')}
              >
                <DateTimePicker
                  value={newDate}
                  onChange={setNewDate}
                  format="dd/MM/yyyy"
                  className="react-datetime-picker"
                />
              </Box>
            </FormControl>
          </VStack>
          <HStack spacing={4} justifyContent="flex-end" mt={5}>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Enregistrer
            </Button>
            <Button onClick={onClose}>Annuler</Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RefusalPopup;
