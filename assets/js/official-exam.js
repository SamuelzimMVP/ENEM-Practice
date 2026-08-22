// ENEM Speedrun — catálogo de cadernos oficiais do INEP.
//
// IMPORTANTE:
// - Os arquivos não são copiados para o projeto.
// - Os links apontam diretamente para riep.inep.gov.br.
// - Para adicionar novos anos/cadernos, basta inserir novas entradas abaixo.

const OFFICIAL_EXAMS = [
  {
    year: 2025,
    day: 1,
    booklet: 'Amarelo',
    title: 'ENEM 2025 — 1º dia — Caderno Amarelo',
    pdf: 'https://riep.inep.gov.br/bitstreams/a11f89c6-3693-49f0-8164-2794b5dac372/download',
    source: 'https://riep.inep.gov.br/items/ca4bcb51-f523-495b-8b49-704c0f155ba8'
  },
  {
    year: 2025,
    day: 2,
    booklet: 'Amarelo',
    title: 'ENEM 2025 — 2º dia — Caderno Amarelo',
    pdf: 'https://riep.inep.gov.br/bitstreams/d43be9d0-2316-42bf-9ea7-dc4475645c52/download',
    source: 'https://riep.inep.gov.br/items/ca4bcb51-f523-495b-8b49-704c0f155ba8'
  }
];

const yearSelect = document.getElementById('official-year');
const daySelect = document.getElementById('official-day');
const bookletSelect = document.getElementById('official-booklet');
const title = document.getElementById('pdf-title');
const externalLink = document.getElementById('open-external');
const sourceLink = document.getElementById('source-link');
const selectionStatus = document.getElementById('selection-status');

function unique(values) {
  return [...new Set(values)];
}

function fillSelect(select, values, formatter = String) {
  const options = values.map(value => {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = formatter(value);
    return option;
  });
  select.replaceChildren(...options);
}

function examsForCurrentYear() {
  return OFFICIAL_EXAMS.filter(exam => exam.year === Number(yearSelect.value));
}

function refreshDays() {
  const days = unique(examsForCurrentYear().map(exam => exam.day)).sort((a, b) => a - b);
  fillSelect(daySelect, days, value => `${value}º dia`);
  refreshBooklets();
}

function refreshBooklets() {
  const exams = examsForCurrentYear().filter(exam => exam.day === Number(daySelect.value));
  const booklets = unique(exams.map(exam => exam.booklet));
  fillSelect(bookletSelect, booklets);
  loadExam();
}

function selectedExam() {
  return OFFICIAL_EXAMS.find(exam =>
    exam.year === Number(yearSelect.value) &&
    exam.day === Number(daySelect.value) &&
    exam.booklet === bookletSelect.value
  );
}

function loadExam() {
  const exam = selectedExam();
  if (!exam) {
    title.textContent = 'Caderno indisponível';
    selectionStatus.textContent = 'Não encontramos um PDF para esta combinação.';
    externalLink.removeAttribute('href');
    sourceLink.removeAttribute('href');
    externalLink.setAttribute('aria-disabled', 'true');
    sourceLink.setAttribute('aria-disabled', 'true');
    return;
  }

  title.textContent = exam.title;
  externalLink.href = exam.pdf;
  sourceLink.href = exam.source;
  externalLink.removeAttribute('aria-disabled');
  sourceLink.removeAttribute('aria-disabled');
  selectionStatus.textContent = `${exam.year} · ${exam.day}º dia · Caderno ${exam.booklet}`;
}

const years = unique(OFFICIAL_EXAMS.map(exam => exam.year)).sort((a, b) => b - a);
fillSelect(yearSelect, years);
refreshDays();
loadExam();

yearSelect.addEventListener('change', refreshDays);
daySelect.addEventListener('change', refreshBooklets);
bookletSelect.addEventListener('change', loadExam);
