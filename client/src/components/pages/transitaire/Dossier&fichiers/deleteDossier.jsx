// DeletePopup.jsx
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';

const DeletePopup = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmation de Suppression</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Êtes-vous sûr de vouloir supprimer ce dossier ?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onDelete}>
            Supprimer
          </Button>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePopup;
