import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, ModalFooter, FormControl, FormLabel, Input,
  FormErrorMessage, Select, Flex, Icon, Badge, Spinner, useToast,
  InputGroup, InputLeftElement, Text, Menu, MenuButton, MenuList, MenuItem,
  MenuDivider, IconButton, HStack
} from '@chakra-ui/react';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaBuilding, FaSearch, FaArrowLeft, FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { positionAPI, companyAPI } from '../services/api';

interface Company {
  _id: string;
  name: string;
}

interface Position {
  _id: string;
  title: string;
  company: Company;
  description: string;
  location: string;
  deadline?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  '准备中',
  '已投递',
  '网测中',
  '面试中',
  'Offer',
  '拒绝'
];

const Positions: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    company: companyId || '',
    description: '',
    location: '',
    deadline: '',
    status: '准备中'
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    status: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // 获取公司和职位数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取公司列表
        const companiesRes = await companyAPI.getAll();
        setCompanies(companiesRes.data);

        // 如果有指定公司ID，则获取该公司的详细信息
        if (companyId) {
          const companyRes = await companyAPI.getById(companyId);
          setSelectedCompany(companyRes.data);
          
          // 获取该公司下的职位
          const positionsRes = await positionAPI.getByCompany(companyId);
          setPositions(positionsRes.data);
        } else {
          // 否则获取所有职位
          const positionsRes = await positionAPI.getAll();
          setPositions(positionsRes.data);
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
  }, [companyId, toast]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // 清除错误
    if (value.trim() && (name !== 'deadline')) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors = {
      title: '',
      company: '',
      description: '',
      location: '',
      status: ''
    };
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = '职位名称不能为空';
      isValid = false;
    }

    if (!formData.company) {
      errors.company = '请选择公司';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = '职位描述不能为空';
      isValid = false;
    }

    if (!formData.location.trim()) {
      errors.location = '工作地点不能为空';
      isValid = false;
    }

    if (!formData.status) {
      errors.status = '请选择状态';
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
      const res = await positionAPI.create(formData);
      setPositions([...positions, res.data]);
      
      toast({
        title: '添加成功',
        description: `职位 ${formData.title} 已添加。`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // 重置表单和关闭模态窗
      setFormData({ 
        title: '', 
        company: companyId || '', 
        description: '', 
        location: '', 
        deadline: '',
        status: '准备中'
      });
      onClose();
    } catch (error) {
      console.error('添加职位失败:', error);
      toast({
        title: '添加失败',
        description: '无法添加职位，请稍后再试。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 删除职位
  const handleDelete = async (id: string) => {
    try {
      await positionAPI.delete(id);
      setPositions(positions.filter(position => position._id !== id));
      toast({
        title: '删除成功',
        description: '职位已成功删除',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('删除职位失败:', error);
      toast({
        title: '删除失败',
        description: '无法删除职位，请稍后再试。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch(status) {
      case '准备中': return 'blue';
      case '已投递': return 'cyan';
      case '网测中': return 'purple';
      case '面试中': return 'orange';
      case 'Offer': return 'green';
      case '拒绝': return 'red';
      default: return 'gray';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 过滤职位
  const filteredPositions = positions.filter(position => 
    position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    position.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    position.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    position.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Flex align="center" mb={2}>
        {selectedCompany && (
          <Button 
            leftIcon={<FaArrowLeft />} 
            variant="link" 
            onClick={() => navigate('/companies')}
            mb={2}
          >
            返回公司列表
          </Button>
        )}
      </Flex>

      <Flex align="center" justify="space-between" mb={6}>
        <Heading>
          {selectedCompany ? `${selectedCompany.name} - 职位申请` : '所有职位申请'}
        </Heading>
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="blue" 
          onClick={onOpen}
        >
          添加职位
        </Button>
      </Flex>

      <InputGroup mb={6}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="搜索职位名称、公司、地点或状态"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <Flex justify="center" my={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : filteredPositions.length === 0 ? (
        <Box textAlign="center" my={10} p={5} borderWidth="1px" borderRadius="lg">
          <Icon as={FaBuilding} boxSize={10} color="gray.400" mb={3} />
          <Heading size="md" mb={2}>暂无职位数据</Heading>
          <Text mb={4}>
            {searchQuery 
              ? '没有匹配的搜索结果，请尝试其他关键词' 
              : '点击"添加职位"按钮创建你的第一个职位申请记录'}
          </Text>
          {!searchQuery && <Button colorScheme="blue" onClick={onOpen}>添加职位</Button>}
        </Box>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>职位名称</Th>
                <Th>公司</Th>
                <Th>工作地点</Th>
                <Th>截止日期</Th>
                <Th>状态</Th>
                <Th>更新日期</Th>
                <Th width="50px">操作</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPositions.map((position) => (
                <Tr key={position._id}>
                  <Td>
                    <RouterLink to={`/positions/${position._id}`}>
                      <Text color="blue.500" fontWeight="medium" _hover={{ textDecoration: 'underline' }}>
                        {position.title}
                      </Text>
                    </RouterLink>
                  </Td>
                  <Td>{position.company.name}</Td>
                  <Td>{position.location}</Td>
                  <Td>{formatDate(position.deadline || '')}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(position.status)}>
                      {position.status}
                    </Badge>
                  </Td>
                  <Td>{formatDate(position.updatedAt)}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label='操作'
                        icon={<FaEllipsisV />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem 
                          icon={<FaEye />} 
                          as={RouterLink} 
                          to={`/positions/${position._id}`}
                        >
                          查看详情
                        </MenuItem>
                        <MenuItem 
                          icon={<FaEdit />} 
                          as={RouterLink} 
                          to={`/positions/${position._id}/edit`}
                        >
                          编辑职位
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem 
                          icon={<FaTrash />} 
                          color="red.500"
                          onClick={() => handleDelete(position._id)}
                        >
                          删除职位
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* 添加职位的模态窗 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>添加职位申请</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={!!formErrors.title} mb={4}>
              <FormLabel>职位名称</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="职位名称"
              />
              <FormErrorMessage>{formErrors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.company} mb={4}>
              <FormLabel>所属公司</FormLabel>
              <Select
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="请选择公司"
                isDisabled={!!companyId}
              >
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formErrors.company}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.description} mb={4}>
              <FormLabel>职位描述</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="简要描述职位要求"
              />
              <FormErrorMessage>{formErrors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formErrors.location} mb={4}>
              <FormLabel>工作地点</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="例如：北京、远程"
              />
              <FormErrorMessage>{formErrors.location}</FormErrorMessage>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>截止日期 (可选)</FormLabel>
              <Input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl isInvalid={!!formErrors.status} mb={4}>
              <FormLabel>申请状态</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formErrors.status}</FormErrorMessage>
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

export default Positions; 