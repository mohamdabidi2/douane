import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    VStack,
    Image,
    Input,
    InputGroup,
    Button,
    InputRightElement,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Text,
    useToast,
    Container,
    HStack
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import logo from '../../../assets/login.png';

const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'Anglais' },
];

const profileOptions = [
    { value: 'Transitaire', label: 'Transitaire' },
    { value: 'Douane', label: 'Douane' }
];

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        numphone: '',
        entreprise: '',
        pays: '',
        langue: [],
        email: '',
        password: '',
        profile: { value: 'Transitaire', label: 'Transitaire' }
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const countries = countryList().getData();
    const toast = useToast();

    const handleClick = () => setShowPassword(!showPassword);

    const validate = () => {
        const newErrors = {};
        if (!formData.nom) newErrors.nom = 'Requis';
        if (!formData.numphone) newErrors.numphone = 'Requis';
        if (!formData.entreprise) newErrors.entreprise = 'Requis';
        if (!formData.pays) newErrors.pays = 'Requis';
        if (formData.langue.length < 1) newErrors.langue = 'Au moins une langue requise';
        if (!formData.email) newErrors.email = 'Requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Adresse email invalide';
        if (!formData.password) newErrors.password = 'Requis';
        else if (formData.password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        if (!formData.profile || !formData.profile.value) newErrors.profile = 'Requis';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData({ ...formData, [name]: selectedOption });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formattedValues = {
            ...formData,
            langue: formData.langue.map(lang => lang.value),
            profile: formData.profile.value,
            pays: formData.pays.value
        };

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formattedValues);
            navigate('/login');
            toast({
                title: "Inscription réussie.",
                description: "Vous pouvez maintenant vous connecter.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Erreur d\'inscription :', error);
            setErrors({ form: 'Échec de l\'inscription. Veuillez réessayer.' });
        }
    };

    return (
        <div style={{width:"100%",minHeight:"100%",backgroundColor:"#003366"}}>
        <Container maxW="md" >
            <Box
                p={8}
              
           
           
                bg="#003366"
                w="100%"
            >
                <VStack spacing={4}>
                    <Image src={logo} alt="logo" boxSize="150px" />
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <VStack spacing={4}>
                            <FormControl id="nom" isInvalid={!!errors.nom}>
                                <FormLabel style={{ color: "white" }}>Nom</FormLabel>
                                <Input
                                    name="nom"
                                    type="text"
                                    placeholder="Nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    bg="white"
                                />
                                <FormErrorMessage>{errors.nom}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="numphone" isInvalid={!!errors.numphone}>
                                <FormLabel style={{ color: "white" }}>Numéro de téléphone</FormLabel>
                                <PhoneInput
                                    country={'fr'}
                                    value={formData.numphone}
                                    onChange={(value) => handleSelectChange('numphone', value)}
                                    inputProps={{
                                        name: 'numphone',
                                        required: true,
                                    }}
                                    containerStyle={{ width: '100%' }}
                                    inputStyle={{ width: '100%', background: 'white' }}
                                />
                                <FormErrorMessage>{errors.numphone}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="entreprise" isInvalid={!!errors.entreprise}>
                                <FormLabel style={{ color: "white" }}>Entreprise</FormLabel>
                                <Input
                                    name="entreprise"
                                    type="text"
                                    placeholder="Entreprise"
                                    value={formData.entreprise}
                                    onChange={handleChange}
                                    bg="white"
                                />
                                <FormErrorMessage>{errors.entreprise}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="pays" isInvalid={!!errors.pays}>
                                <FormLabel style={{ color: "white" }}>Pays</FormLabel>
                                <Select
                                    name="pays"
                                    options={countries}
                                    value={countries.find(country => country.value === formData.pays)}
                                    onChange={(selectedOption) => handleSelectChange('pays', selectedOption)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            background: 'white',
                                        })
                                    }}
                                />
                                <FormErrorMessage>{errors.pays}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="langue" isInvalid={!!errors.langue}>
                                <FormLabel style={{ color: "white" }}>Langue</FormLabel>
                                <Select
                                    isMulti
                                    options={languageOptions}
                                    value={formData.langue}
                                    onChange={(selectedOptions) => handleSelectChange('langue', selectedOptions)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            background: 'white',
                                        })
                                    }}
                                />
                                <FormErrorMessage>{errors.langue}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="email" isInvalid={!!errors.email}>
                                <FormLabel style={{ color: "white" }}>Email</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    bg="white"
                                />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="password" isInvalid={!!errors.password}>
                                <FormLabel style={{ color: "white" }}>Mot de passe</FormLabel>
                                <InputGroup>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Mot de passe"
                                        value={formData.password}
                                        onChange={handleChange}
                                        bg="white"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                                            {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>{errors.password}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="profile" isInvalid={!!errors.profile}>
                                <FormLabel style={{ color: "white" }}>Profil</FormLabel>
                                <Select
                                    options={profileOptions}
                                    value={profileOptions.find(option => option.value === formData.profile.value)}
                                    onChange={(selectedOption) => handleSelectChange('profile', selectedOption)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            background: 'white',
                                        })
                                    }}
                                />
                                <FormErrorMessage>{errors.profile}</FormErrorMessage>
                            </FormControl>

                            {errors.form && (
                                <Text color="red.500" fontSize="sm">{errors.form}</Text>
                            )}

                            <Button type="submit" colorScheme="teal" size="md" width="100%">
                                S'INSCRIRE
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                variant="link"
                                mt={4}
                                colorScheme="blue"
                            >
                                Retour à la page de connexion
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
        </div>
    );
};

export default Register;
