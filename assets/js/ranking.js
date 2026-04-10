// ═══════════════════════════════════════════════════════════
// ENEM Speedrun — Ranking (público)
// ═══════════════════════════════════════════════════════════

// ─── Restaurar sessão ao carregar ──────────────────────────
(async () => {
  await restoreSession();
})();

// ─── Ranking é público — não exige login ───────────────────
const isGuest = !isLoggedIn();
const user = getUser();
if (user) document.getElementById('user-name').textContent = user.nome;
else document.getElementById('user-name').textContent = 'Visitante';

// ─── Carrega ranking ───────────────────────────────────────
async function loadRanking() {
  const category = document.getElementById('filter-category').value;
  const count    = document.getElementById('filter-count').value;
  const body     = document.getElementById('ranking-body');
  const podiumWrap = document.getElementById('podium-wrap');

  body.innerHTML = `
    <div class="empty-state">
      <div class="spinner spinner-blue" style="width:36px;height:36px;margin:0 auto 16px;"></div>
      <p>Carregando ranking...</p>
    </div>
  `;
  podiumWrap.style.display = 'none';

  try {
    const data = await apiRequest(`/api/ranking?category=${category}&count=${count}`);
    const ranking = data.ranking || [];

    if (ranking.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <div class="es-icon">🏁</div>
          <p>Nenhum resultado ainda para esta categoria.<br>
          <strong>Seja o primeiro a jogar!</strong></p>
        </div>
      `;
      return;
    }

    renderPodium(ranking.slice(0, 3));
    renderTable(ranking);

  } catch (err) {
    body.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">⚠️</div>
        <p>Erro ao carregar ranking.</p>
      </div>
    `;
  }
}

// ─── Renderiza pódio ───────────────────────────────────────
function renderPodium(top) {
  const podiumWrap = document.getElementById('podium-wrap');
  const podium     = document.getElementById('podium');

  if (top.length < 1) return;

  const medals = ['🥇', '🥈', '🥉'];
  const heights = { 1: 100, 2: 70, 3: 50 };

  const visual = top.length >= 3
    ? [{ r: top[1], p: 2 }, { r: top[0], p: 1 }, { r: top[2], p: 3 }]
    : top.map((r, i) => ({ r, p: i + 1 }));

  podium.innerHTML = '';

  visual.forEach(({ r, p }) => {
    const initial = r.nome ? r.nome[0].toUpperCase() : '?';
    const div = document.createElement('div');
    div.className = 'podium-place';
    div.innerHTML = `
      <div class="podium-avatar">
        ${initial}
        <span class="podium-medal">${medals[p - 1]}</span>
      </div>
      <div class="podium-name">${escapeHtml(r.nome || 'Usuário')}</div>
      <div class="podium-score">${r.correct_answers} acertos · ${formatTime(r.time_seconds)}</div>
      <div class="podium-block" style="height:${heights[p]}px">${p}º</div>
    `;
    podium.appendChild(div);
  });

  podiumWrap.style.display = 'block';
}

// ─── Renderiza tabela ──────────────────────────────────────
function renderTable(ranking) {
  const body = document.getElementById('ranking-body');
  const myId = user?.id;

  const posClasses = ['gold', 'silver', 'bronze'];

  let rows = ranking.map((r, i) => {
    const pos = i + 1;
    const isMe = r.user_id === myId;
    const posClass = pos <= 3 ? posClasses[pos - 1] : '';
    const nome = escapeHtml(r.nome || 'Usuário');

    return `
      <tr class="${isMe ? 'my-row' : ''}">
        <td class="rank-pos ${posClass}">${pos <= 3 ? ['🥇','','🥉'][pos - 1] : pos + 'º'}</td>
        <td class="rank-name">
          ${nome}
          ${isMe ? '<span class="rank-you">Você</span>' : ''}
        </td>
        <td class="rank-score">${r.correct_answers} acertos</td>
        <td class="rank-time">⏱ ${formatTime(r.time_seconds)}</td>
        <td style="font-size:0.8rem;color:var(--cinza-medio)">
          ${r.completed_at ? new Date(r.completed_at).toLocaleDateString('pt-BR') : '—'}
        </td>
      </tr>
    `;
  }).join('');

  body.innerHTML = `
    <table class="ranking-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Jogador</th>
          <th>Acertos</th>
          <th>Tempo</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ─── Inicia ────────────────────────────────────────────────
loadRanking();
