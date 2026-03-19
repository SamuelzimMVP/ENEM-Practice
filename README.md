# 🚀 ENEM Speedrun

> Plataforma gamificada de simulados para o ENEM — transformando preparação em competição.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

**[🌐 Acessar o projeto ao vivo](https://enem-speedrun-frontend.vercel.app/)** · **[📦 Repositório do Back-end](https://github.com/SamuelzimMVP/enem-speedrun-backend)** · **[🎨 Repositório do Front-end](https://github.com/SamuelzimMVP/ENEM-Practice)**

---

## O que é

O ENEM Speedrun nasceu de um problema real: a preparação para o ENEM é maçante e pouco engajante. A plataforma resolve isso com gamificação — o estudante compete contra o tempo, sobe de ranking e desbloqueia conquistas conforme avança nos simulados.

**Problema:** estudantes abandonam a preparação por falta de motivação e feedback imediato.  
**Solução:** simulados cronometrados com sistema de ranking, conquistas e progressão visual.

---

## Funcionalidades

- **Autenticação completa** — cadastro, login e sessões protegidas com JWT
- **Simulados com questões do ENEM** — banco de questões real com correção automática
- **Sistema de conquistas** — progressão de Bronze a Diamante baseada em desempenho, validada no servidor
- **Ranking / Leaderboard** — classificação em tempo real entre todos os usuários
- **Banco de dados persistente** — dados armazenados e gerenciados via Supabase + PostgreSQL

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Back-end | Node.js, Express.js |
| Banco de dados | PostgreSQL (via Supabase) |
| Autenticação | JWT (JSON Web Tokens) |
| Front-end | HTML5, CSS3, JavaScript ES6+ |
| Deploy | Vercel (front) · Render (back) |

---

## Arquitetura

```
enem-speedrun/
├── backend/
│   ├── src/
│   │   ├── controllers/     # lógica de negócio (simulados, ranking, conquistas)
│   │   ├── routes/          # endpoints da API REST
│   │   ├── middlewares/     # autenticação JWT, validações
│   │   └── services/        # integração com Supabase
│   └── server.js
└── frontend/
    ├── pages/               # simulado, ranking, perfil
    ├── assets/
    └── index.html
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SamuelzimMVP/enem-speedrun-backend.git
cd enem-speedrun-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase e JWT_SECRET
```

### Variáveis de ambiente

```env
SUPABASE_URL=sua_url_aqui
SUPABASE_KEY=sua_chave_aqui
JWT_SECRET=seu_secret_aqui
PORT=3000
```

### Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000`

---

## Endpoints principais da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Login e geração de token JWT |
| GET | `/simulado/iniciar` | Inicia um novo simulado |
| POST | `/simulado/responder` | Envia resposta de uma questão |
| GET | `/ranking` | Retorna leaderboard global |
| GET | `/conquistas/:userId` | Conquistas do usuário |

---

## Decisões técnicas

**Por que Supabase?** Combina PostgreSQL robusto com autenticação pronta e realtime — ideal para um MVP que precisa de velocidade de entrega sem abrir mão de banco relacional real.

**Por que validar conquistas no servidor?** Evita que usuários manipulem conquistas pelo front-end. Toda progressão de Bronze a Diamante é calculada e validada na API antes de ser persistida.

**Por que JWT stateless?** Permite escalar o back-end horizontalmente sem necessidade de session store centralizado.

---

## Próximos passos

- [ ] Modo multiplayer — dois estudantes no mesmo simulado em tempo real
- [ ] Filtro de questões por área do conhecimento
- [ ] Dashboard de desempenho com gráficos de evolução
- [ ] App mobile com React Native

---

## Autor

**Samuel R. Caroba**  
Desenvolvedor Full Stack · Estudante de Engenharia de Software

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samuel-rodrigues-7b7538360/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/SamuelzimMVP)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:samuelcaroba08@gmail.com)
