import { NextResponse } from 'next/server';

const API_KEY = 'WTwIpag6HWAbz2L3VlWH';
const BASE_URL = 'https://marketdata.tradermade.com/api/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pairs = searchParams.get('pairs');

    if (!pairs) {
      return NextResponse.json({ error: 'Currency pairs not provided' }, { status: 400 });
    }

    // Format pairs for TraderMade API (e.g., "EURUSD,GBPUSD")
    const formattedPairs = pairs;
    
    const url = `${BASE_URL}/live?currency=${formattedPairs}&api_key=${API_KEY}`;
    console.log('Fetching forex prices for:', formattedPairs);
    
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
    console.error('Error in forex API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}