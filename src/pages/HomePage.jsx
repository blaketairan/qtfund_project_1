import { Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart3, Wallet } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const HomePage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Investment Tracking',
      description: 'Track all your fund investments in one place with real-time updates',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Bank-level security to protect your financial data',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed analytics and reports on your investment performance',
    },
    {
      icon: Wallet,
      title: 'Portfolio Management',
      description: 'Create and manage multiple portfolios with ease',
    },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to QTFund
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A comprehensive financial management system for tracking and managing your fund investments
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} hover className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </section>

      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Why Choose QTFund?
        </h2>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-600">
          <p>
            QTFund provides a professional-grade platform for managing your fund investments.
            Whether you're an individual investor or a financial professional, our tools help
            you make informed decisions.
          </p>
          <p>
            With real-time data, comprehensive analytics, and intuitive portfolio management,
            QTFund makes it easy to stay on top of your investments and achieve your financial goals.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

