import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';

function App() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="container.md" p={8} borderRadius="md" boxShadow="md" bg="white">
        <VStack spacing={6} align="center">
          <Heading as="h1" size="xl">求职跟踪系统</Heading>
          <Text fontSize="lg">欢迎使用求职跟踪系统。该应用目前正在构建中。</Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default App; 