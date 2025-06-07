import React from 'react';
import { ChakraProvider, Box, Container } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 导入自定义组件
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import Industries from './pages/Industries';
import Companies from './pages/Companies';
import Positions from './pages/Positions';
import PositionDetail from './pages/PositionDetail';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" bg="gray.50">
          <Navbar />
          <Container maxW="container.xl" pt={8} pb={10}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/industries/:industryId/companies" element={<Companies />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:companyId/positions" element={<Positions />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/positions/:positionId" element={<PositionDetail />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App; 