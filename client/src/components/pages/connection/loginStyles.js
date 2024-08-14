import styled from 'styled-components';
import { Input, InputGroup, Button,Text } from '@chakra-ui/react';
import PhoneInput from 'react-phone-input-2';
export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #003366;
`;

export const LoginBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #003366;
    width: 300px;
    border-radius: 8px;
    animation: zoomInUp;
`;

export const BoxCenter = styled.div`
    display: flex;
justify-content:center
`;
export const RegisterBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: space-between;
    padding: 20px;
    background-color: #003366;
    width: 600px;
    color:gray;
    border-radius: 8px;
    animation: zoomInUp;
`;
export const BoxContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content:space-between;
    
    align-items:center
`;

export const Logo = styled.img`
    height: 150px;
    width:150px;
    margin-bottom: 20px;
`;

export const ChakraInput = styled(Input)`
    background-color: #003366;
    color: white;
    border: 2px solid white;
    width:200px;
    border-radius: 2px;
    ::placeholder {
        color: white;
    }
`;
export const RegisterLink = styled(Text)`
    cursor: pointer;
    margin-top: 1rem;
    color: white;
    text-decoration: underline;
    /* Your styles here */
`;

export const PhoneInputRegister = styled(PhoneInput)`
    background-color: #003366;
    color: white;
    border: 2px solid white;
    width:200px;
    border-radius: 2px;
    ::placeholder {
        color: white;
    }
`;



export const RegisterInput = styled(Input)`
    background-color: #003366;
    color: white;
    border: 2px solid white;
    width:200px;
    padding: 0 10px;
    border-radius: 2px;
    ::placeholder {
        color: white;
    }
`;
export const ChakraInputGroup = styled(InputGroup)`
    margin-bottom: 20px;
    width: 100%;
`;
export const RegisterInputGroup = styled(InputGroup)`
    margin-bottom: 20px;
    width: 98%;
      padding: 0 10px;
`;

export const ChakraButton = styled(Button)`
    background-color: white;
    color: #003366;
    width: 100%;
    border-radius: 2px;
`;

export const EyeIcon = styled.span`
    color: white;
    cursor: pointer;
`;

export const ForgotPassword = styled.div`
    align-self: flex-end;
    color: white;
    margin-top: 10px;
    cursor: pointer;
`;
export const ErrorText = styled.div`
    color: white;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: left;
    width: 100%;
`;
export const ErrorTextRegister = styled.div`
    color: red;
    font-size: 12px;
    margin-top: -10px;
    text-align: left;
    width: 100%;
`;
