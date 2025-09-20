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

interface TraderMadeQuote {
  ask: number;
  bid: number;
  mid: number;
  base_currency: string;
  quote_currency: string;
  timestamp: number;
}

interface TraderMadeResponse {
  endpoint: string;
  quotes: TraderMadeQuote[];
}

function getFallbackPrices(pairs: string[]): ForexData {
  const transformedData: ForexData = {};
  const timestamp = Date.now();

  pairs.forEach(pair => {
    const defaultPrice = defaultPrices[pair];
    if (defaultPrice) {
      transformedData[pair] = {
        price: defaultPrice.price,
        bid: defaultPrice.bid,
        ask: defaultPrice.ask,
        change: 0,
        percent_change: 0,
        timestamp: timestamp
      };
    }
  });

  return transformedData;
}

function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

function safeParseFloat(value: any, fallback: number = 0): number {
  if (value === null || value === undefined) return fallback;
  const parsed = parseFloat(value);
  return isValidNumber(parsed) ? parsed : fallback;
}

// Cache to store previous rates
let ratesCache: { [key: string]: { price: number; timestamp: number }[] } = {};
const MAX_CACHE_ENTRIES = 10;

function updateRatesCache(pair: string, price: number, timestamp: number) {
  if (!isValidNumber(price) || !isValidNumber(timestamp)) {
    console.warn(`Invalid cache update values for ${pair}:`, { price, timestamp });
    return;
  }

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
  if (!isValidNumber(currentPrice)) {
    console.warn(`Invalid current price for ${pair}:`, currentPrice);
    return { change: 0, percent_change: 0 };
  }

  const cache = ratesCache[pair];
  if (!cache || cache.length < 2) {
    return { change: 0, percent_change: 0 };
  }

  // Get the previous price
  const previousPrice = cache[cache.length - 2].price;
  if (!isValidNumber(previousPrice)) {
    console.warn(`Invalid previous price for ${pair}:`, previousPrice);
    return { change: 0, percent_change: 0 };
  }

  const change = currentPrice - previousPrice;
  const percent_change = (change / previousPrice) * 100;

  // Validate calculated values
  if (!isValidNumber(change) || !isValidNumber(percent_change)) {
    console.warn(`Invalid calculated changes for ${pair}:`, { change, percent_change });
    return { change: 0, percent_change: 0 };
  }

  return { change, percent_change };
}

// Default prices to use when API fails
const defaultPrices: { [key: string]: { price: number; bid: number; ask: number } } = {
  'EUR/USD': { price: 1.0845, bid: 1.0843, ask: 1.0847 },
  'GBP/USD': { price: 1.2634, bid: 1.2632, ask: 1.2636 },
  'USD/JPY': { price: 149.82, bid: 149.80, ask: 149.84 },
  'AUD/USD': { price: 0.6523, bid: 0.6521, ask: 0.6525 },
  'USD/CAD': { price: 1.3756, bid: 1.3754, ask: 1.3758 },
  'NZD/USD': { price: 0.5987, bid: 0.5985, ask: 0.5989 },
  'USD/CHF': { price: 0.8934, bid: 0.8932, ask: 0.8936 },
  'EUR/GBP': { price: 0.8589, bid: 0.8587, ask: 0.8591 }
};

export async function getForexPrices(pairs: string[]): Promise<ForexData | null> {
  try {
    if (!Array.isArray(pairs) || pairs.length === 0) {
      console.error('Invalid pairs array:', pairs);
      throw new Error('Invalid pairs array provided');
    }

    // Format pairs for API (e.g., "EURUSD,GBPUSD")
    const formattedPairs = pairs.map(pair => pair.replace('/', '')).join(',');
    console.log('Fetching forex prices for:', formattedPairs);
    
    // Use our Next.js API route instead of calling TraderMade directly
    const response = await fetch(`/api/forex?pairs=${formattedPairs}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    let data: TraderMadeResponse;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed API Response:', data);
    } catch (error) {
      console.error('Failed to parse API response:', error);
      return getFallbackPrices(pairs);
    }

    if (!data || !data.quotes) {
      console.error('Invalid API response structure:', data);
      return getFallbackPrices(pairs);
    }

    if (typeof data.quotes !== 'object' || Object.keys(data.quotes).length === 0) {
      console.error('Empty or invalid quotes in response:', data.quotes);
      return getFallbackPrices(pairs);
    }

    // Transform the data to match our application's format
    const transformedData: ForexData = {};
    const timestamp = Date.now();

    // Function to create a proper formatted pair string (e.g., "EUR/USD")
    const formatPairString = (base: string, quote: string) => `${base}/${quote}`;

    // Process each currency pair from the quotes array
    data.quotes.forEach((quote) => {
      // Validate quote object
      if (!quote || typeof quote !== 'object') {
        console.warn(`Invalid quote data:`, quote);
        return;
      }

      const pair = formatPairString(quote.base_currency, quote.quote_currency);
      const price = safeParseFloat(quote.mid);
      
      // Store in cache for change calculation
      updateRatesCache(pair, price, timestamp);
      const { change, percent_change } = calculateChanges(pair, price);

      transformedData[pair] = {
        price: price,
        bid: safeParseFloat(quote.bid),
        ask: safeParseFloat(quote.ask),
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