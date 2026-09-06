// YahiaRoute Vercel Serverless Function
// Runs securely on Vercel's backend with hidden environment variables

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const hasKeys = {
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
      anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    };
    return res.status(200).json({
      status: 'online',
      message: 'YahiaRoute Vercel Serverless Backend Active',
      configuredProviders: hasKeys,
      hasServerKeys: Object.values(hasKeys).some(Boolean)
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, prompt, systemPrompt, role } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    // 1. OpenRouter (Handles ALL models if provided)
    if (openrouterKey) {
      const targetModel = model?.openRouterId || model?.id || 'anthropic/claude-3.7-sonnet';
      const orResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterKey}`,
          'HTTP-Referer': 'https://yahiaroute.vercel.app',
          'X-Title': 'YahiaRoute'
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: 'system', content: systemPrompt || 'You are an expert AI software engineer on YahiaRoute.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (orResp.ok) {
        const data = await orResp.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return res.status(200).json({ content: text, provider: `OpenRouter (${targetModel})` });
        }
      }
    }

    // 2. Direct Gemini Key
    if (geminiKey && (model?.provider === 'Google' || !openrouterKey)) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const gResp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: (systemPrompt ? systemPrompt + '\n\n' : '') + prompt }] }]
        })
      });
      if (gResp.ok) {
        const data = await gResp.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.status(200).json({ content: text, provider: 'Google Gemini 2.0' });
        }
      }
    }

    // 3. Direct Groq Key (Llama 3.3 70B & DeepSeek R1)
    if (groqKey && (model?.provider?.includes('Groq') || model?.provider?.includes('Meta') || !openrouterKey)) {
      const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt || 'You are an expert AI software engineer.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      if (groqResp.ok) {
        const data = await groqResp.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return res.status(200).json({ content: text, provider: 'Groq (Llama 3.3 70B)' });
        }
      }
    }

    // 4. Direct OpenAI Key
    if (openaiKey && (model?.provider === 'OpenAI' || !openrouterKey)) {
      const oaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt || 'You are an expert AI software engineer.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      if (oaiResp.ok) {
        const data = await oaiResp.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return res.status(200).json({ content: text, provider: 'OpenAI (GPT-4o)' });
        }
      }
    }

    return res.status(200).json({
      fallback: true,
      message: 'No active server API key matched. Client will fallback to client keys or smart engine.'
    });

  } catch (err) {
    console.error('Serverless AI error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
