# 🔍 Relatório de Segurança e Bugs — Frontend ENEM Speedrun

**Data da Análise:** 10/04/2026
**Escopo:** Todos os arquivos do frontend (`ENEM-Practice-main/`)

---

## 🔴 CRÍTICOS — Corrigir Imediatamente

---

### 1. XSS — HTML não sanitizado no `parseMarkdownImages`

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/quiz.js` (função `parseMarkdownImages`) |
| **Severidade** | 🔴 Crítico |
| **Impacto** | O texto do contexto/enunciado vindo da API pode conter HTML malicioso. O `parseMarkdownImages` injeta HTML diretamente via `innerHTML` sem sanitização completa. |

**Código problemático:**
```js
ctxEl.innerHTML = contextData.html;
document.getElementById('q-text').innerHTML = textData.html;
```

Se a API enem.dev for comprometida ou devolver questões com HTML malicioso, scripts podem ser executados no navegador do usuário.

**Solução recomendada:**
- Usar uma biblioteca de sanitização (DOMPurify) OU
- Converter todo o HTML para texto puro antes de injetar
- Validar que o conteúdo da API não contém tags `<script>`, `<iframe>`, `on*` handlers

---

### 2. URL do Backend Hardcoded

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/config.js` (linha 3) |
| **Severidade** | 🔴 Crítico |
| **Impacto** | A URL `https://enem-speedrun-backend.onrender.com` está hardcoded. Se o backend mudar de URL, o frontend quebra em produção. |

**Código atual:**
```js
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001'
  : 'https://enem-speedrun-backend.onrender.com';
```

**Solução recomendada:**
- Usar variável de ambiente no Vercel (`VITE_API_URL` ou `NEXT_PUBLIC_API_URL`)
- Ou: detectar automaticamente pelo hostname do backend (ex: `enem-speedrun.vercel.app` → `enem-speedrun-backend.onrender.com`)

---

### 3. Dados sensíveis no `sessionStorage`

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/quiz.js` (linha 17) |
| **Severidade** | 🔴 Crítico |
| **Impacto** | A sessão do quiz (com `gabaritoFallback`, `category`, `count`) é salva no `sessionStorage`. Se um atacante tiver acesso ao navegador, pode manipular a sessão. |

**Solução recomendada:**
- Não armazenar gabarito no frontend (o backend já faz isso via `sessionId`)
- O `gabaritoFallback` é redundante se o backend já armazena na sessão

---

## 🟡 ALTOS — Corrigir em Breve

---

### 4. Ranking bloqueado para visitantes

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/ranking.js` (linha 8) |
| **Severidade** | 🟡 Alto |
| **Impacto** | Visitantes são redirecionados para `index.html` ao acessar o ranking, mesmo que o ranking seja público no backend. |

**Código atual:**
```js
if (!isLoggedIn()) window.location.href = 'index.html';
```

**Solução recomendada:**
- Permitir acesso público ao ranking (apenas `ranking/me` precisa de auth)
- Mostrar dados limitados para visitantes

---

### 5. `logout()` redireciona para caminho errado

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/config.js` (função `logout`) |
| **Severidade** | 🟡 Alto |
| **Impacto** | O `logout()` redireciona para `/index.html` (com barra absoluta), o que pode quebrar em subdiretórios ou deploy em Vercel. |

**Código atual:**
```js
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/index.html';
}
```

**Solução recomendada:**
```js
window.location.href = 'index.html'; // caminho relativo
```

---

### 6. Falta de validação de `sessionId` no submit

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/quiz.js` (função `finishQuiz`) |
| **Severidade** | 🟡 Alto |
| **Impacto** | Se o `sessionId` for `null` ou `undefined`, o backend recebe dados inválidos. O frontend não valida antes de enviar. |

---

### 7. Imagem do backend hardcoded no `.env` vs config.js

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/config.js` |
| **Severidade** | 🟡 Alto |
| **Impacto** | Se o backend do Render cair ou mudar de URL, o frontend para de funcionar em produção. Não há fallback. |

---

## 🟢 MÉDIOS — Melhorias

---

### 8. Matérias individuais no `home.html` não funcionam

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `home.html` (linhas com `showArea`, `selectSubject`) |
| **Severidade** | 🟢 Médio |
| **Impacto** | O HTML tem elementos para seleção de matérias individuais (`subject-chip`, `subjects-tabs`), mas o JavaScript (`home.js`) referencia funções (`showArea`, `selectSubject`) que não são usadas pelo backend (backend só suporta `humanas`, `exatas`, `completa`, `matematica`). |

**Problema:** UI morta — os elementos de matérias individuais aparecem no HTML mas não há lógica para conectá-los ao backend.

---

### 9. `gabaritoFallback` enviado desnecessariamente

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/quiz.js` (função `finishQuiz`) |
| **Severidade** | 🟢 Médio |
| **Impacto** | O frontend envia `gabaritoFallback` no payload de submit, mas o backend não usa isso (o gabarito já está no servidor na sessão). |

