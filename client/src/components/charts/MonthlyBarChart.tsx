import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface MonthlyData {
  month: string;
  applications: number;
  interviews: number;
  offers: number;
}

interface MonthlyBarChartProps {
  data: MonthlyData[];
  title?: string;
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ 
  data, 
  title = "月度申请数据" 
}) => {
  if (!data || data.length === 0) {
    return (
      <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
        <Heading size="md" mb={4}>{title}</Heading>
        <Box textAlign="center" py={10}>
          暂无数据
        </Box>
      </Box>
    );
  }

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
      <Heading size="md" mb={4}>{title}</Heading>
      <Box height="300px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="applications" name="职位申请" fill="#3182CE" />
            <Bar dataKey="interviews" name="面试次数" fill="#ED8936" />
            <Bar dataKey="offers" name="收到Offer" fill="#38A169" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default MonthlyBarChart; 