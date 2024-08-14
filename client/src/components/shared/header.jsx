// src/components/Header.js
import React from 'react';
import { Box, Flex, Text, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useUser } from '../utils/UserContext';

const Header = () => {
    const { user, loading } = useUser();
    return (
        <Box margin={"10px 0"} px={4} py={2}>
            <Flex align="center" justify="space-between">   
                <Text fontSize="xl" color="black">
                    Bonjour, {user.nom} 👋🏼
                </Text>
                <InputGroup width="auto">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="black.300" />}
                    />
                    <Input border={"1px solid black"} type="text" placeholder="Search..." />
                </InputGroup>
            </Flex>
        </Box>
    );
};

export default Header;