**Solução:** Remover `gabaritoFallback` do payload.

---

### 10. Falta tratamento de erro de rede no `restoreSession`

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/config.js` (função `restoreSession`) |
| **Severidade** | 🟢 Médio |
| **Impacto** | Se o backend estiver offline, `restoreSession` pode travar o carregamento da página por fazer requisições que nunca retornam (sem timeout). |

**Solução:** Adicionar `AbortController` com timeout nas requisições de validação.

---

### 11. `prefers-color-scheme` sobrescreve preferência do usuário

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `assets/js/config.js` (função `initDarkMode`) |
| **Severidade** | 🟢 Baixo |
| **Impacto** | Se o usuário está em dark mode e muda a preferência do SO, o site pode alternar inesperadamente. |

---

### 12. Faltam tags meta de SEO

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | Todos os HTMLs |
| **Severidade** | 🟢 Baixo |
| **Impacto** | Sem `<meta description>`, `<meta og:* tags>`, ou favicon. |

---

### 13. `home.html` tem seções de matérias que não existem no HTML

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `home.html` |
| **Severidade** | 🟢 Baixo |
| **Impacto** | O `home.js` referencia `document.querySelectorAll('[id^="area-"]')` mas esses elementos não existem no `home.html`. |

---

### 14. Dark mode toggle aparece 3 vezes (duplicado)

| Campo | Detalhe |
|-------|---------|
| **Arquivo** | `index.html`, `home.html`, `quiz.html`, `ranking.html` |
| **Severidade** | 🟢 Baixo |
| **Impacto** | Código duplicado em cada página. Deveria ser um componente compartilhado ou injetado via JS. |

---

## 📊 Resumo Geral

| # | Problema | Severidade | Arquivo |
|---|----------|-----------|---------|
| 1 | XSS via `innerHTML` não sanitizado | 🔴 Crítico | `quiz.js` |
| 2 | URL do backend hardcoded | 🔴 Crítico | `config.js` |
| 3 | Dados de sessão no `sessionStorage` manipuláveis | 🔴 Crítico | `quiz.js` |
| 4 | Ranking bloqueado para visitantes | 🟡 Alto | `ranking.js` |
| 5 | `logout()` com caminho absoluto `/index.html` | 🟡 Alto | `config.js` |
| 6 | Falta validação de `sessionId` | 🟡 Alto | `quiz.js` |
| 7 | Sem fallback se backend cair | 🟡 Alto | `config.js` |
| 8 | UI de matérias individuais não funciona | 🟢 Médio | `home.html` + `home.js` |
| 9 | `gabaritoFallback` enviado desnecessariamente | 🟢 Médio | `quiz.js` |
| 10 | Sem timeout em `restoreSession` | 🟢 Médio | `config.js` |
| 11 | Dark mode conflita com preferência do SO | 🟢 Baixo | `config.js` |
| 12 | Falta meta tags SEO | 🟢 Baixo | Todos HTMLs |
| 13 | Referências a elementos HTML inexistentes | 🟢 Baixo | `home.js` |
| 14 | Dark mode toggle duplicado em 4 páginas | 🟢 Baixo | Todos HTMLs |

---

## ✅ Pontos Positivos

- ✅ **Design consistente** — sistema de design gov.br bem aplicado
- ✅ **Retry automático** — `apiRequest` tem retry com backoff exponencial
- ✅ **Renovação de token** — `refreshSession` funciona corretamente
- ✅ **Prefetch de imagens** — `preloadNextQuestion` melhora performance
- ✅ **Sanitização parcial** — `escapeHtml` usado em alguns pontos
- ✅ **Validação de domínios** — `isImageUrlAllowed` com whitelist
- ✅ **Dark mode** — implementado com `localStorage` + `prefers-color-scheme`
- ✅ **Responsive** — media queries presentes
- ✅ **Atalhos de teclado** — 1-5 para alternativas, Enter para próxima, Esc para fechar modal

---

## 📋 Próximos Passos Sugeridos

1. **Imediato:** Corrigir XSS (#1), URL hardcoded (#2), logout path (#5)
2. **Curto prazo:** Permitir ranking público (#4), adicionar timeouts (#10)
3. **Médio prazo:** Limpar UI morta (#8, #13), remover `gabaritoFallback` (#9)
4. **Contínuo:** Adicionar SEO meta tags (#12), testar em mobile real
