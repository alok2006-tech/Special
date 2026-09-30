/* ==========================================================
   ✏️  EDIT EVERYTHING BELOW — nothing else needs to change
   ========================================================== */

// 1) MUSIC — put her favourite song in /music and set the file name
const musicSrc = "music/song.mp3";

// 2) INTRO PARAGRAPH (shown under "Happy Birthday")
const introText = `Some people turn ordinary days into chaos with better memories.
Today the world celebrates that person. 😂💗`;

// 3) PHOTOS + CAPTIONS — add/remove lines; files go in /images
const photos = [
  { src: "images/khushi1.jpg", caption: "That smile 😂" },
  { src: "images/khushi2.jpg", caption: "One of my favorite memories." },
  { src: "images/khushi3.jpg", caption: "Certified chaos." },
  { src: "images/khushi4.jpg", caption: "How are you this photogenic? 😭" },
];

// 4) FRIENDSHIP MESSAGE (typed out as she scrolls)
const friendshipMessage = `YOUR MESSAGE HERE`;

// 5) CANDLE MESSAGES
const candleMessages = {
  candle1: "YOUR MESSAGE HERE (cute / funny)",
  candle2: "YOUR MESSAGE HERE (meaningful friendship)",
  candle3: "YOUR MESSAGE HERE (most special / emotional)",
};

// 6) FINAL MESSAGE (after all 3 candles)
const finalMessage = `YOUR FINAL MESSAGE HERE`;

// 7) LAST SECTION — favourite picture + lines
const finalPhoto = "images/final.jpg";
const lastLines = [
  "And no matter how much I tease you...",
  "...I'm genuinely lucky to have you as my best friend. ❤️",
  "Stay exactly the way you are.",
];

// 8) Easter egg — click the footer 5 times
const secretMessage = "Okay you found it 😭 Best friend forever. Now go eat cake!";

// 9) Blow sensitivity: lower = easier (0.10–0.25). Button always works too.
const BLOW_THRESHOLD = 0.15;

/* ================= CODE (beginners can skip) ================= */
const $ = s => document.querySelector(s);
const audio = $("#music");

/* ---- Welcome / open ---- */
$("#open").onclick = () => {
  $("#welcome").classList.add("gone");
  $("#site").hidden = false;
  audio.src = musicSrc;
  audio.play().catch(() => {}); // starts only after her click
  startFloating(1100);
  setTimeout(() => burst(40), 700);
};
$("#mute").onclick = () => { audio.muted = !audio.muted; $("#mute").textContent = audio.muted ? "🔇" : "🔊"; };
$("#introText").textContent = introText;

/* ---- Floating hearts/stars/balloons + confetti ---- */
let floatTimer;
function startFloating(every) {
  clearInterval(floatTimer);
  const items = ["💗", "✨", "⭐", "🎈", "🤍", "💜"];
  floatTimer = setInterval(() => {
    const e = document.createElement("span");
    e.className = "fl";
    e.textContent = items[Math.floor(Math.random() * items.length)];
    e.style.left = Math.random() * 96 + "vw";
    e.style.fontSize = 14 + Math.random() * 18 + "px";
    e.style.animationDuration = 7 + Math.random() * 6 + "s";
    document.body.appendChild(e);
    e.onanimationend = () => e.remove();
  }, every);
}
function burst(n, x = innerWidth / 2, y = innerHeight / 2, list = ["🎉", "✨", "💖", "🎊", "⭐", "💜"]) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.textContent = list[i % list.length];
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:95;pointer-events:none;font-size:${12 + Math.random() * 14}px`;
    document.body.appendChild(s);
    const a = Math.random() * 6.28, d = 80 + Math.random() * 200;
    s.animate([{ transform: "translate(0,0)", opacity: 1 },
      { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 120}px) rotate(${Math.random() * 500}deg)`, opacity: 0 }],
      { duration: 1400 + Math.random() * 800, easing: "ease-out" }).onfinish = () => s.remove();
  }
}
function toast(t) { const e = $("#toast"); e.textContent = t; e.hidden = false; setTimeout(() => e.hidden = true, 3500); }

/* ---- Easter eggs ---- */
$("#heart").onclick = e => burst(14, e.clientX, e.clientY, ["💗", "💖", "💕"]);
document.querySelectorAll(".star").forEach(s => s.onclick = e => burst(10, e.clientX, e.clientY, ["✨", "⭐", "✦"]));
let taps = 0;
$("#foot").onclick = () => { if (++taps === 5) { taps = 0; burst(40); toast(secretMessage); } };

/* ---- Gallery ---- */
const tilt = [-3, 2, -1.5, 3];
photos.forEach((p, i) => {
  const f = document.createElement("figure");
  f.className = "pol reveal";
  f.style.setProperty("--r", tilt[i % 4] + "deg");
  f.innerHTML = `<img src="${p.src}" alt="${p.caption}" loading="lazy"><figcaption>${p.caption}</figcaption>`;
  f.onclick = e => { $("#viewer img").src = p.src; $("#viewer p").textContent = p.caption; $("#viewer").hidden = false; burst(8, e.clientX, e.clientY, ["💗", "✨"]); };
  $("#grid").appendChild(f);
});
$("#viewer").onclick = () => $("#viewer").hidden = true;
$("#finalImg").src = finalPhoto;

