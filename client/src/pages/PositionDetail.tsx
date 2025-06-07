import React, { useState, useEffect } from 'react';
import {
  Box, Heading, Text, Button, Tabs, TabList, TabPanels, Tab, TabPanel,
  Badge, Flex, Icon, Stack, Grid, GridItem, Divider, useToast,
  Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Spinner,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, FormControl, FormLabel, Input, 
  Textarea, FormErrorMessage, Select
} from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaFileAlt, 
  FaLaptopCode, FaUserTie, FaArrowLeft, FaPlus
} from 'react-icons/fa';
import { positionAPI, essayAPI, onlineTestAPI, interviewAPI } from '../services/api';

// 面板类型
type PanelType = 'essay' | 'onlineTest' | 'interview';

interface Company {
  _id: string;
  name: string;
  industry: {
    _id: string;
    name: string;
  } | string;
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

interface Essay {
  _id: string;
  position: string;
  title: string;
  content: string;
  wordCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OnlineTest {
  _id: string;
  position: string;
  testType: string;
  platform: string;
  date: string;
  duration: number;
  content?: string;
  score?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Interview {
  _id: string;
  position: string;
  round: string;
  type: string;
  date: string;
  duration: number;
  interviewers?: string;
  questions?: string;
  notes?: string;
  result?: string;
  createdAt: string;
  updatedAt: string;
}

const PositionDetail: React.FC = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  // 职位数据状态
  const [position, setPosition] = useState<Position | null>(null);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [onlineTests, setOnlineTests] = useState<OnlineTest[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // 模态框状态
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<PanelType>('essay');
  const [submitting, setSubmitting] = useState(false);
  
  // 表单状态 - 申请文书
  const [essayForm, setEssayForm] = useState({
    title: '',
    content: '',
    wordCount: 0,
    notes: ''
  });
  
  // 表单状态 - 网测
  const [onlineTestForm, setOnlineTestForm] = useState({
    testType: '',
    platform: '',
    date: '',
    duration: 60,
    content: '',
    score: '',
    notes: ''
  });
  
  // 表单状态 - 面试
  const [interviewForm, setInterviewForm] = useState({
    round: '一面',
    type: '线上面试',
    date: '',
    duration: 60,
    interviewers: '',
    questions: '',
    notes: '',
    result: '等待结果'
  });
  
  // 表单错误状态
  const [formErrors, setFormErrors] = useState({
    title: '',
    content: '',
    testType: '',
    platform: '',
    date: '',
    round: '',
    type: ''
  });

  // 获取职位和相关数据
  useEffect(() => {
    if (!positionId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取职位详情
        const positionRes = await positionAPI.getById(positionId);
        setPosition(positionRes.data);
        
        // 获取申请文书
        const essaysRes = await essayAPI.getByPosition(positionId);
        setEssays(essaysRes.data);
        
        // 获取网测
        const testsRes = await onlineTestAPI.getByPosition(positionId);
        setOnlineTests(testsRes.data);
        
        // 获取面试
        const interviewsRes = await interviewAPI.getByPosition(positionId);
        setInterviews(interviewsRes.data);
        
      } catch (error) {
        console.error('获取数据失败:', error);
        toast({
          title: '获取数据失败',
          description: '无法加载职位详情数据，请稍后再试。',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [positionId, toast]);

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
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

  // 打开添加内容模态框
  const handleOpenModal = (type: PanelType) => {
    setModalType(type);
    onOpen();
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors = {
      title: '',
      content: '',
      testType: '',
      platform: '',
      date: '',
      round: '',
      type: ''
    };
    let isValid = true;

    switch(modalType) {
      case 'essay':
        if (!essayForm.title.trim()) {
          errors.title = '标题不能为空';
          isValid = false;
        }
        if (!essayForm.content.trim()) {
          errors.content = '内容不能为空';
          isValid = false;
        }
        break;
      
      case 'onlineTest':
        if (!onlineTestForm.testType.trim()) {
          errors.testType = '测试类型不能为空';
          isValid = false;
        }
        if (!onlineTestForm.platform.trim()) {
          errors.platform = '平台不能为空';
          isValid = false;
        }
        if (!onlineTestForm.date) {
          errors.date = '日期不能为空';
          isValid = false;
        }
        break;
      
      case 'interview':
        if (!interviewForm.round.trim()) {
          errors.round = '面试轮次不能为空';
          isValid = false;
        }
        if (!interviewForm.type.trim()) {
          errors.type = '面试类型不能为空';
          isValid = false;
        }
        if (!interviewForm.date) {
          errors.date = '日期不能为空';
          isValid = false;
        }
        break;
    }

    setFormErrors(errors);
    return isValid;
  };

  // 处理表单输入变化 - 申请文书
  const handleEssayInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 自动计算字数
    if (name === 'content') {
      setEssayForm({
        ...essayForm,
        [name]: value,
        wordCount: value.trim().length
      });
    } else {
      setEssayForm({
        ...essayForm,
        [name]: value
      });
    }

    // 清除错误
    if (value.trim() && (name === 'title' || name === 'content')) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // 处理表单输入变化 - 网测
  const handleTestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOnlineTestForm({
      ...onlineTestForm,
      [name]: value
    });

    // 清除错误
    if (value.trim() && (name === 'testType' || name === 'platform' || name === 'date')) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // 处理表单输入变化 - 面试
  const handleInterviewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInterviewForm({
      ...interviewForm,
      [name]: value
    });

    // 清除错误
    if (value.trim() && (name === 'round' || name === 'type' || name === 'date')) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm() || !positionId) return;

    setSubmitting(true);
    try {
      let newItem;
      
      switch(modalType) {
        case 'essay':
          newItem = await essayAPI.create({
            ...essayForm,
            position: positionId
          });
          setEssays([...essays, newItem.data]);
          setEssayForm({
            title: '',
            content: '',
            wordCount: 0,
            notes: ''
          });
          break;
          
        case 'onlineTest':
          newItem = await onlineTestAPI.create({
            ...onlineTestForm,
            position: positionId
          });
          setOnlineTests([...onlineTests, newItem.data]);
          setOnlineTestForm({
            testType: '',
            platform: '',
            date: '',
            duration: 60,
            content: '',
            score: '',
            notes: ''
          });
          
          // 如果职位状态是"已投递"，更新为"网测中"
          if (position?.status === '已投递') {
            await positionAPI.update(positionId, { ...position, status: '网测中' });
            setPosition({ ...position, status: '网测中' });
          }
          break;
          
        case 'interview':
          newItem = await interviewAPI.create({
            ...interviewForm,
            position: positionId
          });
          setInterviews([...interviews, newItem.data]);
          setInterviewForm({
            round: '一面',
            type: '线上面试',
            date: '',
            duration: 60,
            interviewers: '',
            questions: '',
            notes: '',
            result: '等待结果'
          });
          
          // 如果职位状态不是"面试中"，更新为"面试中"
          if (position?.status !== '面试中') {
            await positionAPI.update(positionId, { ...position, status: '面试中' });
            setPosition({ ...position, status: '面试中' });
          }
          break;
      }
      
      toast({
        title: '添加成功',
        description: '信息已成功添加。',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error('添加失败:', error);
      toast({
        title: '添加失败',
        description: '无法添加信息，请稍后再试。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="60vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!position) {
    return (
      <Box textAlign="center" my={10}>
        <Heading size="lg" mb={4}>未找到职位</Heading>
        <Button as={RouterLink} to="/positions" colorScheme="blue">
          返回职位列表
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="link" 
        onClick={() => navigate('/positions')}
        mb={4}
      >
        返回职位列表
      </Button>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
        <Flex justify="space-between" align="start" mb={4}>
          <Box>
            <Heading size="lg">{position.title}</Heading>
            <Flex align="center" mt={2}>
              <Icon as={FaBuilding} color="gray.600" mr={1} />
              <Text fontWeight="medium">
                {position.company.name}
              </Text>
            </Flex>
          </Box>
          <Badge colorScheme={getStatusColor(position.status)} p={2} fontSize="md">
            {position.status}
          </Badge>
        </Flex>

        <Stack spacing={3} mb={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <Flex align="center">
                <Icon as={FaMapMarkerAlt} color="gray.600" mr={2} />
                <Text>工作地点: {position.location}</Text>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Icon as={FaCalendarAlt} color="gray.600" mr={2} />
                <Text>截止日期: {position.deadline ? formatDate(position.deadline) : '无'}</Text>
              </Flex>
            </GridItem>
          </Grid>
          
          <Divider my={2} />
          
          <Heading size="sm" mb={1}>职位描述</Heading>
          <Text>{position.description}</Text>
        </Stack>
      </Box>

      <Box bg="white" borderRadius="lg" boxShadow="md">
        <Tabs isFitted variant="enclosed" colorScheme="blue" onChange={idx => setActiveTab(idx)}>
          <TabList>
            <Tab>
              <Flex align="center">
                <Icon as={FaFileAlt} mr={2} />
                申请文书
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center">
                <Icon as={FaLaptopCode} mr={2} />
                网测
              </Flex>
            </Tab>
            <Tab>
              <Flex align="center">
                <Icon as={FaUserTie} mr={2} />
                面试
              </Flex>
            </Tab>
          </TabList>
          <TabPanels>
            {/* 申请文书面板 */}
            <TabPanel>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">申请文书列表</Heading>
                <Button 
                  leftIcon={<FaPlus />} 
                  colorScheme="blue" 
                  onClick={() => handleOpenModal('essay')}
                  size="sm"
                >
                  添加文书
                </Button>
              </Flex>

              {essays.length === 0 ? (
                <Box textAlign="center" py={10} borderWidth="1px" borderRadius="md">
                  <Text mb={4}>暂无申请文书记录</Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => handleOpenModal('essay')}
                    size="sm"
                  >
                    添加文书
                  </Button>
                </Box>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>标题</Th>
                      <Th>字数</Th>
                      <Th>创建时间</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {essays.map(essay => (
                      <Tr key={essay._id} _hover={{ bg: "gray.50" }} cursor="pointer">
                        <Td fontWeight="medium">{essay.title}</Td>
                        <Td>{essay.wordCount}</Td>
                        <Td>{formatDate(essay.createdAt)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* 网测面板 */}
            <TabPanel>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">网测记录</Heading>
                <Button 
                  leftIcon={<FaPlus />} 
                  colorScheme="blue" 
                  onClick={() => handleOpenModal('onlineTest')}
                  size="sm"
                >
                  添加网测
                </Button>
              </Flex>

              {onlineTests.length === 0 ? (
                <Box textAlign="center" py={10} borderWidth="1px" borderRadius="md">
                  <Text mb={4}>暂无网测记录</Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => handleOpenModal('onlineTest')}
                    size="sm"
                  >
                    添加网测
                  </Button>
                </Box>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>测试类型</Th>
                      <Th>平台</Th>
                      <Th>日期</Th>
                      <Th>时长(分钟)</Th>
                      <Th>成绩</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {onlineTests.map(test => (
                      <Tr key={test._id} _hover={{ bg: "gray.50" }} cursor="pointer">
                        <Td fontWeight="medium">{test.testType}</Td>
                        <Td>{test.platform}</Td>
                        <Td>{formatDate(test.date)}</Td>
                        <Td>{test.duration}</Td>
                        <Td>{test.score || '未记录'}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* 面试面板 */}
            <TabPanel>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">面试记录</Heading>
                <Button 
                  leftIcon={<FaPlus />} 
                  colorScheme="blue" 
                  onClick={() => handleOpenModal('interview')}
                  size="sm"
                >
                  添加面试
                </Button>
              </Flex>

              {interviews.length === 0 ? (
                <Box textAlign="center" py={10} borderWidth="1px" borderRadius="md">
                  <Text mb={4}>暂无面试记录</Text>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => handleOpenModal('interview')}
                    size="sm"
                  >
                    添加面试
                  </Button>
                </Box>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>轮次</Th>
                      <Th>类型</Th>
                      <Th>日期</Th>
                      <Th>时长(分钟)</Th>
                      <Th>结果</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {interviews.map(interview => (
                      <Tr key={interview._id} _hover={{ bg: "gray.50" }} cursor="pointer">
                        <Td fontWeight="medium">{interview.round}</Td>
                        <Td>{interview.type}</Td>
                        <Td>{formatDate(interview.date)}</Td>
                        <Td>{interview.duration}</Td>
                        <Td>
                          <Badge 
                            colorScheme={
                              interview.result === '通过' ? 'green' : 
                              interview.result === '拒绝' ? 'red' : 'yellow'
                            }
                          >
                            {interview.result || '等待结果'}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* 添加内容的模态窗 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'essay' ? '添加申请文书' : 
             modalType === 'onlineTest' ? '添加网测记录' : '添加面试记录'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {modalType === 'essay' && (
              <>
                <FormControl isInvalid={!!formErrors.title} mb={4}>
                  <FormLabel>文书标题</FormLabel>
                  <Input
                    name="title"
                    value={essayForm.title}
                    onChange={handleEssayInputChange}
                    placeholder="例如：个人陈述、自我介绍"
                  />
                  <FormErrorMessage>{formErrors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!formErrors.content} mb={4}>
                  <FormLabel>文书内容</FormLabel>
                  <Textarea
                    name="content"
                    value={essayForm.content}
                    onChange={handleEssayInputChange}
                    placeholder="输入文书内容"
                    minHeight="200px"
                  />
                  <FormErrorMessage>{formErrors.content}</FormErrorMessage>
                  <Text fontSize="sm" mt={2}>字数统计: {essayForm.wordCount}</Text>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>备注</FormLabel>
                  <Textarea
                    name="notes"
                    value={essayForm.notes}
                    onChange={handleEssayInputChange}
                    placeholder="可选备注信息"
                  />
                </FormControl>
              </>
            )}

            {modalType === 'onlineTest' && (
              <>
                <FormControl isInvalid={!!formErrors.testType} mb={4}>
                  <FormLabel>测试类型</FormLabel>
                  <Input
                    name="testType"
                    value={onlineTestForm.testType}
                    onChange={handleTestInputChange}
                    placeholder="例如：逻辑测试、技术笔试"
                  />
                  <FormErrorMessage>{formErrors.testType}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!formErrors.platform} mb={4}>
                  <FormLabel>测试平台</FormLabel>
                  <Input
                    name="platform"
                    value={onlineTestForm.platform}
                    onChange={handleTestInputChange}
                    placeholder="例如：牛客网、HackerRank"
                  />
                  <FormErrorMessage>{formErrors.platform}</FormErrorMessage>
                </FormControl>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isInvalid={!!formErrors.date} mb={4}>
                      <FormLabel>测试日期</FormLabel>
                      <Input
                        name="date"
                        type="date"
                        value={onlineTestForm.date}
                        onChange={handleTestInputChange}
                      />
                      <FormErrorMessage>{formErrors.date}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl mb={4}>
                      <FormLabel>时长（分钟）</FormLabel>
                      <Input
                        name="duration"
                        type="number"
                        value={onlineTestForm.duration}
                        onChange={handleTestInputChange}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                <FormControl mb={4}>
                  <FormLabel>测试内容</FormLabel>
                  <Textarea
                    name="content"
                    value={onlineTestForm.content}
                    onChange={handleTestInputChange}
                    placeholder="测试题目和内容概述（可选）"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>成绩</FormLabel>
                  <Input
                    name="score"
                    value={onlineTestForm.score}
                    onChange={handleTestInputChange}
                    placeholder="例如：85分、合格"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>备注</FormLabel>
                  <Textarea
                    name="notes"
                    value={onlineTestForm.notes}
                    onChange={handleTestInputChange}
                    placeholder="其他备注信息（可选）"
                  />
                </FormControl>
              </>
            )}

            {modalType === 'interview' && (
              <>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isInvalid={!!formErrors.round} mb={4}>
                      <FormLabel>面试轮次</FormLabel>
                      <Select
                        name="round"
                        value={interviewForm.round}
                        onChange={handleInterviewInputChange}
                      >
                        <option value="一面">一面</option>
                        <option value="二面">二面</option>
                        <option value="三面">三面</option>
                        <option value="四面">四面</option>
                        <option value="五面">五面</option>
                        <option value="HR面">HR面</option>
                        <option value="主管面">主管面</option>
                        <option value="终面">终面</option>
                      </Select>
                      <FormErrorMessage>{formErrors.round}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl isInvalid={!!formErrors.type} mb={4}>
                      <FormLabel>面试类型</FormLabel>
                      <Select
                        name="type"
                        value={interviewForm.type}
                        onChange={handleInterviewInputChange}
                      >
                        <option value="线上面试">线上面试</option>
                        <option value="电话面试">电话面试</option>
                        <option value="现场面试">现场面试</option>
                        <option value="群面">群面</option>
                        <option value="案例面试">案例面试</option>
                      </Select>
                      <FormErrorMessage>{formErrors.type}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isInvalid={!!formErrors.date} mb={4}>
                      <FormLabel>面试日期</FormLabel>
                      <Input
                        name="date"
                        type="date"
                        value={interviewForm.date}
                        onChange={handleInterviewInputChange}
                      />
                      <FormErrorMessage>{formErrors.date}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl mb={4}>
                      <FormLabel>时长（分钟）</FormLabel>
                      <Input
                        name="duration"
                        type="number"
                        value={interviewForm.duration}
                        onChange={handleInterviewInputChange}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                <FormControl mb={4}>
                  <FormLabel>面试官</FormLabel>
                  <Input
                    name="interviewers"
                    value={interviewForm.interviewers}
                    onChange={handleInterviewInputChange}
                    placeholder="面试官姓名或职位（可选）"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>面试问题</FormLabel>
                  <Textarea
                    name="questions"
                    value={interviewForm.questions}
                    onChange={handleInterviewInputChange}
                    placeholder="记录面试中的问题（可选）"
                    minHeight="100px"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>备注</FormLabel>
                  <Textarea
                    name="notes"
                    value={interviewForm.notes}
                    onChange={handleInterviewInputChange}
                    placeholder="面试感受、表现评估等（可选）"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>面试结果</FormLabel>
                  <Select
                    name="result"
                    value={interviewForm.result}
                    onChange={handleInterviewInputChange}
                  >
                    <option value="等待结果">等待结果</option>
                    <option value="通过">通过</option>
                    <option value="拒绝">拒绝</option>
                  </Select>
                </FormControl>
              </>
            )}
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

export default PositionDetail; 