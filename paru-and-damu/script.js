// ====== Photos ======
const photos = [
  {src:"images/flagsFest.jpg", cap:"under a thousand colors"},
  {src:"images/chipsHug.jpg", cap:"chips, hugs & forever"},
  {src:"images/theaterLook.jpg", cap:"the look that said everything"},
  {src:"images/formalHall.jpg", cap:"a quiet, dressed-up day"},
  {src:"images/flameShirts.jpg", cap:"matching flames, matching hearts"},
  {src:"images/sunglasses.jpg", cap:"too cool, still in love"},
  {src:"images/polkaBench.jpg", cap:"golden hour, golden us"},
  {src:"images/greyCozy.jpg", cap:"soft sky, softer you"},
  {src:"images/pinkCandid.jpg", cap:"my favorite person, my favorite frame"},
  {src:"images/hoodieHide.jpg", cap:"peek-a-boo, paru"},
];

// build gallery
const grid = document.getElementById("grid");
photos.forEach(p=>{
  const c = document.createElement("div");
  c.className = "card";
  c.dataset.cap = p.cap;
  c.innerHTML = `<img loading="lazy" src="${p.src}" alt="${p.cap}" />`;
  c.onclick = ()=>openLightbox(p.src);
  grid.appendChild(c);
});

// lightbox
function openLightbox(src){
  document.getElementById("lightboxImg").src = src;
  document.getElementById("lightbox").classList.remove("hidden");
}
function closeLightbox(){
  document.getElementById("lightbox").classList.add("hidden");
}

// ====== Floating hearts background ======
const heartsBg = document.getElementById("hearts");
function spawnHeart(){
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = ["♡","♥","❣","✿"][Math.floor(Math.random()*4)];
  h.style.left = Math.random()*100 + "vw";
  h.style.fontSize = (12 + Math.random()*22) + "px";
  h.style.animationDuration = (6 + Math.random()*8) + "s";
  h.style.color = Math.random() > .5 ? "#ff5d8f" : "#ffd6a5";
  heartsBg.appendChild(h);
  setTimeout(()=>h.remove(), 15000);
}
setInterval(spawnHeart, 600);

// ====== Quotes rotation ======
const quotes = [
  '"In a room full of art, I\'d still stare at you."',
  '"You are my Onam — beginning, festival, home."',
  '"Achu loves his Paru. That\'s the whole poem."',
  '"October didn\'t end — it became us."',
  '"Some people you meet. You. I recognized."',
  '"Of all the chips we shared, you were always my favorite flavor."',
  '"Every dance step led me here. To you."',
  '"My birthday wish came true three days early."',
];
let qi = 0;
const qEl = document.getElementById("quote");
setInterval(()=>{
  qEl.style.opacity = 0;
  setTimeout(()=>{
    qi = (qi+1) % quotes.length;
    qEl.textContent = quotes[qi];
    qEl.style.opacity = 1;
  }, 600);
}, 4500);

// ====== Music ======
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
musicBtn.onclick = ()=>{
  if(music.paused){
    music.play().then(()=>{
      musicBtn.classList.add("playing");
      musicBtn.textContent = "❚❚";
    }).catch(()=>{});
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "♪";
  }
};

// ====== Game: Scratch to Reveal ======
const memoryPool = [
  {img:"images/flagsFest.jpg",   text:"Under a thousand colors — but I only saw you."},
  {img:"images/chipsHug.jpg",    text:"This hug. I'd press pause here forever."},
  {img:"images/theaterLook.jpg", text:"You looked at me and I forgot the movie's name."},
  {img:"images/polkaBench.jpg",  text:"Golden hour. Golden you. Golden us."},
  {img:"images/flameShirts.jpg", text:"Matching shirts, matching madness — my favorite chaos."},
  {img:"images/sunglasses.jpg",  text:"I wear shades. You shine through anyway."},
  {img:"images/formalHall.jpg",  text:"Even in a quiet hallway, you make the world louder."},
  {img:"images/greyCozy.jpg",    text:"A grey sky never looked this warm."},
  {img:"images/pinkCandid.jpg",  text:"Caught you mid-laugh. I keep this one in my pocket."},
  {img:"images/hoodieHide.jpg",  text:"Peek-a-boo, Paru. I'll always find you."},
];

