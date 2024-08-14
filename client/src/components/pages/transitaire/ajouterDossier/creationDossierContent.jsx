import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Stack,
  Text,
  useToast,
  useColorModeValue,
  HStack,
  Badge,
  Divider,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaUpload, FaTrashAlt } from 'react-icons/fa';
import { BsBoxArrowInRight, BsBoxArrowLeft } from "react-icons/bs";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { useUser } from '../../../utils/UserContext';

const MultiStepForm = () => {
  const { user, loading } = useUser();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const toast = useToast();
  const formBg = useColorModeValue('white', 'gray.800');
  const formHeight = "500px";
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.nom || '',
        email: user.email || '',
        phone: user.numphone || '',
        company: user.entreprise || '',
      });
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phone: Yup.string().required('Required'),
      company: Yup.string().required('Required'),
    }),
    onSubmit: async values => {
      const formData = new FormData();
      formData.append('nom', values.name);
      formData.append('prenom', values.email);
      formData.append('numphone', values.phone);
      formData.append('entreprise', values.company);
      formData.append('typeDossier', selectedType);

      files.forEach(file => {
        formData.append('files', file);
      });

      try {
        const response = await fetch('http://localhost:5000/api/dossier', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          toast({
            title: "Dossier soumis.",
            description: "Vous recevrez une réponse dans les 24 à 48 heures.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          navigate("/dossiers-fichiers")
        } else {
          throw new Error('Erreur lors de la soumission du dossier');
        }
      } catch (error) {
        toast({
          title: "Erreur.",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => setFiles([...files, ...acceptedFiles])
  });

  const handleNext = () => {
    if (step === 1) {
      formik.validateForm().then(errors => {
        if (Object.keys(errors).length === 0) {
          setStep(step + 1);
        } else {
          formik.setTouched({
            name: true,
            email: true,
            phone: true,
            company: true
          });
        }
      });
    } else if (step === 2 && !selectedType) {
      toast({
        title: "Veuillez sélectionner un type de dossier.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  if (loading) {
    return <Center>Loading...</Center>;
  }

  return (
    <Box p={8} maxWidth="100%" m="0 20px" bg={formBg} borderRadius="lg" boxShadow="lg">
      <Center>
        <Text fontSize="2xl" fontWeight="bold" color="#003366">
          Ajouter un nouveau dossier
        </Text>
      </Center>
      <Center>
        <Text fontSize="md" color="gray.500" mt={2}>
          Veuillez remplir le formulaire ci-dessous pour ajouter un nouveau dossier avec tous les fichiers.
        </Text>
      </Center>
      <div className='multiformdesign'>
        <HStack spacing={4} mt={8} mb={4} justify="center">
          {[1, 2, 3, 4].map((s, index) => (
            <Center key={s} flexDirection="row">
              <Badge
                bg={step >= s ? "#003366" : "gray.300"}
                color={step >= s ? "white" : "gray.600"}
                fontSize="lg"
                borderRadius="full"
                px={4}
                py={2}
              >
                {s}
              </Badge>
              {index < 3 && (
                <Box margin={"0 10px"} width="100px" mt={2}>
                  <Divider orientation="horizontal" borderColor={step > index + 1 ? "#003366" : "gray.300"} borderWidth="2px" />
                  {step > index + 1 && (
                    <Box width="104px" height="3px" bg="#003366" mt={-1} />
                  )}
                </Box>
              )}
            </Center>
          ))}
        </HStack>

        <Box mt={8} height={formHeight}>
          {step === 1 && (
            <form>
              <Box>
                <Text fontSize="xl" fontWeight="bold" color="#003366">Détails du contact</Text>
                <Text fontSize="md" color="gray.500" mb={4}>Veuillez remplir vos informations afin que nous puissions vous contacter.</Text>
                <Stack spacing={4}>
                  <HStack spacing={4}>
                    <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                      <FormLabel>Nom</FormLabel>
                      <InputGroup>
                        <Input id="name" name="name" disabled placeholder="Nom" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                        <InputRightElement pointerEvents="none" children={<Icon as={FaUser} />} />
                      </InputGroup>
                    </FormControl>
                    <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                      <FormLabel>Email</FormLabel>
                      <InputGroup>
                        <Input id="email" name="email" disabled placeholder="Email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                        <InputRightElement pointerEvents="none" children={<Icon as={FaEnvelope} />} />
                      </InputGroup>
                    </FormControl>
                  </HStack>
                  <HStack spacing={4}>
                    <FormControl isInvalid={formik.touched.phone && formik.errors.phone}>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <InputGroup>
                        <Input id="phone" name="phone" disabled placeholder="Numéro de téléphone" onBlur={formik.handleBlur} value={formik.values.phone} />
                        <InputRightElement pointerEvents="none" children={<Icon as={FaPhone} />} />
                      </InputGroup>
                    </FormControl>
                    <FormControl isInvalid={formik.touched.company && formik.errors.company}>
                      <FormLabel>Entreprise</FormLabel>
                      <InputGroup>
                        <Input id="company" name="company" disabled placeholder="Entreprise" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.company} />
                        <InputRightElement pointerEvents="none" children={<Icon as={FaBuilding} />} />
                      </InputGroup>
                    </FormControl>
                  </HStack>
                </Stack>
              </Box>
            </form>
          )}

          {step === 2 && (
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="#003366">Type de dossier</Text>
              <Text fontSize="md" color="gray.500" mb={4}>Veuillez sélectionner le type que vous choisissez</Text>
              <Stack direction="row" spacing={4} justify="center">
                <Box
                  textAlign="center"
                  p={6}
                  style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}
                  width={200}
                  height={200}
                  borderWidth="1px"
                  borderRadius="lg"
                  cursor="pointer"
                  bg={selectedType === 'import' ? "#003366" : "white"}
                  color={selectedType === 'import' ? "white" : "black"}
                  onClick={() => setSelectedType('import')}
                >
                  <Icon as={BsBoxArrowInRight} boxSize={10} />
                  <Text mt={2}>Import</Text>
                </Box>
                <Box
                  textAlign="center"
                  p={6}
                  width={200}
                  style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}
                  height={200}
                  borderWidth="1px"
                  borderRadius="lg"
                  cursor="pointer"
                  bg={selectedType === 'export' ? "#003366" : "white"}
                  color={selectedType === 'export' ? "white" : "black"}
                  onClick={() => setSelectedType('export')}
                >
                  <Icon as={BsBoxArrowLeft} boxSize={10} />
                  <Text mt={2}>Export</Text>
                </Box>
              </Stack>
            </Box>
          )}

          {step === 3 && (
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="#003366">Télécharger les fichiers</Text>
              <Text fontSize="md" color="gray.500" mb={4}>Veuillez télécharger les fichiers nécessaires pour ce dossier.</Text>
              <Box {...getRootProps()} borderWidth="2px" borderRadius="lg" p={4} textAlign="center" borderStyle="dashed" cursor="pointer" height={"200px"} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <input {...getInputProps()} />
                <Icon as={FaUpload} boxSize={8} color={"#003366"} />
                <Text mt={2}>Glisser-déposer des fichiers ou Parcourir</Text>
                <Text fontSize="sm" color="gray.500">Formats pris en charge : JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT</Text>
              </Box>
              <Box mt={4}>
                {files.map((file, index) => (
                  <Box key={index} p={4} borderWidth="1px" borderRadius="lg" mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Text>{file.name}</Text>
                    <Icon as={FaTrashAlt} cursor="pointer" onClick={() => setFiles(files.filter(f => f !== file))} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {step === 4 && (
            <Box textAlign="center" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
              <img src='../../assets/submit.png' width={"150px"} alt="Submit" />
              <Text fontSize="xl" fontWeight="bold" mt={4} color="#003366">Soumettez votre demande</Text>
              <Text fontSize="md" color="gray.500" mb={4}>Veuillez revoir toutes les informations que vous avez saisies lors des étapes précédentes et, si tout va bien, soumettez votre demande pour recevoir une réponse dans les 24 à 48 heures.</Text>
              <Button colorScheme="blue" bg="#003366" onClick={formik.handleSubmit}>Soumettre</Button>
            </Box>
          )}
        </Box>
      </div>
      <Box mt={8} display="flex" justifyContent="space-between">
        {step > 1 && <Button onClick={handlePrev} color={"#003366"} borderRadius={"56px"} border={"2px solid #003366"} bg="white">Étape précédente</Button>}
        {step < 4 && <Button onClick={handleNext} colorScheme="blue" bg="#003366" borderRadius={"56px"} border={"2px solid #003366"}>Étape suivante</Button>}
      </Box>
    </Box>
  );
};

export default MultiStepForm;
