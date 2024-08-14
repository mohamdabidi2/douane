import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
    Container,
    LoginBox,
    Logo,
    ChakraInput,
    ChakraInputGroup,
    ChakraButton,
    EyeIcon,
    ForgotPassword,
    ErrorText
} from './loginStyles';
import logo from '../../../assets/login.png';
import 'animate.css';
import { InputLeftElement, InputRightElement, useToast } from '@chakra-ui/react';
import { EmailIcon, UnlockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const toast = useToast(); // Utilisez le hook useToast pour les notifications toast

    const handleClick = () => setShow(!show);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Adresse email invalide')
                .required('Champ requis'),
            password: Yup.string()
                .min(6, 'Le mot de passe doit comporter au moins 6 caractères')
                .required('Champ requis')
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/login', values);
                const { token } = response.data;
                localStorage.setItem('token', token);
                toast({
                    title: 'Connexion réussie',
                    description: 'Vous allez être redirigé.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (error) {
                console.error('Erreur lors de la connexion :', error);
                toast({
                    title: 'Erreur de connexion',
                    description: error.response?.data?.error || 'Une erreur est survenue lors de la connexion.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                });
            }
        }
    });

    return (
        <Container>
            <LoginBox className="animate__animated animate__zoomInUp">
                <Logo src={logo} alt="logo" />
                <form onSubmit={formik.handleSubmit}>
                    <ChakraInputGroup>
                        <InputLeftElement pointerEvents="none">
                            <EmailIcon color="gray.300" />
                        </InputLeftElement>
                        <ChakraInput
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </ChakraInputGroup>
                    {formik.touched.email && formik.errors.email ? (
                        <ErrorText>{formik.errors.email}</ErrorText>
                    ) : null}

                    <ChakraInputGroup>
                        <InputLeftElement pointerEvents="none">
                            <UnlockIcon color="gray.300" />
                        </InputLeftElement>
                        <ChakraInput
                            id="password"
                            name="password"
                            type={show ? 'text' : 'password'}
                            placeholder="Entrez le mot de passe"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <InputRightElement width="4.5rem">
                            <EyeIcon onClick={handleClick}>
                                {show ? <ViewOffIcon /> : <ViewIcon />}
                            </EyeIcon>
                        </InputRightElement>
                    </ChakraInputGroup>
                    {formik.touched.password && formik.errors.password ? (
                        <ErrorText>{formik.errors.password}</ErrorText>
                    ) : null}

                    <ChakraButton type="submit" size="md" height="48px">
                        SE CONNECTER
                    </ChakraButton>
                </form>
                <ForgotPassword onClick={() => navigate('/register')}>Pas encore de compte? S'inscrire</ForgotPassword>
            </LoginBox>
        </Container>
    );
};

export default Login;
