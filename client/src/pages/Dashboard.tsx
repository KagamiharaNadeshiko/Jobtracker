import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Flex, 
  Icon, 
  Text, 
  Card, 
  CardBody, 
  CardHeader, 
  Progress, 
  Divider,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaBuilding, FaFileAlt, FaClipboardList, FaUserTie } from 'react-icons/fa';
import { positionAPI } from '../services/api';
import StatusPieChart from '../components/charts/StatusPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    interviews: 0,
    offers: 0,
    rejected: 0
  });

  const [recentPositions, setRecentPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 状态饼图数据
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  
  // 月度柱状图数据
  const [barChartData, setBarChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await positionAPI.getAll();
        const positions = response.data;
        
        // 获取统计数据
        const total = positions.length;
        const pending = positions.filter((p: any) => p.status === '准备中' || p.status === '已投递').length;
        const inProgress = positions.filter((p: any) => p.status === '网测中').length;
        const interviews = positions.filter((p: any) => p.status === '面试中').length;
        const offers = positions.filter((p: any) => p.status === 'Offer').length;
        const rejected = positions.filter((p: any) => p.status === '拒绝').length;
        
        setStats({ total, pending, inProgress, interviews, offers, rejected });
        
        // 准备饼图数据
        setPieChartData([
          { name: '准备/投递', value: pending, color: '#3182CE' },
          { name: '网测中', value: inProgress, color: '#805AD5' },
          { name: '面试中', value: interviews, color: '#ED8936' },
          { name: 'Offer', value: offers, color: '#38A169' },
          { name: '拒绝', value: rejected, color: '#E53E3E' },
        ]);
        
        // 准备柱状图数据
        const monthlyData = prepareMonthlyData(positions);
        setBarChartData(monthlyData);
        
        // 获取最近的5个职位
        const recent = [...positions].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 5);
        
        setRecentPositions(recent);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 准备按月份的数据
  const prepareMonthlyData = (positions: any[]) => {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const currentYear = new Date().getFullYear();
    
    // 初始化每个月的数据
    const monthlyData = monthNames.map(month => ({
      month,
      applications: 0,
      interviews: 0,
      offers: 0
    }));
    
    // 统计每个月的数据
    positions.forEach(position => {
      const createdAt = new Date(position.createdAt);
      if (createdAt.getFullYear() === currentYear) {
        const month = createdAt.getMonth();
        
        // 增加申请数
        monthlyData[month].applications++;
        
        // 如果是面试中或已拿到Offer，增加面试数
        if (position.status === '面试中' || position.status === 'Offer') {
          monthlyData[month].interviews++;
        }
        
        // 如果拿到Offer，增加offer数
        if (position.status === 'Offer') {
          monthlyData[month].offers++;
        }
      }
    });
    
    return monthlyData;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case '准备中': return 'blue.400';
      case '已投递': return 'cyan.400';
      case '网测中': return 'purple.400';
      case '面试中': return 'orange.400';
      case 'Offer': return 'green.400';
      case '拒绝': return 'red.400';
      default: return 'gray.400';
    }
  };

  const getProgress = () => {
    if (stats.total === 0) return 0;
    return (stats.offers / stats.total) * 100;
  };

  const StatCard = ({ icon, title, value, helpText, color }: { icon: any, title: string, value: number, helpText: string, color: string }) => (
    <Card>
      <CardBody>
        <Flex align="center" mb={2}>
          <Box p={2} bg={`${color}.50`} borderRadius="lg" mr={3}>
            <Icon as={icon} boxSize={5} color={color} />
          </Box>
          <Heading size="sm">{title}</Heading>
        </Flex>
        <Stat>
          <StatNumber fontSize="2xl">{value}</StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );

  return (
    <Box>
      <Heading mb={6}>求职跟踪 - 总览</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <StatCard 
          icon={FaFileAlt} 
          title="总职位申请" 
          value={stats.total} 
          helpText="跟踪中的总职位数" 
          color="blue"
        />
        <StatCard 
          icon={FaClipboardList} 
          title="进行中申请" 
          value={stats.inProgress} 
          helpText="网测或筛选中" 
          color="purple"
        />
        <StatCard 
          icon={FaUserTie} 
          title="进入面试" 
          value={stats.interviews} 
          helpText="面试阶段职位" 
          color="orange"
        />
        <StatCard 
          icon={FaBuilding} 
          title="收到Offer" 
          value={stats.offers} 
          helpText="成功获得录用" 
          color="green"
        />
      </SimpleGrid>
      
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
        {/* 申请进度卡片 */}
        <GridItem>
          <Card>
            <CardHeader pb={0}>
              <Heading size="md">申请进度</Heading>
            </CardHeader>
            <CardBody>
              <Text mb={2}>Offer率: {stats.total ? ((stats.offers / stats.total) * 100).toFixed(1) : 0}%</Text>
              <Progress value={getProgress()} size="sm" colorScheme="green" borderRadius="full" />
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={5} mt={5}>
                <Stat>
                  <StatLabel color="blue.500">准备中</StatLabel>
                  <StatNumber>{stats.pending}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color="purple.500">网测中</StatLabel>
                  <StatNumber>{stats.inProgress}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color="orange.500">面试中</StatLabel>
                  <StatNumber>{stats.interviews}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color="green.500">Offer</StatLabel>
                  <StatNumber>{stats.offers}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel color="red.500">拒绝</StatLabel>
                  <StatNumber>{stats.rejected}</StatNumber>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        </GridItem>
        
        {/* 状态分布饼图 */}
        <GridItem>
          <StatusPieChart data={pieChartData} />
        </GridItem>
      </Grid>
      
      {/* 月度申请数据图表 */}
      <Box mb={8}>
        <MonthlyBarChart data={barChartData} />
      </Box>
      
      <Card>
        <CardHeader>
          <Heading size="md">最近更新的职位</Heading>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Text>加载中...</Text>
          ) : recentPositions.length === 0 ? (
            <Text>暂无职位数据</Text>
          ) : (
            recentPositions.map((position, index) => (
              <React.Fragment key={position._id}>
                <Box as={RouterLink} to={`/positions/${position._id}`}>
                  <Flex justify="space-between" py={3}>
                    <Flex direction="column">
                      <Text fontWeight="bold">{position.title}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {position.company?.name}
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Box px={2} py={1} borderRadius="md" bg={`${getStatusColor(position.status)}.100`}>
                        <Text fontSize="sm" fontWeight="medium" color={getStatusColor(position.status)}>
                          {position.status}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>
                {index < recentPositions.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard; 