// Leonida Ledger: a tracker for the 55 GTA VI trophies. Progress and notes live in
// localStorage, so the guide works fully offline and remembers where you are.
const STORE_KEY = 'leonida-ledger-v1';
const listEl = document.getElementById('trophyList');
const searchEl = document.getElementById('search');
const kindEl = document.getElementById('kind');
const gradeEl = document.getElementById('grade');
const showEl = document.getElementById('show');
const spoilerEl = document.getElementById('spoilers');
const countEl = document.getElementById('resultCount');
const emptyEl = document.getElementById('emptyState');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let saved = { earned: [], notes: {} };
try { saved = { ...saved, ...JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}') }; } catch { /* keep defaults */ }
let earned = new Set(saved.earned.filter((n) => trophies.some((t) => t.name === n)));
let notes = saved.notes || {};
let openId = null;

function persist() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ earned: [...earned], notes }));
}

function gradeLabel(g) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

function isHidden(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.name);
}

function matches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
  if (kindEl.value === 'missable' && !t.missable) return false;
  if (kindEl.value === 'online') return false;
  if (kindEl.value !== 'all' && kindEl.value !== 'missable' && t.kind !== kindEl.value) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (showEl.value === 'earned' && !earned.has(t.name)) return false;
  if (showEl.value === 'todo' && earned.has(t.name)) return false;
  return true;
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  document.getElementById('progressText').textContent = `${done} of ${total} earned`;
  document.getElementById('progressPct').textContent = `${Math.round((done / total) * 100)}%`;
  document.getElementById('progressBar').style.width = `${(done / total) * 100}%`;
  const byGrade = {};
  for (const t of trophies) byGrade[t.grade] = (byGrade[t.grade] || 0) + (earned.has(t.name) ? 1 : 0);
  document.getElementById('gradeCounts').textContent =
    ['platinum', 'gold', 'silver', 'bronze'].map((g) => `${byGrade[g] || 0} ${gradeLabel(g)}`).join(' · ');
  for (const el of document.querySelectorAll('.step-count')) {
    const stage = el.dataset.stage;
    const inStage = trophies.filter((t) => t.stage === stage);
    const got = inStage.filter((t) => earned.has(t.name)).length;
    const label = stage === 'Story' ? 'story trophies' : stage === 'Side quests' ? 'side-quest trophies' : 'cleanup trophies';
    el.textContent = `${got} of ${inStage.length} ${label}`;
  }
}

function render() {
  renderProgress();
  const visible = trophies.filter(matches);
  countEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies` + (earned.size ? ` · ${earned.size} earned` : '');
  emptyEl.hidden = visible.length > 0;
  listEl.replaceChildren();
  for (const t of visible) {
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.name) ? ' earned' : '');
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      persist(); render();
    });
    const medal = document.createElement('span');
    medal.className = `medal ${t.grade}`;
    medal.title = gradeLabel(t.grade);
    const title = document.createElement('div');
    title.className = 'trophy-title';
    const h = document.createElement('h3');
    h.textContent = isHidden(t) ? 'Hidden trophy — earn it to reveal' : t.name;
    if (isHidden(t)) h.className = 'hidden-name';
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = isHidden(t) ? 'A story trophy. Its name and description stay hidden until you earn it.' : t.description;
    const tags = document.createElement('div');
    tags.className = 'tags';
    const tagTexts = [...new Set([gradeLabel(t.grade), t.kind === 'completion' ? 'Completion' : t.kind.charAt(0).toUpperCase() + t.kind.slice(1), t.stage])];
    if (t.missable) tagTexts.push('Missable');
    if (earned.has(t.name)) tagTexts.push('Earned');
    for (const txt of tagTexts) {
      const s = document.createElement('span');
      s.className = 'tag' + (txt === 'Missable' ? ' missable' : '') + (txt === 'Earned' ? ' earned-tag' : '');
      s.textContent = txt;
      tags.append(s);
    }
    title.append(h, desc, tags);
    head.append(box, medal, title);
    head.addEventListener('click', (e) => {
      if (e.target === box) return;
      openId = openId === t.id ? null : t.id;
      render();
    });
    li.append(head);
    if (openId === t.id && !isHidden(t)) {
      const guide = document.createElement('div');
      guide.className = 'guide';
      const p = document.createElement('p');
      p.textContent = t.guide;
      guide.append(p);
      if (t.missable) {
        const warn = document.createElement('p');
        warn.innerHTML = '<strong>Missable:</strong> see the warning at the top of the page before Chapter 1 ends.';
        guide.append(warn);
      }
      const src = document.createElement('p');
      src.className = 'src';
      src.textContent = 'Sources: ';
      t.sources.forEach((s, i) => {
        if (i > 0) src.append(document.createTextNode(' · '));
        const a = document.createElement('a');
        a.href = s.url; a.textContent = s.name; a.target = '_blank'; a.rel = 'noopener';
        src.append(a);
      });
      guide.append(src);
      const noteLabel = document.createElement('label');
      noteLabel.className = 'note-label';
      noteLabel.textContent = 'Your note';
      const note = document.createElement('textarea');
      note.className = 'note';
      note.rows = 2;
      note.placeholder = 'e.g. halfway — 6 of 18 meditation spots done';
      note.value = notes[t.name] || '';
      note.addEventListener('input', () => { notes[t.name] = note.value; persist(); });
      noteLabel.append(note);
      guide.append(noteLabel);
      li.append(guide);
    }
    listEl.append(li);
  }
}

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ earned: [...earned], notes }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-ledger-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const incoming = new Set(Array.isArray(data) ? data : data.earned || []);
    earned = new Set([...incoming].filter((n) => trophies.some((t) => t.name === n)));
    notes = data.notes || {};
    persist(); render();
  } catch { alert('That file could not be read as progress data.'); }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies and notes?')) return;
  earned = new Set(); notes = {}; persist(); render();
});

for (const el of [searchEl, kindEl, gradeEl, showEl, spoilerEl]) el.addEventListener('input', render);

// Demo mode for screenshots: ?demo=1 seeds 13 earned trophies, ?spoilers=off reveals story trophies.
const params = new URLSearchParams(location.search);
if (params.get('spoilers') === 'off') spoilerEl.checked = false;
if (params.get('demo') === '1' && earned.size === 0) {
  earned = new Set(trophies.filter((t) => t.kind !== 'story' && t.grade !== 'platinum').slice(0, 13).map((t) => t.name));
  persist();
}
if (params.get('open')) openId = Number(params.get('open'));

render();
