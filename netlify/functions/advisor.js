exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: event.body
    });

    const data = await response.json();

    // Log the full response for debugging
    console.log('Anthropic status:', response.status);
    console.log('Anthropic response:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Anthropic error:', data);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'https://www.freedomwellnessnh.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: true, 
          status: response.status,
          details: data 
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.freedomwellnessnh.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('Function error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
