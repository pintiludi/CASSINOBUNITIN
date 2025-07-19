# 🎰 Las Vegas Casino - Deploy na Vercel 

## 📋 Pré-requisitos
- Conta na Vercel (vercel.com)
- Git instalado
- Vercel CLI instalado: `npm i -g vercel`

## 🚀 Comandos para Deploy

### 1️⃣ **Prepare o projeto para deploy:**
```bash
cd /app/frontend
yarn build
```

### 2️⃣ **Primeira vez - Deploy inicial:**
```bash
cd /app/frontend
vercel
```
**Responda as perguntas:**
- Set up and deploy? `Y`
- Which scope? `[sua conta]`
- Link to existing project? `N`
- Project name? `las-vegas-casino` (ou o que quiser)
- Directory? `./` (pasta atual)

### 3️⃣ **Deploys futuros (após mudanças):**
```bash
cd /app/frontend
vercel --prod
```

## 🌐 **Deploy alternativo via GitHub:**

### 1. **Subir para GitHub:**
```bash
cd /app/frontend
git init
git add .
git commit -m "🎰 Las Vegas Casino - Initial commit"
git remote add origin https://github.com/SEU_USUARIO/las-vegas-casino.git
git push -u origin main
```

### 2. **Na Vercel:**
1. Acesse [vercel.com](https://vercel.com)
2. Clique "New Project"
3. Conecte seu repositório GitHub
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./` ou `frontend` (se subir pasta completa)
   - **Build Command:** `yarn build`
   - **Output Directory:** `build`
5. Clique "Deploy"

## ⚙️ **Arquivos de configuração criados:**

### `vercel.json` ✅
- Configuração para SPA (Single Page Application)
- Redireciona todas as rotas para `index.html`

### `package.json` atualizado ✅
- Script `vercel-build` adicionado
- Compatível com deploy automatizado

## 🎯 **URLs finais:**
Após o deploy, sua aplicação estará disponível em:
- **Production:** `https://las-vegas-casino-[hash].vercel.app`
- **Custom Domain:** Configure um domínio personalizado na Vercel

## 🎰 **Funcionalidades que funcionam:**
✅ Todos os 5 jogos (Slot, Blackjack, Roleta, Poker, Dados)
✅ Sistema de créditos (10.000 iniciais)
✅ Navegação entre páginas
✅ Animações e efeitos visuais
✅ Design responsivo
✅ Dados salvos no localStorage

## 🔥 **Comandos rápidos de deploy:**
```bash
# Deploy rápido
cd /app/frontend && vercel --prod

# Build local para testar
cd /app/frontend && yarn build

# Preview do build
cd /app/frontend && yarn build && npx serve -s build
```

## 🎮 **Criado com orgulho por CASCUDAO FELIZ ☺️**

---
*Última atualização: Julho 2025* 🚀