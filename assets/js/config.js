// Configuração da API ──────────────────────────────────────────────────────
// Troque pela URL do seu backend no Render após o deploy
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001'
  : 'https://enem-speedrun-backend.onrender.com'; // ← Altere após deploy no Render

// ─── Dark Mode ────────────────────────────────────────────────────────────────
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true' || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('darkMode') !== 'false');
  if (darkMode) document.body.classList.add('dark-mode');
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark);
}

// Inicializa dark mode ao carregar
initDarkMode();

// ─── Helper para requisições autenticadas com retry ──────────────────────────
async function apiRequest(path, options = {}, _isRetry = false, _retryCount = 0) {
  const MAX_RETRIES = 2;
  const isGuestMode = localStorage.getItem('isGuest') === 'true';
  const token = isLoggedIn() && !isGuestMode ? getToken() : null;

  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    // Token expirado: tenta renovar automaticamente (uma única vez)
    if (res.status === 401 && !_isRetry && !isGuestMode) {
      const refreshed = await refreshSession();
      if (refreshed) return apiRequest(path, options, true, _retryCount);
      logout();
      return;
    }

    // Erro 5xx ou rede: retry com backoff
    if ((res.status >= 500 || res.status === 0) && _retryCount < MAX_RETRIES) {
      const delay = 1000 * (_retryCount + 1);
      console.warn(`[API] Retry ${_retryCount + 1}/${MAX_RETRIES} em ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      return apiRequest(path, options, _isRetry, _retryCount + 1);
    }

    if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
    return data;
  } catch (err) {
    // Erro de rede: retry
    if (err.name === 'TypeError' && _retryCount < MAX_RETRIES) {
      const delay = 1000 * (_retryCount + 1);
      console.warn(`[API] Erro de rede, retry em ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      return apiRequest(path, options, _isRetry, _retryCount + 1);
    }
    throw err;
  }
}

// ─── Valida o token atual no servidor ─────────────────────────────────────────
async function validateToken() {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Renova o token usando o refresh token ────────────────────────────────────
async function refreshSession() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      console.warn('[Session] Falha ao renovar refresh token');
      return false;
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    console.log('[Session] Token renovado com sucesso');
    return true;
  } catch (err) {
    console.error('[Session] Erro ao renovar:', err);
    return false;
  }
}

// ─── Verifica e restaura a sessão ao carregar a página ──────────────────────────
async function restoreSession() {
  if (!isLoggedIn()) return; // Sem tokens salvos

  const isValid = await validateToken();
  if (isValid) {
    console.log('[Session] Token válido, mantendo sessão');
    return;
  }

  console.log('[Session] Token expirado, tentando renovar...');
  const refreshed = await refreshSession();
  
  if (!refreshed) {
    console.log('[Session] Falha ao renovar, fazendo logout');
    logout();
  } else {
    console.log('[Session] Sessão restaurada com sucesso');
  }
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────
function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

function getToken() {
  return localStorage.getItem('token');
}

function isLoggedIn() {
  return !!getToken() && !!getUser();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isGuest');
  window.location.href = '/index.html';
}

// ─── Formata tempo (segundos → mm:ss) ────────────────────────────────────────
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Categorias ───────────────────────────────────────────────────────────────
const CATEGORY_LABELS = {
  humanas: 'Humanas', exatas: 'Exatas', completa: 'Prova Completa',
};
