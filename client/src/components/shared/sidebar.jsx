import React, { useState } from 'react';
import { Box, Flex, Avatar, Text, VStack, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FiHome, FiFolder, FiPlusSquare, FiSettings, FiMenu } from "react-icons/fi";
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../utils/UserContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { user, loading } = useUser();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const dossiersFichiersPath = user.profile === "Douane" ? "/dossiers-fichiers-douane" : "/dossiers-fichiers";

    return (
        <Flex style={{ position: "fixed" }} direction="column" h="100vh" bg="white" color="#9197B3" p={4} w={isOpen ? "250px" : "80px"} transition="width 0.3s">
            <Box mb={8} textAlign="center" cursor="pointer">
                <Flex align="center" justify="center">
                    <FiMenu onClick={toggleSidebar} style={isOpen ? { display: "none" } : {}} />
                    {isOpen && (
                        <Text fontSize="2xl" fontWeight="bold" color="#003366" ml={2} onClick={toggleSidebar}>{user.profile}</Text>
                    )}
                </Flex>
            </Box>
            <VStack spacing={4} align="stretch" flex="1">
                <NavLink
                    to="/dashboard"
                    style={({ isActive }) => ({
                        textDecoration: 'none',
                        backgroundColor: isActive ? '#003366' : 'transparent',
                        color: isActive ? 'white' : '#9197B3',
                        padding: '8px',
                        borderRadius: 'md',
                        display: 'flex',
                        alignItems: 'center'
                    })}
                >
                    <FiHome />
                    {isOpen && <Text ml={2}>Tableau de bord</Text>}
                </NavLink>
                {user.profile === "Admin" &&
                    <NavLink
                        to="/users"
                        style={({ isActive }) => ({
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#003366' : 'transparent',
                            color: isActive ? 'white' : '#9197B3',
                            padding: '8px',
                            borderRadius: 'md',
                            display: 'flex',
                            alignItems: 'center'
                        })}
                    >
                        <FiFolder /> {/* Replace with an appropriate icon if needed */}
                        {isOpen && <Text ml={2}>Utilisateurs</Text>}
                    </NavLink>
                }
                <NavLink
                    to={dossiersFichiersPath}
                    style={({ isActive }) => ({
                        textDecoration: 'none',
                        backgroundColor: isActive ? '#003366' : 'transparent',
                        color: isActive ? 'white' : '#9197B3',
                        padding: '8px',
                        borderRadius: 'md',
                        display: 'flex',
                        alignItems: 'center'
                    })}
                >
                    <FiFolder />
                    {isOpen && <Text ml={2}>Fichiers et Dossiers</Text>}
                </NavLink>

                {user.profile !== "Douane" &&
                    <NavLink
                        to="/ajouter-dossier"
                        style={({ isActive }) => ({
                            textDecoration: 'none',
                            backgroundColor: isActive ? '#003366' : 'transparent',
                            color: isActive ? 'white' : '#9197B3',
                            padding: '8px',
                            borderRadius: 'md',
                            display: 'flex',
                            alignItems: 'center'
                        })}
                    >
                        <FiPlusSquare />
                        {isOpen && <Text ml={2}>Ajouter Dossier</Text>}
                    </NavLink>
                }

                <NavLink
                    to="/profile"
                    style={({ isActive }) => ({
                        textDecoration: 'none',
                        backgroundColor: isActive ? '#003366' : 'transparent',
                        color: isActive ? 'white' : '#9197B3',
                        padding: '8px',
                        borderRadius: 'md',
                        display: 'flex',
                        alignItems: 'center'
                    })}
                >
                    <FiSettings />
                    {isOpen && <Text ml={2}>Paramètres</Text>}
                </NavLink>

              
            </VStack>
            {isOpen && (
                <Box mt={8} textAlign="center">
                    <Menu>
                        <MenuButton mt={2}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar size="md" name={user.nom} src="path_to_avatar_image" />
                                <div style={{ textAlign: "left", paddingLeft: "5px" }}>
                                    <Text mt={2}>{user.nom} </Text>
                                    <Text fontSize="sm" color="gray.400">{user.profile} </Text>
                                </div>
                            </div>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            )}
        </Flex>
    );
}

export default Sidebar;
