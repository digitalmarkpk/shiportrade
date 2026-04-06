'use server';

import ZAI from 'z-ai-web-dev-sdk';

// Search the web for real-time data
export async function searchWeb(query: string) {
  try {
    const zai = await ZAI.create();
    
    const searchResult = await zai.functions.invoke('web_search', {
      query: `${query} shipping trade logistics supply chain`,
      num: 10,
    });
    
    return searchResult || [];
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

// Generate AI insight based on search query and results
export async function generateAIInsight(query: string, searchResults: any[]) {
  try {
    const zai = await ZAI.create();
    
    const contextText = searchResults
      .slice(0, 5)
      .map((r: any) => `${r.name}: ${r.snippet}`)
      .join('\n\n');
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an elite AI trade intelligence analyst for Shiportrade.com, the world's leading global supply chain intelligence platform. Your role is to provide deep, actionable insights for shipping, trade, logistics, and supply chain professionals.

When responding to queries:
1. Provide comprehensive, data-driven analysis
2. Include specific metrics, trends, and forecasts when relevant
3. Highlight risks and opportunities
4. Suggest actionable recommendations
5. Format responses with clear sections and bullet points
6. Be authoritative yet accessible
7. Focus on practical business value

Areas of expertise:
- Global shipping and freight markets
- Port operations and congestion
- Trade regulations and tariffs
- Container logistics
- Supply chain optimization
- Freight rate forecasting
- Trade route analysis
- Vessel tracking and operations
- Customs and compliance
- Trade finance

Always cite sources when referencing specific data points. Be transparent about confidence levels in predictions.`
        },
        {
          role: 'user',
          content: `Query: ${query}

Relevant search results:
${contextText}

Please provide a comprehensive intelligence brief on this topic, including:
1. Executive Summary (2-3 sentences)
2. Key Insights & Analysis
3. Market Trends & Data Points
4. Risk Assessment
5. Opportunities & Recommendations
6. Related Topics to Explore`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI insight generation error:', error);
    return '';
  }
}

// Generate predictive analysis
export async function generatePredictiveAnalysis(category: string, timeframe: string) {
  try {
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a predictive analytics AI specializing in global trade, shipping, and supply chain forecasting. Provide data-driven predictions with confidence intervals and key influencing factors.'
        },
        {
          role: 'user',
          content: `Generate a predictive analysis for ${category} over the next ${timeframe}. Include:
1. Trend forecast
2. Key drivers
3. Risk factors
4. Confidence level
5. Recommended actions`
        }
      ],
      temperature: 0.5,
    });
    
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Predictive analysis error:', error);
    return '';
  }
}

// Generate scenario modeling results
export async function generateScenarioAnalysis(scenario: string, parameters: Record<string, any>) {
  try {
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a scenario modeling AI for global supply chain analysis. Simulate the impact of hypothetical changes on trade routes, costs, timelines, and supply chain dynamics.'
        },
        {
          role: 'user',
          content: `Scenario: ${scenario}
Parameters: ${JSON.stringify(parameters)}

Analyze the potential impact of this scenario on:
1. Shipping routes and transit times
2. Freight costs
3. Port congestion
4. Supply chain disruptions
5. Recommended mitigation strategies`
        }
      ],
      temperature: 0.6,
    });
    
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Scenario analysis error:', error);
    return '';
  }
}

// Generate anomaly explanation
export async function explainAnomaly(anomalyType: string, data: Record<string, any>) {
  try {
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an anomaly detection specialist for supply chain intelligence. Explain unusual patterns, their potential causes, and recommend actions.'
        },
        {
          role: 'user',
          content: `Anomaly Type: ${anomalyType}
Data: ${JSON.stringify(data)}

Please explain:
1. What is unusual about this pattern
2. Potential causes
3. Impact assessment
4. Recommended actions
5. Monitoring suggestions`
        }
      ],
      temperature: 0.5,
    });
    
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Anomaly explanation error:', error);
    return '';
  }
}
