# 🎓 ENEM Speedrun - Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

Este é o repositório do frontend para o projeto **ENEM Speedrun**, uma plataforma web dinâmica desenvolvida para ajudar estudantes a testarem seus conhecimentos no modelo de questões do Exame Nacional do Ensino Médio (ENEM).

O frontend foi desenvolvido com **HTML puro, CSS e JavaScript (Vanilla)**, garantindo leveza, alta performance e zero dependência de frameworks complexos.

## 🚀 Estrutura

O portal é dividido nas seguintes páginas principais:

- **`index.html`**: Página de entrada/Autenticação (Login e Cadastro).
- **`home.html`**: Painel do aluno, exibindo estatísticas e opções de quiz.
- **`quiz.html`**: A tela do jogo/simulado propriamente dito, onde o aluno responde às questões cronometradas.
- **`ranking.html`**: O painel de líderes, exibindo as maiores pontuações em tempo real.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível.
- **CSS3**: Estilização responsiva e moderna (localizada em `assets/css`).
- **JavaScript (ES6+)**: Consumo da API do backend, lógica de quiz e manipulação de estado (localizado em `assets/js`).

## 📦 Como rodar o projeto localmente

Como o projeto usa apenas tecnologias nativas do navegador sem _bundlers_, não há processo de build, mas por questões do protocolo de CORS e consumo da API, é recomendado rodá-lo por meio de um servidor HTTP.

### Pré-requisitos
- Um servidor web local (Ex: a extensão clássica do VSCode **Live Server**, ou o `serve` do NPM).
- [ENEM Speedrun Backend](https://github.com/SamuelzimMVP/enem-speedrun-backend) configurado e rodando localmente para consumo de dados.

### Rodando via VSCode Live Server

1. Clone o repositório:
```bash
git clone https://github.com/SamuelzimMVP/enem-speedrun-frontend.git
```
2. Abra a pasta `enem-speedrun-frontend` no VSCode.
3. Clique com o botão direito no arquivo `index.html`.
4. Selecione a opção **"Open with Live Server"**.

Seu navegador padrão deve abrir o projeto na URL `http://127.0.0.1:5500`. Certifique-se de que no backend essa URL esteja liberada na lista de CORS permitidos.

### Rodando via Node.js (`http-server`)

```bash
npx http-server ./ -p 5500
```

## 🤝 Contribuição

Contribuições são valiosas! Se você deseja colaborar com a interface gráfica, refatoração de código JS ou acessibilidade, não hesite em abrir um _Pull Request_.

## 📝 Licença

Desenvolvido por [Samuelcaroba08](mailto:samuelcaroba08@gmail.com). Utilizado para estimular a agilidade mental dos estudantes na hora da prova.
