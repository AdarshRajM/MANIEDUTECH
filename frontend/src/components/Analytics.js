import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { TrendingUp, School, Stars } from '@mui/icons-material';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [topicData, setTopicData] = useState([]);

  useEffect(() => {
    // Simulated fetching of recommendation/analytics data from backend
    setTimeout(() => {
      setData([
        { name: 'Test 1', React: 4000, Spring: 2400, amt: 2400 },
        { name: 'Test 2', React: 3000, Spring: 1398, amt: 2210 },
        { name: 'Test 3', React: 2000, Spring: 9800, amt: 2290 },
        { name: 'Test 4', React: 2780, Spring: 3908, amt: 2000 },
        { name: 'Test 5', React: 1890, Spring: 4800, amt: 2181 },
        { name: 'Test 6', React: 2390, Spring: 3800, amt: 2500 },
        { name: 'Test 7', React: 3490, Spring: 4300, amt: 2100 },
      ]);
      setTopicData([
        { subject: 'ReactHooks', A: 120, B: 110, fullMark: 150 },
        { subject: 'Spring JPA', A: 98, B: 130, fullMark: 150 },
        { subject: 'Microservices', A: 86, B: 130, fullMark: 150 },
        { subject: 'JavaScript', A: 139, B: 90, fullMark: 150 },
        { subject: 'SQL', A: 85, B: 90, fullMark: 150 },
        { subject: 'Docker', A: 65, B: 85, fullMark: 150 },
      ]);
    }, 800);
  }, []);

  if (data.length === 0) {
    return <div className="text-center mt-20 text-gray-500">Loading Analytics Engine...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Performance Analytics</h1>
        <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-4 py-2 rounded-full font-semibold flex items-center shadow-sm">
          <Stars className="mr-2" />
          Global Rank: 42
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center">
            <TrendingUp fontSize="large" className="text-green-500 mb-2" />
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Average Score</h3>
            <p className="text-4xl font-extrabold mt-1 text-gray-900 dark:text-white">84.5%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center">
            <School fontSize="large" className="text-purple-500 mb-2" />
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Courses Passed</h3>
            <p className="text-4xl font-extrabold mt-1 text-gray-900 dark:text-white">12</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-start text-white relative overflow-hidden">
            <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wider">AI Insight</h3>
            <p className="text-xl font-bold mt-2">Docker limits your score.</p>
            <p className="text-sm mt-1 opacity-90">Watch 3 more videos on Containerization to improve.</p>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
              <Stars sx={{ fontSize: 120 }} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Score Progression</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="React" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Spring" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Topic Radar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Topic Competency Analysis</h2>
          <div className="h-80 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicData}>
                <PolarGrid stroke="#8884d8" opacity={0.3} />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="My Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
};

export default Analytics;
