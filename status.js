export default async function handler(req, res) {
  return res.status(200).json({ ok: true, service: "fanyihe-pro-v1.6", time: new Date().toISOString() });
}
