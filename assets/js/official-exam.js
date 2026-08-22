// ENEM Speedrun — catálogo de cadernos oficiais do INEP.
//
// IMPORTANTE:
// - Os arquivos não são copiados para o projeto.
// - O iframe aponta diretamente para riep.inep.gov.br.
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
const frame = document.getElementById('pdf-frame');
const title = document.getElementById('pdf-title');
const externalLink = document.getElementById('open-external');
const loadButton = document.getElementById('load-official');

function unique(values) {
  return [...new Set(values)];
}

function fillSelect(select, values, formatter = String) {
  select.innerHTML = values.map(value =>
    `<option value="${String(value)}">${formatter(value)}</option>`
  ).join('');
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
  if (!exam) return;

  title.textContent = exam.title;
  frame.src = `${exam.pdf}#view=FitH`;
  externalLink.href = exam.pdf;
}

const years = unique(OFFICIAL_EXAMS.map(exam => exam.year)).sort((a, b) => b - a);
fillSelect(yearSelect, years);
refreshDays();
loadExam();

yearSelect.addEventListener('change', refreshDays);
daySelect.addEventListener('change', refreshBooklets);
loadButton.addEventListener('click', loadExam);

