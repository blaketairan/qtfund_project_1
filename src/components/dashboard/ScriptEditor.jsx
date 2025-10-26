import React, { useState } from 'react';
import { executeScript, validateScript } from '../../services/scriptService.js';

const ScriptEditor = ({ onScriptExecuted }) => {
  const [script, setScript] = useState('');
  const [columnName, setColumnName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setError(null);
    setLoading(true);
    
    const validation = validateScript(script);
    if (!validation.valid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    try {
      const response = await executeScript({
        script,
        column_name: columnName || 'Custom Column',
        stock_symbols: []
      });
      
      if (response.code === 200) {
        onScriptExecuted(response.data);
      } else {
        setError(response.message || 'Script execution failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Script Editor</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Column Name
          </label>
          <input
            type="text"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            placeholder="Enter column name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Python Script
          </label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="return row['close_price'] / row['volume']"
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}
        
        <button
          onClick={handleExecute}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Executing...' : 'Execute Script'}
        </button>
      </div>
    </div>
  );
};

export default ScriptEditor;

