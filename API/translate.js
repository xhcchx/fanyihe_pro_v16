// Minimal serverless function for Vercel Node.js runtime
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const AUTH_EMAIL = process.env.AUTH_EMAIL;
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const email = req.headers['x-auth-email'];
  const token = req.headers['x-access-token'];

  if (!email || !token) {
    return res.status(401).json({ error: '缺少认证信息' });
  }
  if (AUTH_EMAIL && String(email).toLowerCase() !== String(AUTH_EMAIL).toLowerCase()) {
    return res.status(403).json({ error: '邮箱未授权' });
  }
  if (ACCESS_TOKEN && token !== ACCESS_TOKEN) {
    return res.status(403).json({ error: '口令不正确' });
  }
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: '未配置 OPENAI_API_KEY' });
  }

  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: '缺少 text' });
    }

    // simple direction auto-detect zh<->en
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    const system = isChinese
      ? "你是一个专业中译英助手，只翻译，不解释，不添加多余内容。"
      : "You are a professional English-to-Chinese translator. Translate only, no explanations.";

    // Call OpenAI Chat Completions (compatible)
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: text }
        ],
        temperature: 0.2
      })
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({ error: data.error?.message || 'OpenAI 接口错误' });
    }
    const result = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(500).json({ error: e.message || '服务器错误' });
  }
}
