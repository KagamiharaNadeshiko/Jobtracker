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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const { register, error, isAuthenticated, loading, clearError } = useAuth();
  const navigate = useNavigate();

  // 如果已登录，则重定向到仪表盘
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const errors = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = '请输入用户名';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = '请输入邮箱';
      isValid = false;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = '请输入密码';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = '密码长度至少为6个字符';
      isValid = false;
    }

    if (!formData.passwordConfirm) {
      errors.passwordConfirm = '请确认密码';
      isValid = false;
    } else if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = '两次输入的密码不一致';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await register(formData.username, formData.email, formData.password);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除字段错误
    if (value.trim() || name === 'password' || name === 'passwordConfirm') {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
            <Heading size="xl">注册</Heading>
            <Text mt={2} color="gray.600">
              创建您的求职跟踪系统账户
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
              <FormControl isInvalid={!!formErrors.username} isRequired>
                <FormLabel>用户名</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="请输入用户名"
                />
                <FormErrorMessage>{formErrors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formErrors.email} isRequired>
                <FormLabel>邮箱</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
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
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="请输入密码（至少6个字符）"
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

              <FormControl isInvalid={!!formErrors.passwordConfirm} isRequired>
                <FormLabel>确认密码</FormLabel>
                <Input
                  name="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="请再次输入密码"
                />
                <FormErrorMessage>{formErrors.passwordConfirm}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                mt={4}
                isLoading={loading}
              >
                注册
              </Button>
            </Stack>
          </form>

          <Box textAlign="center" mt={6}>
            <Text>
              已有账户?{' '}
              <Link as={RouterLink} to="/login" color="blue.500">
                登录
              </Link>
            </Text>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Register; 