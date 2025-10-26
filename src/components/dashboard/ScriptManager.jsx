import React, { useState, useEffect } from 'react';
import { getScripts, createScript, updateScript, deleteScript } from '../../services/scriptStorageService.js';

const ScriptManager = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getScripts();
      if (response.code === 200 && response.data.items) {
        setScripts(response.data.items);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteScript(id);
      loadScripts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading scripts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Scripts</h3>
      
      {scripts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No saved scripts
        </div>
      ) : (
        <div className="space-y-2">
          {scripts.map(script => (
            <div key={script.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
              <div>
                <div className="font-medium text-gray-900">{script.name}</div>
                {script.description && (
                  <div className="text-sm text-gray-500">{script.description}</div>
                )}
              </div>
              <button
                onClick={() => handleDelete(script.id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptManager;

