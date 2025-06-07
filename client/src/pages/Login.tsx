import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  Text,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  Container,
  Card,
  CardBody,
  Stack
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  const { login, error, isAuthenticated, loading, clearError } = useAuth();
  const navigate = useNavigate();

  // 如果已登录，则重定向到仪表盘
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: ''
    };
    let isValid = true;

    if (!email.trim()) {
      errors.email = '请输入邮箱';
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = '请输入有效的邮箱地址';
      isValid = false;
    }

    if (!password) {
      errors.password = '请输入密码';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await login(email, password);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
      if (value.trim()) {
        setFormErrors(prev => ({ ...prev, email: '' }));
      }
    } else if (name === 'password') {
      setPassword(value);
      if (value) {
        setFormErrors(prev => ({ ...prev, password: '' }));
      }
    }

    if (error) {
      clearError();
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Card>
        <CardBody>
          <Box textAlign="center" mb={6}>
            <Heading size="xl">登录</Heading>
            <Text mt={2} color="gray.600">
              登录您的求职跟踪系统账户
            </Text>
          </Box>

          {error && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!formErrors.email} isRequired>
                <FormLabel>邮箱</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="请输入您的邮箱"
                />
                <FormErrorMessage>{formErrors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formErrors.password} isRequired>
                <FormLabel>密码</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handleInputChange}
                    placeholder="请输入您的密码"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? '隐藏密码' : '显示密码'}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formErrors.password}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                mt={4}
                isLoading={loading}
              >
                登录
              </Button>
            </Stack>
          </form>

          <Box textAlign="center" mt={6}>
            <Text>
              还没有账户?{' '}
              <Link as={RouterLink} to="/register" color="blue.500">
                注册
              </Link>
            </Text>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login; 