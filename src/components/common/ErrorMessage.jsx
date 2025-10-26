import React from 'react';

const ErrorMessage = ({ message, type = 'error' }) => {
  const style = {
    marginTop: '15px',
    textAlign: 'center',
    color: type === 'error' ? 'red' : type === 'success' ? 'green' : 'orange',
  };

  return message ? <div style={style}>{message}</div> : null;
};

export default ErrorMessage;

