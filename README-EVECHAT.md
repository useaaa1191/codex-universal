# Evechat (Scaleway)

The Vercel eve chat app lives in [`evechat/`](./evechat).

It uses Scaleway Generative APIs with project
`ee9e975c-6021-45f0-ad87-e565cadbf5f3` and model `glm-5.2`.

```bash
cd evechat
cp .env.example .env.local
# set SCW_SECRET_KEY=...
pnpm install
pnpm dev
```

Details: [`evechat/docs/scaleway.md`](./evechat/docs/scaleway.md).
