let audioCtx = null;
let isMusicPlaying = false;

// Complete OG 4-Line Happy Birthday Melody
const melodyNotes = [
  // Line 1: Happy birthday to you
  { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 1.2 },
  // Line 2: Happy birthday to you
  { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.2 },
  // Line 3: Happy birthday dear friend
  { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 0.8 }, { f: 293.66, d: 1.2 },
  // Line 4: Happy birthday to you
  { f: 466.16, d: 0.4 }, { f: 466.16, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.2 }
];

function startBackgroundMusic() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  let noteIndex = 0;
  function playNextNote() {
    if (!isMusicPlaying) return;
    const n = melodyNotes[noteIndex % melodyNotes.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = n.f;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (n.d * 0.9));
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + n.d);
    
    noteIndex++;
    setTimeout(playNextNote, n.d * 1000);
  }
  
  playNextNote();
}

function clickEnvelope() {
  document.querySelector('.envelope-wrapper').classList.add('open');
  startBackgroundMusic();
  setTimeout(() => nextPage(2), 500);
}

function nextPage(pageNum) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(`page${pageNum}`).classList.add('active');

  if (pageNum === 4) {
    initKnifeDrag();
  }
  
  if (pageNum === 6) {
    // Auto load Delara's letter first
    showTab('delara');
  }
}

/* Blow all candles out at once */
function blowCandles() {
  const flames = document.querySelectorAll('.flame');
  flames.forEach(f => f.classList.add('out'));
  triggerConfetti();
  document.getElementById('afterBlowBtn').style.display = 'inline-block';
}

/* Confetti Burst */
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#c084fc', '#e9d5ff', '#ffb703', '#ffffff', '#9333ea'];

  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 12,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    if (pieces.some(p => p.y < canvas.height)) {
      requestAnimationFrame(update);
    }
  }
  update();
}

/* OG Vertical Knife Drag Logic */
function initKnifeDrag() {
  const knife = document.getElementById('knife');
  const sliceLine = document.getElementById('sliceLine');
  const afterCutBtn = document.getElementById('afterCutBtn');

  let isDragging = false;
  let startY = 0;

  function onStart(e) {
    isDragging = true;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
  }

  function onMove(e) {
    if (!isDragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    let deltaY = currentY - startY;

    if (deltaY > 0 && deltaY <= 110) {
      knife.style.transform = `translateY(${deltaY}px) rotate(-15deg)`;
      sliceLine.style.height = `${deltaY}px`;
    }

    if (deltaY >= 95) {
      isDragging = false;
      knife.style.transform = `translateY(110px) rotate(-40deg)`;
      sliceLine.style.height = `110px`;
      afterCutBtn.style.display = 'inline-block';
    }
  }

  function onEnd() {
    isDragging = false;
  }

  knife.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  knife.addEventListener('touchstart', onStart);
  window.addEventListener('touchmove', onMove);
  window.addEventListener('touchend', onEnd);
}

const readTabs = { delara: false, ellen: false, shadow: false };

const letters = {
  delara: `Haii cookie :p\nUnlike those two creatures, I AM good with birthdays, cause i don't think it's that hard, it can be as simple as 'happy birthday i hope you have a great day with your family and friends' but i am gonna step up ofc i am not your usual cupcake, i made this whole thing just for you, yk how sweet that is? because this is what i learn for, for a smile on your face :) So yeah i don't want you to worry about anything no 'i don't deserve this' or 'you didn't have to' all i want is a smile and a thank you, you are allowed to exagerate if you want, and yea i hope i really hope it made you really happy (cause it took me 3 tutorial videos or so, but it was worth it ofc).\nHAPPY BIRTHDAY I LOVE YOU SO MUCH MY SWEET AND ONLY COOKIE :3`,
  
  ellen: `I’m not too good with birthdays. I usually just wish them a happy birthday. Besides I’ve known you guys for a week now… i don’t know much to say in that week I’ve known you guys 😅`,
  
  shadow: `Heyy bunny!!\nThis is kind of last minute so I just want you to know that you are a great friend and that you deserve to be happy. Put a smile on your face and when the world gives you bs, you shoot it. ^^ Anyways, Happy Birthday (DON'T DIE PLEASE) and hope you enjoy today and laugh a lot and feel at peace with yourself. Life is fun and this is just another year, I want you to make the next year the best yk yk.\nHappy Birthday,\nShadow :D`
};

function showTab(tabName, evt) {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (evt) {
    evt.target.classList.add('active');
  } else {
    // Select correct button when triggered programmatically
    const targetBtn = Array.from(buttons).find(b => b.innerText.toLowerCase() === tabName);
    if (targetBtn) targetBtn.classList.add('active');
  }

  const box = document.getElementById('letterContent');
  box.innerText = letters[tabName];
  box.scrollTop = 0; // Scroll back to top on tab switch

  readTabs[tabName] = true;

  if (readTabs.delara && readTabs.ellen && readTabs.shadow) {
    document.getElementById('finalNextBtn').style.display = 'inline-block';
  }
}

function restart() {
  document.querySelectorAll('.flame').forEach(f => f.classList.remove('out'));
  document.getElementById('afterBlowBtn').style.display = 'none';
  document.getElementById('afterCutBtn').style.display = 'none';
  document.getElementById('sliceLine').style.height = '0px';
  document.getElementById('knife').style.transform = 'none';
  document.querySelector('.envelope-wrapper').classList.remove('open');
  readTabs.delara = false;
  readTabs.ellen = false;
  readTabs.shadow = false;
  document.getElementById('finalNextBtn').style.display = 'none';
  nextPage(1);
}