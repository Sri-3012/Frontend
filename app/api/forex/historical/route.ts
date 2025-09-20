import { NextResponse } from 'next/server';

const API_KEY = 'WTwIpag6HWAbz2L3VlWH';
const BASE_URL = 'https://marketdata.tradermade.com/api/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval') || 'daily';

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol not provided' }, { status: 400 });
    }

    // For historical data
    const date = new Date();
    date.setDate(date.getDate() - 7); // Get data for last 7 days
    const startDate = date.toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];
    
    const url = `${BASE_URL}/timeseries?api_key=${API_KEY}&currency=${symbol.replace('/', '')}&start_date=${startDate}&end_date=${endDate}&interval=${interval}&format=json`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TraderMade API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: `API request failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in historical data API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}