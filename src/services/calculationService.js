export const calculateMomentum = (stock) => {
  if (!stock || !stock.close_price) return 0;
  
  const { close_price } = stock;
  
  if (!stock.prices_history || stock.prices_history.length < 26) return null;
  
  const pastPrice = stock.prices_history[stock.prices_history.length - 26]?.close_price;
  if (!pastPrice) return null;
  
  return ((close_price / pastPrice) - 1) * 100;
};

export const calculateMovingAverage = (stock, period) => {
  if (!stock || !stock.prices_history) return null;
  if (stock.prices_history.length < period) return null;
  
  const sum = stock.prices_history.slice(-period).reduce((acc, item) => acc + (item.close_price || 0), 0);
  return sum / period;
};

export const calculateRateOfChange = (currentValue, pastValue) => {
  if (currentValue === null || currentValue === undefined) return null;
  if (pastValue === null || pastValue === undefined) return null;
  if (pastValue === 0) return 0;
  
  return ((currentValue - pastValue) / pastValue) * 100;
};

export const calculateIndicators = (stock) => {
  const indicators = {};
  
  if (stock.close_price && stock.prices_history) {
    const closePrice = stock.close_price;
    
    if (stock.prices_history.length >= 26) {
      const pastPrice26 = stock.prices_history[stock.prices_history.length - 26]?.close_price;
      if (pastPrice26) indicators.momentum_26 = calculateRateOfChange(closePrice, pastPrice26);
    }
    
    if (stock.prices_history.length >= 29) {
      const pastPrice29 = stock.prices_history[stock.prices_history.length - 29]?.close_price;
      if (pastPrice29) indicators.momentum_29 = calculateRateOfChange(closePrice, pastPrice29);
    }
    
    if (stock.prices_history.length >= 31) {
      const pastPrice31 = stock.prices_history[stock.prices_history.length - 31]?.close_price;
      if (pastPrice31) indicators.momentum_31 = calculateRateOfChange(closePrice, pastPrice31);
    }
    
    if (stock.prices_history.length >= 34) {
      const pastPrice34 = stock.prices_history[stock.prices_history.length - 34]?.close_price;
      if (pastPrice34) indicators.momentum_34 = calculateRateOfChange(closePrice, pastPrice34);
    }
    
    if (stock.prices_history.length >= 20) {
      indicators.ma_20 = calculateMovingAverage(stock, 20);
    }
    
    if (stock.prices_history.length >= 50) {
      indicators.ma_50 = calculateMovingAverage(stock, 50);
    }
  }
  
  return indicators;
};

export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const change = prices[prices.length - i] - prices[prices.length - i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

