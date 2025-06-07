import React, { useState, useEffect } from 'react';
import { 
  Box, Heading, SimpleGrid, Text, Button, useDisclosure, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, 
  ModalCloseButton, ModalFooter, FormControl, FormLabel, Input,
  FormErrorMessage, Flex, Icon, Spinner, useToast
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaPlus, FaIndustry } from 'react-icons/fa';
import { industryAPI } from '../services/api';

interface Industry {
  _id: string;
  name: string;
  description: string;
  companies?: number;
}

const Industries: React.FC = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // 获取行业数据
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await industryAPI.getAll();
        setIndustries(res.data);
      } catch (error) {
        console.error('获取行业数据失败:', error);
        toast({
          title: '获取数据失败',
          description: '无法加载行业数据，请稍后再试。',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, [toast]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // 清除错误
    if (value.trim()) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors = {
      name: '',
      description: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = '行业名称不能为空';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = '行业描述不能为空';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await industryAPI.create(formData);
      setIndustries([...industries, res.data]);
      
      toast({
        title: '添加成功',
        description: `行业 ${formData.name} 已添加。`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 重置表单和关闭模态窗
      setFormData({ name: '', description: '' });
      onClose();
    } catch (error) {
      console.error('添加行业失败:', error);
      toast({
        title: '添加失败',
        description: '无法添加行业，请稍后再试。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Flex align="center" justify="space-between" mb={6}>
        <Heading>行业分类</Heading>
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="blue" 
          onClick={onOpen}
        >
          添加行业
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : industries.length === 0 ? (
        <Box textAlign="center" my={10} p={5} borderWidth="1px" borderRadius="lg">
          <Icon as={FaIndustry} boxSize={10} color="gray.400" mb={3} />
          <Heading size="md" mb={2}>暂无行业数据</Heading>
          <Text mb={4}>点击"添加行业"按钮创建你的第一个行业分类</Text>
          <Button colorScheme="blue" onClick={onOpen}>添加行业</Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {industries.map((industry) => (
            <Box
              key={industry._id}
              as={RouterLink}
              to={`/industries/${industry._id}/companies`}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                borderColor: 'blue.400'
              }}
              transition="all 0.3s"
            >
              <Flex align="center" mb={2}>
                <Icon as={FaIndustry} color="blue.500" boxSize={5} mr={2} />
                <Heading size="md">{industry.name}</Heading>
              </Flex>
              <Text noOfLines={2} color="gray.600" mb={4}>
                {industry.description}
              </Text>
              <Text fontSize="sm" color="blue.600">
                {industry.companies || 0} 家公司
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* 添加行业的模态窗 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>添加行业</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!formErrors.name} mb={4}>
              <FormLabel>行业名称</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="例如：互联网科技、金融服务"
              />
              <FormErrorMessage>{formErrors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.description}>
              <FormLabel>行业描述</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="简要描述该行业的特点"
              />
              <FormErrorMessage>{formErrors.description}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={submitting}>
              保存
            </Button>
            <Button onClick={onClose}>取消</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Industries; 