/* ---- Scroll reveals + typewriter ---- */
let typed = false;
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add("in");
  if (en.target.id === "letter" && !typed) { typed = true; typeText($("#typed"), friendshipMessage); }
}), { threshold: .3 });
document.querySelectorAll(".reveal,#letter,#candles").forEach(el => { el.classList.add("reveal"); io.observe(el); });
function typeText(el, text) {
  let i = 0, timer;
  const finish = () => { clearTimeout(timer); el.textContent = text; $("#toCandles").hidden = false; };
  el.onclick = finish; // tap the message to skip the typing
  (function t() {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) timer = setTimeout(t, 32); else finish();
  })();
}

/* ---- "Continue" buttons scroll to the next section ---- */
document.querySelectorAll(".go").forEach(b => b.onclick = () =>
  document.getElementById(b.dataset.next).scrollIntoView({ behavior: "smooth" }));

/* ---- Candles ---- */
const keys = ["candle1", "candle2", "candle3"];
let active = null, prog = 0, manual = false, done = 0, micOn = false, an, buf, last = 0;
keys.forEach((k, i) => {
  const b = document.createElement("button");
  b.className = "candle";
  b.innerHTML = `<div class="flame"><i></i></div><div class="stick"></div><span>🕯️ Candle ${i + 1}</span>`;
  b.onclick = () => choose(i, b);
  $("#row").appendChild(b);
});
const candles = () => [...document.querySelectorAll(".candle")];

async function initMic() {
  if (an || !navigator.mediaDevices) return;
  try {
    const st = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    await ac.resume();
    an = ac.createAnalyser(); an.fftSize = 512;
    ac.createMediaStreamSource(st).connect(an);
    buf = new Uint8Array(an.fftSize); micOn = true;
  } catch (e) { micOn = false; }
}
async function choose(i, btn) {
  if (active !== null || btn.classList.contains("done")) return;
  active = i; prog = 0; manual = false;
  btn.classList.add("lit");
  $("#card").hidden = true;
  $("#prompt").textContent = `Candle ${i + 1} is lit 🔥`;
  $("#status").textContent = "Now blow on your mic... or tap the button.";
  $("#blow").hidden = false;
  await initMic();
  if (!micOn) $("#status").textContent = "Mic not available — just tap “Blow it out ✨”.";
  last = performance.now(); requestAnimationFrame(loop);
}
$("#blow").onclick = () => manual = true;
function loop(t) {
  if (active === null) return;
  const dt = t - last; last = t;
  if (manual) prog += dt / 1000;
  else if (micOn) {
    an.getByteTimeDomainData(buf);
    let s = 0; for (const v of buf) s += ((v - 128) / 128) ** 2;
    const rms = Math.sqrt(s / buf.length);
    prog = rms > BLOW_THRESHOLD ? prog + dt / 1200 : Math.max(0, prog - dt / 3500);
  }
  const c = candles()[active];
  c.querySelector(".flame").style.transform = `scale(${Math.max(.1, 1 - prog * .8)})`;
  if (prog >= 1) return extinguish(c);
  requestAnimationFrame(loop);
}
function extinguish(c) {
  const i = active; active = null;
  c.classList.remove("lit"); c.classList.add("out", "done");
  const sm = document.createElement("div"); sm.className = "smoke"; c.appendChild(sm); setTimeout(() => sm.remove(), 2100);
  $("#blow").hidden = true;
  const r = c.getBoundingClientRect(); burst(30, r.left + r.width / 2, r.top);
  $("#cardMsg").textContent = candleMessages[keys[i]];
  $("#card").hidden = false;
  $("#prompt").textContent = "Poof! 💨";
  $("#status").textContent = "";
  if (++done === 3) {
    $("#more").hidden = true; $("#another").hidden = true;
    setTimeout(finalSurprise, 3500);
  } else { $("#more").hidden = false; $("#another").hidden = false; }
}
$("#another").onclick = () => {
  $("#card").hidden = true;
  $("#prompt").textContent = "Choose another candle 👀";
  $("#status").textContent = `${3 - done} left...`;
};

/* ---- Final surprise ---- */
function finalSurprise() {
  $("#finalText").textContent = finalMessage;
  $("#final").hidden = false;
  startFloating(250);
  burst(70);
  const rep = setInterval(() => burst(25, Math.random() * innerWidth, Math.random() * innerHeight / 2), 900);
  $("#lastBtn").onclick = () => {
    clearInterval(rep);
    $("#final").hidden = true;
    $("#last").hidden = false;
    $("#l1").textContent = lastLines[0]; $("#l2").textContent = lastLines[1]; $("#l3").textContent = lastLines[2];
    $("#last").scrollIntoView({ behavior: "smooth" });
    startFloating(350);
  };
}
