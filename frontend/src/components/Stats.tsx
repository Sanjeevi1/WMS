import React from 'react';

interface StatsProps {
  totalRequests: number;
  pendingRequests: number;
  activeDrivers: number;
  completedRequests: number;
}

const Stats: React.FC<StatsProps> = ({
  totalRequests,
  pendingRequests,
  activeDrivers,
  completedRequests
}) => {
  const stats = [
    {
      title: 'Total Requests',
      value: totalRequests,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Requests',
      value: pendingRequests,
      color: 'bg-yellow-500'
    },
    {
      title: 'Active Drivers',
      value: activeDrivers,
      color: 'bg-green-500'
    },
    {
      title: 'Completed Requests',
      value: completedRequests,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
            <span className="text-white text-xl font-bold">{stat.value}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Stats; 