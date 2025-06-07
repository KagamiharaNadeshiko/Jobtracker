import React from 'react';
import { Box, Flex, Text, Link as ChakraLink, Button, Icon, Spacer, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaHome, FaIndustry, FaBuilding, FaFileAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const location = useLocation();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 检查当前路径是否匹配
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // 导航链接
  const navItems = [
    { name: '首页', path: '/', icon: FaHome },
    { name: '行业分类', path: '/industries', icon: FaIndustry },
    { name: '公司列表', path: '/companies', icon: FaBuilding },
    { name: '职位申请', path: '/positions', icon: FaFileAlt },
  ];

  return (
    <Box as="nav" w="100%" bg={bg} boxShadow="sm" px={4} position="sticky" top="0" zIndex="sticky" borderBottomWidth="1px" borderColor={borderColor}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="brand.500">
            求职跟踪
          </Text>
        </Flex>

        <Flex alignItems="center">
          {navItems.map((item) => (
            <ChakraLink
              as={RouterLink}
              to={item.path}
              key={item.path}
              mx={3}
              display="flex"
              alignItems="center"
              fontWeight={isActive(item.path) ? "bold" : "normal"}
              color={isActive(item.path) ? "brand.500" : "gray.600"}
              _hover={{ textDecoration: 'none', color: 'brand.500' }}
            >
              <Icon as={item.icon} mr={1} />
              <Text>{item.name}</Text>
            </ChakraLink>
          ))}
        </Flex>

        <Spacer />

        <Button
          as={RouterLink}
          to="/positions/new"
          colorScheme="blue"
          size="sm"
          leftIcon={<Icon as={FaFileAlt} />}
        >
          添加职位
        </Button>
      </Flex>
    </Box>
  );
};

export default Navbar; 