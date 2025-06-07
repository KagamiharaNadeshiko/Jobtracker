import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface StatusPieChartProps {
  data: StatusData[];
  title?: string;
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({ 
  data, 
  title = "申请状态分布" 
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} 个职位`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default StatusPieChart; 