import { useState, useEffect } from 'react';
import { Wallet, Plus, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Input from '../components/Input';

const PortfoliosPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState('');

  useEffect(() => {
    const mockPortfolios = [
      {
        id: '1',
        name: 'Growth Portfolio',
        totalValue: 75000,
        totalCost: 65000,
        totalReturn: 10000,
        returnPercentage: 15.38,
        holdings: [
          { fundId: '1', fundName: 'Tech Growth Fund', shares: 1000, avgCost: 2.20, currentValue: 2450 },
          { fundId: '2', fundName: 'Global Equity Fund', shares: 1500, avgCost: 1.75, currentValue: 2805 },
        ],
      },
      {
        id: '2',
        name: 'Stable Income',
        totalValue: 35000,
        totalCost: 34000,
        totalReturn: 1000,
        returnPercentage: 2.94,
        holdings: [
          { fundId: '4', fundName: 'Bond Stability Fund', shares: 5000, avgCost: 1.08, currentValue: 5600 },
        ],
      },
      {
        id: '3',
        name: 'Retirement Fund',
        totalValue: 15000,
        totalCost: 13500,
        totalReturn: 1500,
        returnPercentage: 11.11,
        holdings: [
          { fundId: '3', fundName: 'Index Fund 500', shares: 500, avgCost: 3.00, currentValue: 1605 },
        ],
      },
    ];

    setTimeout(() => {
      setPortfolios(mockPortfolios);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      const newPortfolio = {
        id: Date.now().toString(),
        name: newPortfolioName,
        totalValue: 0,
        totalCost: 0,
        totalReturn: 0,
        returnPercentage: 0,
        holdings: [],
      };
      setPortfolios([...portfolios, newPortfolio]);
      setNewPortfolioName('');
      setShowCreateModal(false);
    }
  };

  if (loading) {
    return <Loading text="Loading portfolios..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolios</h1>
          <p className="text-gray-600 mt-1">Manage your investment portfolios</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2 inline" />
          Create Portfolio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} hover className="cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
                  <p className="text-sm text-gray-500">{portfolio.holdings.length} holdings</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Value</span>
                <span className="font-semibold text-gray-900">
                  ${portfolio.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Return</span>
                <span className={`font-semibold ${portfolio.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${portfolio.totalReturn.toLocaleString()} ({portfolio.returnPercentage >= 0 ? '+' : ''}{portfolio.returnPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                {portfolio.holdings.slice(0, 2).map((holding, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{holding.fundName}</span>
                    <span className="font-medium text-gray-900">{holding.shares} shares</span>
                  </div>
                ))}
                {portfolio.holdings.length > 2 && (
                  <p className="text-xs text-gray-500">
                    +{portfolio.holdings.length - 2} more holdings
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" fullWidth>View Details</Button>
              <Button variant="primary" size="sm" fullWidth>
                <TrendingUp className="w-4 h-4 mr-1 inline" />
                Invest
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Portfolio"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)} fullWidth>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreatePortfolio} fullWidth>
              Create
            </Button>
          </div>
        }
      >
        <Input
          label="Portfolio Name"
          placeholder="Enter portfolio name"
          value={newPortfolioName}
          onChange={(e) => setNewPortfolioName(e.target.value)}
          required
        />
      </Modal>
    </div>
  );
};

export default PortfoliosPage;

