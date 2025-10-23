import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Wallet } from 'lucide-react';
import Card from '../components/Card';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { useAuth } from '../utils/authContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalValue: 125000,
    totalReturn: 12500,
    returnPercentage: 10.5,
    activeInvestments: 8,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  const statCards = [
    {
      title: 'Total Portfolio Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Return',
      value: `$${stats.totalReturn.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: `+${stats.returnPercentage}%`,
    },
    {
      title: 'Active Investments',
      value: stats.activeInvestments,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Portfolios',
      value: '3',
      icon: Wallet,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username || 'User'}</p>
        </div>
      </div>

      <Alert
        type="info"
        message="This is a demo dashboard. Connect to your backend API to see real data."
        dismissible
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" subtitle="Your latest transactions">
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Fund Purchase</p>
                    <p className="text-sm text-gray-500">Tech Growth Fund</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">$5,000</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Performers" subtitle="Best performing funds this month">
          <div className="space-y-3">
            {[
              { name: 'Tech Growth Fund', return: 15.3 },
              { name: 'Global Equity Fund', return: 12.7 },
              { name: 'Index Fund 500', return: 8.9 },
            ].map((fund, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-900">{fund.name}</p>
                </div>
                <p className="font-medium text-green-600">+{fund.return}%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

