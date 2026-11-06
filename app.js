// PathFinder Africa: app logic. The content (questions, careers, translations) is in data.js.

// ---------- State ----------
let lang = "en", step = 0, answers = [], situation = "money";
try{
  const s = JSON.parse(localStorage.getItem("pf-state") || "null");
  if(s){ lang = s.lang || lang; answers = s.answers || []; step = answers.length; situation = s.situation || situation; }
}catch(e){}
const save = () => { try{ localStorage.setItem("pf-state", JSON.stringify({lang, answers, situation})); }catch(e){} };

// ---------- Helpers ----------
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const list = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;

// ---------- Screens (tabs) ----------
const TABS = ["discover","decide","mentor","help"];
function showTab(){
  const name = TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : "discover";
  TABS.forEach(t => {
    $("#view-" + t).hidden = t !== name;
    const link = document.querySelector(`[data-tab="${t}"]`);
    if(t === name) link.setAttribute("aria-current","page"); else link.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", showTab);

// ---------- Fixed text in the current language ----------
function renderStatic(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => el.innerHTML = T[lang][el.dataset.i18n]);
  $("#btn-en").setAttribute("aria-pressed", lang === "en");
  $("#btn-fr").setAttribute("aria-pressed", lang === "fr");
  $("#situation").innerHTML = SITUATIONS.map(s => `<option value="${s.id}">${esc(s[lang].label)}</option>`).join("");
  $("#situation").value = situation;
  renderDecide();
  renderMentor();
}

// ---------- Discover: quiz ----------
function renderQuiz(){
  const t = T[lang], box = $("#quiz");
  const done = step >= QUESTIONS.length;
  $(".hero").hidden = done;   // hide the intro on the results screen
  if(done) return renderResult();
  const [q, opts] = QUESTIONS[step][lang];
  box.innerHTML = `
    <div class="progress"><span>${t.q} ${step + 1} ${t.of} ${QUESTIONS.length}</span>${step > 0 ? `<button class="btn ghost small" id="back">${t.back}</button>` : ""}</div>
    <div class="bar"><i style="width:${(step / QUESTIONS.length) * 100}%"></i></div>
    <h2>${esc(q)}</h2>
    <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>`;
  box.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    answers[step] = +b.dataset.i; step++; save(); renderQuiz();
    $("#quiz").scrollIntoView({block:"start"});
  });
  const back = $("#back");
  if(back) back.onclick = () => { step--; answers.length = step; save(); renderQuiz(); };
}

// ---------- Discover: result ----------
function renderResult(){
  const t = T[lang];
  const score = [0,0,0,0,0];
  answers.forEach(a => score[a]++);
  const order = [0,1,2,3,4].sort((a, b) => score[b] - score[a]);
  const top = PROFILES[TYPES[order[0]]], second = PROFILES[TYPES[order[1]]];
  const L = top[lang];
  $("#quiz").innerHTML = `
    <div><div class="kicker">${t.resultKicker}</div><h2>${esc(L.name)}</h2></div>
    <p>${esc(L.desc)}</p>
    ${score[order[1]] > 0 ? `<p class="second">${t.alsoStrong} <b>${esc(second[lang].name)}</b></p>` : ""}
    <h3>${t.pathsTitle}</h3>
    <div class="paths">${top.paths.map(p => `
      <div class="path"><b>${esc(lang === "en" ? p[0] : p[1])}</b>
        <span class="route">${ROUTE[lang][p[2]]}</span>
        <p class="pdesc">${esc((DESC[p[0]] || [])[lang === "en" ? 0 : 1] || "")}</p></div>`).join("")}</div>
    <div class="challenge"><h3>${t.challengeTitle}</h3><ol>${L.challenge.map(c => `<li>${esc(c)}</li>`).join("")}</ol></div>
    <div class="school"><h3>${t.schoolTitle}</h3><p>${esc(L.school)}</p></div>
    <div class="row"><button class="btn primary" id="again">${t.restart}</button></div>`;
  $("#again").onclick = () => { step = 0; answers = []; save(); renderQuiz(); window.scrollTo(0, 0); };
}

// ---------- Decide ----------
function renderDecide(){
  const t = T[lang], s = (SITUATIONS.find(x => x.id === situation) || SITUATIONS[0])[lang];
  $("#decideOut").innerHTML = `
    <div><div class="kicker">${t.askYourself}</div>${list(s.ask)}</div>
    <div><div class="kicker">${t.options}</div>${list(s.opt)}</div>
    <div><div class="kicker">${t.talkTo}</div>${list(s.talk)}</div>`;
}
$("#situation").onchange = e => { situation = e.target.value; save(); renderDecide(); };

// ---------- Mentor ----------
function renderMentor(){
  const t = T[lang];
  $("#mentorOut").innerHTML = `
    <div><div class="kicker">${t.whoTitle}</div>${list(t.who)}</div>
    <div><div class="kicker">${t.askTitle}</div>${list(t.asks)}</div>
    <div><div class="kicker">${t.safeTitle}</div>${list(t.safe)}</div>`;
  $("#msg").value = t.msg;
  $("#copied").hidden = true;
}
$("#copyMsg").onclick = () => {
  const box = $("#msg"), note = $("#copied");
  const show = txt => { note.textContent = txt; note.hidden = false; };
  const fallback = () => { box.select(); show(T[lang].copyFail); };
  try{ navigator.clipboard.writeText(box.value).then(() => show(T[lang].copiedText), fallback); }
  catch(e){ fallback(); }
};

// ---------- Help: erase answers ----------
$("#eraseBtn").onclick = () => {
  answers = []; step = 0; situation = "money";
  try{ localStorage.removeItem("pf-state"); }catch(e){}
  save(); renderStatic(); renderQuiz();
  $("#erased").hidden = false;
};

// ---------- Language ----------
function setLang(l){ lang = l; save(); renderStatic(); renderQuiz(); $("#erased").hidden = true; }
$("#btn-en").onclick = () => setLang("en");
$("#btn-fr").onclick = () => setLang("fr");

// ---------- Install as an app (Android Chrome shows this event) ----------
let installEvent = null;
let installDismissed = false;
try{ installDismissed = localStorage.getItem("pf-install-later") === "1"; }catch(e){}
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  installEvent = e;
  if(!installDismissed) $("#installCard").hidden = false;
});
$("#installBtn").onclick = async () => {
  if(!installEvent) return;
  installEvent.prompt();
  await installEvent.userChoice;
  installEvent = null;
  $("#installCard").hidden = true;
};
$("#installLater").onclick = () => {
  $("#installCard").hidden = true;
  try{ localStorage.setItem("pf-install-later", "1"); }catch(e){}
};
window.addEventListener("appinstalled", () => { $("#installCard").hidden = true; });

// ---------- Offline support ----------
if("serviceWorker" in navigator){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

// ---------- Start ----------
renderStatic();
renderQuiz();
showTab();
