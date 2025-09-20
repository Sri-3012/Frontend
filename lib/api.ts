const API_KEY = 'WTwIpag6HWAbz2L3VlWH';
const BASE_URL = 'https://marketdata.tradermade.com/api/v1';

interface ForexRate {
  price: number;
  bid: number;
  ask: number;
  change: number;
  percent_change: number;
  timestamp: number;
}

interface ForexData {
  [key: string]: ForexRate;
}

interface TraderMadeResponse {
  base_currency: string;
  quote_currency: string;
  endpoint: string;
  quotes: {
    [key: string]: {
      bid: number;
      ask: number;
      price: number;
      timestamp: number;
    };
  };
}

// Cache to store previous rates
let ratesCache: { [key: string]: { price: number; timestamp: number }[] } = {};
const MAX_CACHE_ENTRIES = 10;

function updateRatesCache(pair: string, price: number, timestamp: number) {
  if (!ratesCache[pair]) {
    ratesCache[pair] = [];
  }

  // Add new price to cache
  ratesCache[pair].push({ price, timestamp });

  // Keep only the last MAX_CACHE_ENTRIES entries
  if (ratesCache[pair].length > MAX_CACHE_ENTRIES) {
    ratesCache[pair].shift();
  }
}

function calculateChanges(pair: string, currentPrice: number): { change: number; percent_change: number } {
  const cache = ratesCache[pair];
  if (!cache || cache.length < 2) {
    return { change: 0, percent_change: 0 };
  }

  // Get the previous price
  const previousPrice = cache[cache.length - 2].price;
  const change = currentPrice - previousPrice;
  const percent_change = (change / previousPrice) * 100;

  return { change, percent_change };
}

export async function getForexPrices(pairs: string[]) {
  try {
    // Format pairs for TraderMade API (e.g., "EURUSD,GBPUSD")
    const formattedPairs = pairs.map(pair => pair.replace('/', '')).join(',');
    console.log('Fetching forex prices for:', formattedPairs);
    
    const url = `${BASE_URL}/live?currency=${formattedPairs}&api_key=${API_KEY}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as TraderMadeResponse;
    console.log('API Response:', data);

    if (!data.quotes) {
      throw new Error('Failed to fetch forex data');
    }

    // Transform the data to match our application's format
    const transformedData: ForexData = {};
    const timestamp = Date.now();

    // Process each currency pair
    Object.entries(data.quotes).forEach(([symbol, quote]) => {
      const price = quote.price;
      
      // Store in cache for change calculation
      updateRatesCache(symbol, price, timestamp);
      const { change, percent_change } = calculateChanges(symbol, price);

      transformedData[symbol] = {
        price: price,
        bid: quote.bid,
        ask: quote.ask,
        change: change,
        percent_change: percent_change,
        timestamp: quote.timestamp
      };
    });

    return transformedData;
  } catch (error) {
    console.error('Error fetching forex prices:', error);
    return null;
  }
}

export async function getHistoricalData(symbol: string, interval: string = 'daily') {
  try {
    // For historical data
    const date = new Date();
    date.setDate(date.getDate() - 7); // Get data for last 7 days
    const startDate = date.toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];
    
    const response = await fetch(
      `${BASE_URL}/timeseries?api_key=${API_KEY}&currency=${symbol.replace('/', '')}&start_date=${startDate}&end_date=${endDate}&interval=${interval}&format=json`
    );
    const data = await response.json();
    
    if (!data.quotes) {
      throw new Error('Failed to fetch historical data');
    }

    return {
      symbol,
      data: data.quotes.map((quote: any) => ({
        timestamp: new Date(quote.date).getTime(),
        open: quote.open,
        high: quote.high,
        low: quote.low,
        close: quote.close
      }))
    };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return null;
  }
}

export async function getPortfolioData() {
  // This would typically come from your backend
  return {
    totalEquity: 125847.32,
    freeMargin: 98234.56,
    usedMargin: 27612.76,
    marginLevel: 455.8,
    allocation: [
      { pair: "EUR/USD", amount: 43975, percentage: 35 },
      { pair: "GBP/USD", amount: 31462, percentage: 25 },
      { pair: "USD/JPY", amount: 25169, percentage: 20 },
      { pair: "AUD/USD", amount: 15102, percentage: 12 },
      { pair: "Others", amount: 10139, percentage: 8 },
    ],
    performance: [
      { month: "Jan", profit: 2400 },
      { month: "Feb", profit: 1800 },
      { month: "Mar", profit: 3200 },
      { month: "Apr", profit: 2800 },
      { month: "May", profit: 3600 },
      { month: "Jun", profit: 2900 },
    ],
    risk: {
      level: "Moderate",
      maxDrawdown: -3.2,
      sharpeRatio: 1.84
    }
  };
}