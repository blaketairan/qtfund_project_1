import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const FundsPage = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFund, setSelectedFund] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const mockFunds = [
      {
        id: '1',
        code: 'TGF001',
        name: 'Tech Growth Fund',
        type: 'equity',
        netValue: 2.45,
        dailyChange: 1.2,
        yearReturn: 15.3,
        riskLevel: 'high',
      },
      {
        id: '2',
        code: 'GEF002',
        name: 'Global Equity Fund',
        type: 'mixed',
        netValue: 1.87,
        dailyChange: -0.5,
        yearReturn: 12.7,
        riskLevel: 'medium',
      },
      {
        id: '3',
        code: 'IDX003',
        name: 'Index Fund 500',
        type: 'index',
        netValue: 3.21,
        dailyChange: 0.8,
        yearReturn: 8.9,
        riskLevel: 'low',
      },
      {
        id: '4',
        code: 'BND004',
        name: 'Bond Stability Fund',
        type: 'bond',
        netValue: 1.12,
        dailyChange: 0.1,
        yearReturn: 4.2,
        riskLevel: 'low',
      },
    ];

    setTimeout(() => {
      setFunds(mockFunds);
      setLoading(false);
    }, 500);
  }, []);

  const filteredFunds = funds.filter(
    (fund) =>
      fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (fund) => {
    setSelectedFund(fund);
    setShowModal(true);
  };

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { 
      key: 'type', 
      label: 'Type',
      render: (value) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'netValue',
      label: 'Net Value',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'dailyChange',
      label: 'Daily Change',
      render: (value) => (
        <span className={`flex items-center ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {value >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {value >= 0 ? '+' : ''}{value}%
        </span>
      ),
    },
    {
      key: 'yearReturn',
      label: 'YTD Return',
      render: (value) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      ),
    },
    {
      key: 'riskLevel',
      label: 'Risk',
      render: (value) => {
        const colors = {
          low: 'bg-green-100 text-green-800',
          medium: 'bg-yellow-100 text-yellow-800',
          high: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${colors[value]}`}>
            {value}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return <Loading text="Loading funds..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Funds</h1>
          <p className="text-gray-600 mt-1">Browse and manage available funds</p>
        </div>
        <Button variant="primary">Add New Fund</Button>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search funds by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <Table columns={columns} data={filteredFunds} onRowClick={handleRowClick} />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Fund Details"
        size="lg"
      >
        {selectedFund && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fund Code</p>
                <p className="font-medium">{selectedFund.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fund Name</p>
                <p className="font-medium">{selectedFund.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium capitalize">{selectedFund.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="font-medium capitalize">{selectedFund.riskLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Value</p>
                <p className="font-medium">${selectedFund.netValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">YTD Return</p>
                <p className={`font-medium ${selectedFund.yearReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedFund.yearReturn >= 0 ? '+' : ''}{selectedFund.yearReturn}%
                </p>
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <Button variant="primary" fullWidth>Invest Now</Button>
              <Button variant="outline" fullWidth>View History</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FundsPage;

