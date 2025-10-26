const API_BASE = 'http://localhost:8000/api';

export const createScript = async (script) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(script)
  });
  return await response.json();
};

export const getScripts = async () => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts`);
  return await response.json();
};

export const getScript = async (id) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts/${id}`);
  return await response.json();
};

export const updateScript = async (id, script) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(script)
  });
  return await response.json();
};

export const deleteScript = async (id) => {
  const response = await fetch(`${API_BASE}/custom-calculations/scripts/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};