const board = document.getElementById("gameArea");
const revealedEl = document.getElementById("revealed");
const totalCardsEl = document.getElementById("totalCards");

const CARD_COUNT = 6;
totalCardsEl.textContent = CARD_COUNT;
let revealedCount = 0;

function shuffle(a){
  for (let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function startGame(){
  board.innerHTML = "";
  revealedCount = 0;
  revealedEl.textContent = 0;
  const picks = shuffle([...memoryPool]).slice(0, CARD_COUNT);
  picks.forEach(buildScratchCard);
}

function buildScratchCard(mem){
  const card = document.createElement("div");
  card.className = "scratch-card";
  card.innerHTML = `
    <img class="scratch-photo" src="${mem.img}" alt="hidden memory" />
    <div class="scratch-caption">${mem.text}</div>
    <canvas class="scratch-canvas"></canvas>
    <div class="scratch-hint">scratch me ♡</div>`;
  board.appendChild(card);

  const canvas = card.querySelector(".scratch-canvas");
  const hint   = card.querySelector(".scratch-hint");
  const ctx    = canvas.getContext("2d");
  let drawing = false;
  let scratched = 0;
  let revealed = false;

  function sizeCanvas(){
    const r = card.getBoundingClientRect();
    canvas.width  = r.width;
    canvas.height = r.height;
    // pink gradient cover
    const g = ctx.createLinearGradient(0,0,r.width,r.height);
    g.addColorStop(0,"#c9184a");
    g.addColorStop(1,"#ff5d8f");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,r.width,r.height);
    // sparkles
    ctx.fillStyle = "rgba(255,214,165,.55)";
    for(let i=0;i<14;i++){
      const x=Math.random()*r.width, y=Math.random()*r.height;
      ctx.beginPath(); ctx.arc(x,y,Math.random()*3+1,0,Math.PI*2); ctx.fill();
    }
    ctx.font = "26px 'Caveat', cursive";
    ctx.fillStyle = "rgba(255,241,230,.85)";
    ctx.textAlign = "center";
    ctx.fillText("♡  scratch  ♡", r.width/2, r.height/2);
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  ctx.globalCompositeOperation = "destination-out";

  function pos(e){
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }

  function scratch(e){
    if (revealed) return;
    e.preventDefault();
    const {x,y} = pos(e);
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI*2);
    ctx.fill();
    hint.style.opacity = 0;
    scratched++;
    if (scratched % 8 === 0) checkReveal();
  }

  function checkReveal(){
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let clear = 0;
    // sample every 40th pixel for speed
    for (let i=3; i<data.length; i+=160) if (data[i] === 0) clear++;
    const ratio = clear / (data.length/160);
    if (ratio > 0.55) revealCard();
  }

  function revealCard(){
    revealed = true;
    card.classList.add("revealed");
    revealedCount++;
    revealedEl.textContent = revealedCount;
    setTimeout(()=>showReward(mem), 400);
    if (revealedCount === CARD_COUNT){
      setTimeout(()=>showReward({
        img: "images/pinkCandid.jpg",
        text: "Every card, every memory — uncovered. Just like you uncovered me. ♡"
      }), 1200);
    }
  }

  canvas.addEventListener("mousedown",  e=>{drawing=true; scratch(e);});
  canvas.addEventListener("mousemove",  e=>{ if(drawing) scratch(e); });
  window.addEventListener("mouseup",    ()=>drawing=false);
  canvas.addEventListener("touchstart", e=>{drawing=true; scratch(e);}, {passive:false});
  canvas.addEventListener("touchmove",  e=>{ if(drawing) scratch(e); }, {passive:false});
  canvas.addEventListener("touchend",   ()=>{drawing=false; checkReveal();});
}

document.getElementById("startGame").onclick = startGame;
startGame();

function showReward(m){
  document.getElementById("rewardImg").src = m.img;
  document.getElementById("rewardText").textContent = m.text;
  document.getElementById("reward").classList.remove("hidden");
}
function closeReward(){
  document.getElementById("reward").classList.add("hidden");
}
