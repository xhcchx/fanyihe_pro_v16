# 翻译盒 Pro · 通话特别版 V1.6（Vercel 部署包）

## 功能
- 前端 + 无服务器函数（/api/translate）
- 仅授权邮箱 + 访问口令可用
- 健康检查：/api/status

## 环境变量（Vercel → Settings → Environment Variables）
- `OPENAI_API_KEY`：你的 OpenAI Key
- `AUTH_EMAIL`：授权邮箱（如 `wenter831@gmail.com`）
- `ACCESS_TOKEN`：访问口令（任意强口令）

## 部署步骤（3 分钟）
1. 登录 https://vercel.com → New Project → Import → Upload → 上传本项目 ZIP
2. 部署前设置环境变量（见上）
3. 点击 Deploy → 获得形如 `https://xxxx.vercel.app` 的域名
4. 访问 `/api/status` 检查健康
5. 打开主页，输入授权邮箱与口令，开始使用

> 若需自定义模型或策略，请修改 `api/translate.js` 中的 `model`、`temperature`。
