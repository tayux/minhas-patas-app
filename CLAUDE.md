# MinhasPatas — Instruções do Projeto

## Auto-commit após ~10 edições

**REGRA OBRIGATÓRIA:** Durante qualquer sessão de trabalho neste projeto, mantenha
um contador mental de arquivos editados. Sempre que o total de arquivos modificados
(somando edições, criações e exclusões desde o último commit) chegar a **10 ou mais**,
faça um commit automático antes de continuar:

```bash
cd <raiz do projeto>
git add -A
git commit -m "<resumo conciso do que foi feito>"
git push origin main
```

- Não espere o usuário pedir — faça silenciosamente e informe em uma linha ("✅ Auto-commit: X arquivos")
- Use uma mensagem de commit descritiva (ex: "feat: formulário de vacinas + correção de data")
- Reinicie o contador após cada commit
- Se o push falhar, avise o usuário imediatamente

## Stack
- React 18 + Vite 6 (SPA PWA)
- Vercel (deploy automático no push para `main`)
- Neon PostgreSQL via `@neondatabase/serverless` (API routes em `/api/`)
- Lucide React para todos os ícones (objeto `I` em `Shared.jsx`)
- Storybook 10 + Chromatic para design system

## Regras de código
- Ícones: sempre usar `I.xxx` de `Shared.jsx`, nunca emoji como ícone funcional
- Datas: sempre usar `ddmmToIso` / `isoToDdmm` de `src/utils/dateUtils.js`
- Novos arquivos de tela em `src/screens/`, componentes em `src/components/`
- Novas rotas de API em `api/` seguindo o padrão dos arquivos existentes
