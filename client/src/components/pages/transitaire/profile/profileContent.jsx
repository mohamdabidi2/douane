import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Text,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Stack,
  Grid,
  Input,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import Select from 'react-select';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useUser } from '../../../utils/UserContext';
import countryList from 'react-select-country-list';
import languageList from 'language-list';

const ProfileContent = () => {
  const { user, setUser } = useUser();
  const toast = useToast();

  const countries = countryList().getData();
  const languages = languageList().getData().map(lang => ({ value: lang.code, label: lang.language }));

  const [formValues, setFormValues] = useState({
    nom: user?.nom || '',
    numphone: user?.numphone || '',
    entreprise: user?.entreprise || '',
    pays: user?.pays ? countries.find(country => country.value === user.pays) : null,
    langue: user?.langue ? languages.filter(lang => user.langue.includes(lang.value)) : [],
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleSelectChange = (name, option) => {
    setFormValues(prevValues => ({ ...prevValues, [name]: option }));
  };

  const handleMultiSelectChange = (name, options) => {
    setFormValues(prevValues => ({ ...prevValues, [name]: options }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.nom) newErrors.nom = 'Le nom est requis';
    if (!formValues.numphone) newErrors.numphone = 'Le numéro de téléphone est requis';
    if (!formValues.entreprise) newErrors.entreprise = 'L\'entreprise est requise';
    if (!formValues.pays) newErrors.pays = 'Le pays est requis';
    if (formValues.langue.length === 0) newErrors.langue = 'Au moins une langue est requise';
    if (!formValues.email) newErrors.email = 'L\'email est requis';
    if (formValues.currentPassword && !formValues.newPassword) newErrors.newPassword = 'Le nouveau mot de passe est requis';
    if (formValues.newPassword !== formValues.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submissionValues = {
      nom: formValues.nom,
      numphone: formValues.numphone,
      entreprise: formValues.entreprise,
      pays: formValues.pays?.value || '',
      langue: formValues.langue.map(lang => lang.value),
      email: formValues.email,
      profile: user?.profile || '',
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword
    };

    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submissionValues)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        toast({
          title: 'Profil mis à jour',
          description: 'Vos informations ont été mises à jour avec succès.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      } else {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Box
        bgImage="url('../../assets/profiletop.png')"
        bgSize="cover"
        bgPosition="center"
        p={8}
        borderRadius="md"
      ></Box>

      <Box bg="white" p={6} borderRadius="md">
        <Flex justify="space-between" align="center" mb={8}>
          <Flex align="center">
            <Avatar name={user?.nom || 'User'} src="" size="xl" mr={4} />
            <Box>
              <Text fontSize="2xl" fontWeight="bold">{user?.nom || 'Nom'}</Text>
              <Text fontSize="lg" color="gray.600">{user?.email || 'Email'}</Text>
            </Box>
          </Flex>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <Box>
              <Text fontSize="xl" mb={4}>Informations personnelles</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl isInvalid={errors.nom}>
                  <FormLabel>Nom</FormLabel>
                  <Input
                    name="nom"
                    value={formValues.nom}
                    onChange={handleChange}
                    placeholder="Entrez votre nom"
                  />
                  <FormErrorMessage>{errors.nom}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.numphone}>
                  <FormLabel>Numéro de téléphone</FormLabel>
                  <PhoneInput
                    country={'tn'}
                    regions={['africa']}
                    inputStyle={{ width: '100%' }}
                    value={formValues.numphone}
                    onChange={(numphone) => setFormValues(prev => ({ ...prev, numphone }))}
                  />
                  <FormErrorMessage>{errors.numphone}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.entreprise}>
                  <FormLabel>Entreprise</FormLabel>
                  <Input
                    name="entreprise"
                    value={formValues.entreprise}
                    onChange={handleChange}
                    placeholder="Entrez votre entreprise"
                  />
                  <FormErrorMessage>{errors.entreprise}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.pays}>
                  <FormLabel>Pays</FormLabel>
                  <Select
                    value={formValues.pays}
                    options={countries}
                    onChange={(option) => handleSelectChange('pays', option)}
                    placeholder="Sélectionner le pays"
                  />
                  <FormErrorMessage>{errors.pays}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.langue}>
                  <FormLabel>Langue</FormLabel>
                  <Select
                    value={formValues.langue}
                    options={languages}
                    isMulti
                    onChange={(options) => handleMultiSelectChange('langue', options)}
                    placeholder="Sélectionner les langues"
                  />
                  <FormErrorMessage>{errors.langue}</FormErrorMessage>
                </FormControl>
              </Grid>
            </Box>

            <Box>
              <Text fontSize="xl" mb={4}>Informations de connexion</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="Entrez votre email"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.currentPassword}>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={formValues.currentPassword}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.newPassword}>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <Input
                    name="newPassword"
                    type="password"
                    value={formValues.newPassword}
                    onChange={handleChange}
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.confirmPassword}>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </Grid>
            </Box>
            <Button bg="#003366" color="white" type="submit">Modifier</Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default ProfileContent;
