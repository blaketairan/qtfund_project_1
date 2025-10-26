import { getApiBaseUrl } from '../config/apiConfig.js';

const API_BASE = getApiBaseUrl();

export const executeScript = async (scriptConfig) => {
  const { script, script_id, column_name, stock_symbols } = scriptConfig;
  
  const body = script_id 
    ? { script_id, column_name, stock_symbols }
    : { script, column_name, stock_symbols };

  const response = await fetch(`${API_BASE}/custom-calculations/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return data;
};

export const validateScript = (script) => {
  if (!script || script.trim().length === 0) {
    return { valid: false, error: 'Script cannot be empty' };
  }
  
  if (!script.includes('return')) {
    return { valid: false, error: 'Script must include a return statement' };
  }
  
  return { valid: true };
};

