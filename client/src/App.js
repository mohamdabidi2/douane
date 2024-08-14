import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogedIn from './components/pages/logedIn/logedin';
import { UserProvider } from './components/utils/UserContext';
const App = () => (
  <Router>
    <UserProvider>
      <LogedIn />
    </UserProvider>
  </Router>
);

export default App;