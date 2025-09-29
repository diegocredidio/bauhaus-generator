# Supergráficos Bauhaus — Next.js (App Router) + p5.js

Projeto gerativo em p5.js dentro de Next.js, pronto para deploy na **Vercel**.

## Rodar localmente
```bash
npm i
npm run dev
# abra http://localhost:3000
```

## Deploy na Vercel
### Opção A — via Dashboard (sem build command)
1. Envie este projeto para um repositório GitHub
2. No painel da Vercel: **New Project** → **Import Git Repository**
3. *Framework Preset*: **Next.js**
4. *Build Command*: `next build`
5. *Output Directory*: `.vercel/output` (Vercel cuida disso automaticamente para Next.js)
6. Deploy

### Opção B — via CLI
```bash
npm i -g vercel
vercel
# aceite sugeridos
```

## Controles
- **R** — regera
- **S** — salvar PNG
- **1–4** — troca de paleta
- **M** — alternar BLEND/MULTIPLY
- Botões equivalentes na interface

## Estrutura
```
.
├─ app/
│  ├─ layout.js
│  ├─ page.js
│  └─ globals.css
├─ components/
│  └─ BauhausSketch.js
├─ next.config.mjs
├─ package.json
├─ jsconfig.json
└─ .gitignore
```

> Observação: p5.js é carregado via CDN em `layout.js` com `beforeInteractive` para garantir disponibilidade antes do componente.
