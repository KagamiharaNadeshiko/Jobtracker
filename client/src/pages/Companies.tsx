import React, { useState, useEffect } from 'react';
import {
  Box, Heading, SimpleGrid, Text, Button, Badge, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, ModalFooter, FormControl, FormLabel, Input,
  FormErrorMessage, Select, Flex, Icon, Spinner, useToast,
  InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaBuilding, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { companyAPI, industryAPI } from '../services/api';

interface Industry {
  _id: string;
  name: string;
}

interface Company {
  _id: string;
  name: string;
  industry: Industry | string;
  description: string;
  location: string;
  website?: string;
  positions?: number;
}

const Companies: React.FC = () => {
  const { industryId } = useParams<{ industryId: string }>();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    industry: industryId || '',
    description: '',
    location: '',
    website: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    industry: '',
    description: '',
    location: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // 获取行业和公司数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取行业列表
        const industriesRes = await industryAPI.getAll();
        setIndustries(industriesRes.data);

        // 如果有指定行业ID，则获取该行业的详细信息
        if (industryId) {
          const industryRes = await industryAPI.getById(industryId);
          setSelectedIndustry(industryRes.data);
          
          // 获取该行业下的公司
          const companiesRes = await companyAPI.getByIndustry(industryId);
          setCompanies(companiesRes.data);
        } else {
          // 否则获取所有公司
          const companiesRes = await companyAPI.getAll();
          setCompanies(companiesRes.data);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        toast({
          title: '获取数据失败',
          description: '无法加载数据，请稍后再试。',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [industryId, toast]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // 清除错误
    if (value.trim() && (name !== 'website')) {
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
      industry: '',
      description: '',
      location: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = '公司名称不能为空';
      isValid = false;
    }

    if (!formData.industry) {
      errors.industry = '请选择行业';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = '公司描述不能为空';
      isValid = false;
    }

    if (!formData.location.trim()) {
      errors.location = '公司地点不能为空';
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
      const res = await companyAPI.create(formData);
      setCompanies([...companies, res.data]);
      
      toast({
        title: '添加成功',
        description: `公司 ${formData.name} 已添加。`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 重置表单和关闭模态窗
      setFormData({ 
        name: '', 
        industry: industryId || '', 
        description: '', 
        location: '', 
        website: '' 
      });
      onClose();
    } catch (error) {
      console.error('添加公司失败:', error);
      toast({
        title: '添加失败',
        description: '无法添加公司，请稍后再试。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 过滤公司
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (typeof company.industry === 'object' && company.industry?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Flex align="center" mb={2}>
        {selectedIndustry && (
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="link" 
            onClick={() => navigate('/industries')}
            mb={2}
          >
            返回行业列表
          </Button>
        )}
      </Flex>

      <Flex align="center" justify="space-between" mb={6}>
        <Heading>
          {selectedIndustry ? `${selectedIndustry.name} - 公司列表` : '全部公司'}
        </Heading>
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="blue" 
          onClick={onOpen}
        >
          添加公司
        </Button>
      </Flex>

      <InputGroup mb={6}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="搜索公司名称、行业或地点"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : filteredCompanies.length === 0 ? (
        <Box textAlign="center" my={10} p={5} borderWidth="1px" borderRadius="lg">
          <Icon as={FaBuilding} boxSize={10} color="gray.400" mb={3} />
          <Heading size="md" mb={2}>暂无公司数据</Heading>
          <Text mb={4}>
            {searchQuery 
              ? '没有匹配的搜索结果，请尝试其他关键词' 
              : '点击"添加公司"按钮创建你的第一个公司记录'}
          </Text>
          {!searchQuery && <Button colorScheme="blue" onClick={onOpen}>添加公司</Button>}
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredCompanies.map((company) => (
            <Box
              key={company._id}
              as={RouterLink}
              to={`/companies/${company._id}/positions`}
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
                <Icon as={FaBuilding} color="blue.500" boxSize={5} mr={2} />
                <Heading size="md" noOfLines={1}>{company.name}</Heading>
              </Flex>
              
              <Badge colorScheme="blue" mb={3}>
                {typeof company.industry === 'object' ? company.industry.name : '未知行业'}
              </Badge>
              
              <Text noOfLines={2} color="gray.600" mb={3}>
                {company.description}
              </Text>
              
              <Text fontSize="sm" color="gray.500" mb={2}>
                地点: {company.location}
              </Text>
              
              <Text fontSize="sm" color="blue.600">
                {company.positions || 0} 个职位
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* 添加公司的模态窗 */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>添加公司</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!formErrors.name} mb={4}>
              <FormLabel>公司名称</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="公司全称"
              />
              <FormErrorMessage>{formErrors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.industry} mb={4}>
              <FormLabel>所属行业</FormLabel>
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="请选择行业"
              >
                {industries.map((industry) => (
                  <option key={industry._id} value={industry._id}>
                    {industry.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formErrors.industry}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.description} mb={4}>
              <FormLabel>公司描述</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="简要描述公司业务"
              />
              <FormErrorMessage>{formErrors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.location} mb={4}>
              <FormLabel>公司地点</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="例如：北京、上海"
              />
              <FormErrorMessage>{formErrors.location}</FormErrorMessage>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>公司网站 (可选)</FormLabel>
              <Input
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="例如：https://www.example.com"
              />
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

export default Companies; 