const player = {
  name: "KODYS",
  maxHp: 20,
  hp: 20,
  items: 3,
  walk: { progress: 240, y: 50, speed: 3.2 },
  soul: { x: 160, y: 105, size: 7, speed: 3.1, cooldown: 0 },
};

const encounters = [
  { id: "zaichik", name: "Пакостный Заяц", sprite: "zaichik.jpg", hp: 34, maxHp: 34, mercyActs: 2, mercyText: "Ты смотришь на зайца без страха. Он резко теряет запал.", intro: "* Пакостный заяц: \"Все дороги ведут в рим\"", turnText: "* Заяц кидает мелкие пакости.", pattern: "bunnies", damageScale: 1 },
  { id: "mellstroy", name: "MELLSTROY", sprite: "mellstroy.jpg", hp: 58, maxHp: 58, mercyActs: 3, mercyText: "Ты игнорируешь шум. Mellstroy теряет лицо.", intro: "* MELLSTROY: \"Шо ты лысый плаки плаки?\"", turnText: "* Mellstroy устраивает громкий хаос.", pattern: "burst", damageScale: 1.35 },
  { id: "yaponec", name: "YAPONEC", sprite: "yaponec.png", hp: 82, maxHp: 82, mercyActs: 3, mercyText: "Yaponec сбился с ритма и перестал давить.", intro: "* YAPONEC: \"Чето не багаеться...\"", turnText: "* YAPONEC засыпает арену быстрыми атаками.", pattern: "burst", damageScale: 1.6 },
  { id: "zaipalchik", name: "ZAIPALCHIK", sprite: "zaipalchik.png", hp: 96, maxHp: 96, mercyActs: 4, mercyText: "Zaipalchik замирает и больше не напирает.", intro: "* ZAIPALCHIK: \"Ало монотон? да да завтра!!!\"", turnText: "* Zaipalchik давит тяжелыми залпами.", pattern: "burst", damageScale: 1.8 },
  { id: "sixseven", name: "SIXSEVEN", sprite: "sixseven.png", hp: 220, maxHp: 220, mercyActs: 99, mercyText: "SIXSEVEN даже не заметил попытку диалога.", intro: "* SIXSEVEN: \"67 67 67 67 67\"", turnText: "* SIXSEVEN начинает почти невозможный паттерн.", pattern: "hell", damageScale: 2.2 },
];

const corridorLength = 5200;
const encounterPoints = [980, 2140, 3380, 4300, 4940];

const state = {
  scene: "menu",
  keys: new Set(),
  currentEncounter: 0,
  difficulty: "normal",
  battlePhase: "menu",
  selectedAction: 0,
  selectedTitle: 0,
  actCount: 0,
  bullets: [],
  bulletTimer: 0,
  defenseTimer: 0,
  attackMeter: false,
  attackCursor: 0,
  attackDirection: 1,
  typingTimer: null,
  skipTyping: false,
  approachActive: false,
  approachTarget: 0,
  encounterTriggered: false,
  audioUnlocked: false,
  ambienceStarted: false,
  lastStepAt: 0,
};

const menuScene = document.getElementById("menuScene");
const worldScene = document.getElementById("worldScene");
const battleScene = document.getElementById("battleScene");
const corridorTrack = document.getElementById("corridorTrack");
const visionMask = document.getElementById("visionMask");
const playerEl = document.getElementById("player");
const worldEnemy = document.getElementById("worldEnemy");
const worldEnemySprite = document.getElementById("worldEnemySprite");
const enemyStage = document.getElementById("enemyStage");
const enemyPortrait = document.getElementById("enemyPortrait");
const dialogueText = document.getElementById("dialogueText");
const hpFill = document.getElementById("hpFill");
const hpText = document.getElementById("hpText");
const nameLabel = document.getElementById("nameLabel");
const menuInfo = document.getElementById("menuInfo");
const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");
const menuButtons = [...document.querySelectorAll(".menu-btn")];
const titleButtons = [...document.querySelectorAll(".title-option")];
const difficultyButtons = [...document.querySelectorAll(".difficulty-option")];
const attackMeterEl = document.getElementById("attackMeter");
const attackCursorEl = document.getElementById("attackCursor");
const audioMap = {
  zaichik: document.getElementById("zaichikSound"),
  mellstroy: document.getElementById("mellstroySound"),
  yaponec: document.getElementById("yaponecSound"),
  sixseven: document.getElementById("sixsevenSound"),
};
const ambientSound = document.getElementById("ambientSound");
const stepSound = document.getElementById("stepSound");

const actionOrder = ["fight", "act", "item", "mercy"];
const difficultyConfig = {
  super_easy: { hp: 40, damageMult: 0.25, defenseMult: 0.68, bulletRateMult: 0.58 },
  easy: { hp: 24, damageMult: 0.7, defenseMult: 0.86, bulletRateMult: 0.84 },
  normal: { hp: 20, damageMult: 1, defenseMult: 1, bulletRateMult: 1 },
  hard: { hp: 16, damageMult: 1.35, defenseMult: 1.18, bulletRateMult: 1.22 },
};
const titleInfo = [
  "Нажми Z, чтобы начать путь.",
  "Это длинная карта-маршрут в духе underground map.",
  "Сбросить HP, предметы и путь к началу.",
];

let lastFrame = performance.now();

function currentEnemy() { return encounters[state.currentEncounter]; }

function setScene(scene) {
  state.scene = scene;
  menuScene.classList.toggle("scene-active", scene === "menu");
  worldScene.classList.toggle("scene-active", scene === "world");
  battleScene.classList.toggle("scene-active", scene === "battle");
}

function typeText(text, instant = false) {
  clearInterval(state.typingTimer);
  state.skipTyping = false;
  if (instant) {
    dialogueText.textContent = text;
    return;
  }
  dialogueText.textContent = "";
  let i = 0;
  state.typingTimer = setInterval(() => {
    if (state.skipTyping) {
      dialogueText.textContent = text;
      clearInterval(state.typingTimer);
      return;
    }
    dialogueText.textContent += text[i] || "";
    i += 1;
    if (i >= text.length) clearInterval(state.typingTimer);
  }, 18);
}

function updateHud() {
  nameLabel.textContent = player.name;
  hpText.textContent = `${player.hp} / ${player.maxHp}`;
  hpFill.style.width = `${(player.hp / player.maxHp) * 100}%`;
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function startAmbience() {
  if (state.ambienceStarted) return;
  ambientSound.volume = 0.22;
  ambientSound.currentTime = 0;
  ambientSound.play().then(() => {
    state.audioUnlocked = true;
    state.ambienceStarted = true;
  }).catch(() => {});
}

function playStepSound() {
  const now = performance.now() / 1000;
  if (now - state.lastStepAt < 0.22) return;
  state.lastStepAt = now;
  stepSound.pause();
  stepSound.currentTime = 0;
  stepSound.volume = 0.24;
  stepSound.play().catch(() => {});
}

function updatePlayerSprite() {
  playerEl.style.left = `${player.walk.progress}px`;
  playerEl.style.top = `${player.walk.y}%`;
  const viewportWidth = Math.max(worldScene.clientWidth || 0, 1200);
  const cameraX = clamp(player.walk.progress - viewportWidth * 0.22, 0, corridorLength - viewportWidth);
  corridorTrack.style.transform = `translateX(${-cameraX}px)`;
  const visionX = ((player.walk.progress - cameraX) / Math.max(viewportWidth, 1)) * 100;
  visionMask.style.setProperty("--vision-x", `${visionX}%`);
  visionMask.style.setProperty("--vision-y", `${player.walk.y}%`);
}

function renderTitleMenu() {
  titleButtons.forEach((button, index) => button.classList.toggle("active", index === state.selectedTitle));
  difficultyButtons.forEach((button) => button.classList.toggle("active", button.dataset.difficulty === state.difficulty));
  menuInfo.textContent = titleInfo[state.selectedTitle];
}

function resetGame() {
  player.maxHp = difficultyConfig[state.difficulty].hp;
  player.hp = player.maxHp;
  player.items = 3;
  player.walk.progress = 240;
  player.walk.y = 50;
  state.currentEncounter = 0;
  state.approachActive = false;
  state.encounterTriggered = false;
  encounters.forEach((enemy) => {
    enemy.hp = enemy.maxHp;
    enemy.spareable = false;
  });
  updateHud();
  updatePlayerSprite();
}

function activateMenuOption() {
  if (state.selectedTitle === 0) {
    player.maxHp = difficultyConfig[state.difficulty].hp;
    player.hp = player.maxHp;
    updateHud();
    startAmbience();
    setScene("world");
    return;
  }
  if (state.selectedTitle === 1) {
    menuInfo.textContent = "Порядок: заяц -> mellstroy -> yaponec -> sixseven.";
    return;
  }
  resetGame();
  menuInfo.textContent = "Прогресс сброшен.";
}

function playEncounterSound() {
  const enemy = currentEnemy();
  Object.values(audioMap).forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  const audio = audioMap[enemy.id];
  if (!audio) return;
  audio.playbackRate = enemy.id === "sixseven" ? 0.88 : enemy.id === "yaponec" ? 1.08 : 1;
  audio.play().catch(() => {});
}

function renderEnemyStage() {
  const enemy = currentEnemy();
  enemyStage.innerHTML = `<div class="enemy-title ${enemy.id === "sixseven" ? "boss" : ""}">${enemy.name}</div>`;
  enemyPortrait.innerHTML = `<img src="${enemy.sprite}" alt="${enemy.name}">`;
}

function renderMenu() {
  menuButtons.forEach((button, index) => {
    button.classList.toggle("active", state.battlePhase === "menu" && state.selectedAction === index);
  });
}

function startBattle() {
  setScene("battle");
  state.battlePhase = "menu";
  state.selectedAction = 0;
  state.actCount = 0;
  state.bullets = [];
  state.attackMeter = false;
  player.soul.x = canvas.width / 2;
  player.soul.y = canvas.height / 2;
  renderEnemyStage();
  renderMenu();
  playEncounterSound();
  worldEnemy.classList.add("hidden");
  typeText(currentEnemy().intro);
}

function backToWorld(afterWin = true) {
  setScene("world");
  state.battlePhase = "menu";
  state.bullets = [];
  state.attackMeter = false;
  attackMeterEl.classList.add("hidden");
  if (afterWin) {
    state.currentEncounter += 1;
    state.encounterTriggered = false;
    state.approachActive = false;
    if (state.currentEncounter < encounterPoints.length) {
      player.walk.progress = encounterPoints[state.currentEncounter - 1] + 220;
    }
  }
  updateWorldEnemy();
  updatePlayerSprite();
}

function damageFromCursor(enemy) {
  const centerDistance = Math.abs(state.attackCursor - 50);
  if (enemy.id === "sixseven") return Math.max(1, Math.round(4 - centerDistance / 18));
  if (enemy.id === "yaponec") return Math.max(3, Math.round(11 - centerDistance / 6));
  if (enemy.id === "mellstroy") return Math.max(4, Math.round(14 - centerDistance / 5));
  return Math.max(5, Math.round(16 - centerDistance / 4.8));
}

function beginAttackMeter() {
  state.battlePhase = "attack";
  state.attackMeter = true;
  state.attackCursor = 0;
  state.attackDirection = 1;
  attackMeterEl.classList.remove("hidden");
  typeText("* Ударь точно по центру.");
}

function resolveAttack() {
  const enemy = currentEnemy();
  const damage = damageFromCursor(enemy);
  enemy.hp = clamp(enemy.hp - damage, 0, enemy.maxHp);
  state.attackMeter = false;
  attackMeterEl.classList.add("hidden");
  if (enemy.hp <= 0) {
    typeText(enemy.id === "sixseven" ? "* SIXSEVEN дрогнул." : `* ${enemy.name} повержен.`);
    setTimeout(() => backToWorld(true), 1000);
    return;
  }
  typeText(`* Урон: ${damage}.`);
  beginDefense();
}

function useAct() {
  const enemy = currentEnemy();
  state.actCount += 1;
  if (enemy.id === "sixseven") {
    typeText(`* ${enemy.mercyText}`);
    beginDefense();
    return;
  }
  if (state.actCount >= enemy.mercyActs) {
    enemy.spareable = true;
    typeText(`* ${enemy.mercyText}\n* Его можно пощадить.`);
  } else {
    typeText(`* Прогресс ACT: ${state.actCount}/${enemy.mercyActs}.`);
  }
  beginDefense();
}

function useItem() {
  if (player.items > 0 && player.hp < player.maxHp) {
    player.items -= 1;
    player.hp = clamp(player.hp + 9, 0, player.maxHp);
    updateHud();
    typeText(`* Ты съел мемный пирог. Осталось: ${player.items}.`);
    beginDefense();
    return;
  }
  typeText("* Нечего использовать.");
}

function useMercy() {
  const enemy = currentEnemy();
  if (enemy.spareable) {
    enemy.hp = 0;
    typeText(`* Ты пощадил ${enemy.name}.`);
    setTimeout(() => backToWorld(true), 900);
    return;
  }
  typeText("* Пощада сейчас невозможна.");
}

function chooseAction(action) {
  if (state.battlePhase !== "menu") return;
  if (action === "fight") beginAttackMeter();
  if (action === "act") useAct();
  if (action === "item") useItem();
  if (action === "mercy") useMercy();
}

function updateWorldEnemy() {
  if (state.currentEncounter >= encounters.length) {
    worldEnemy.classList.add("hidden");
    return;
  }
  const enemy = currentEnemy();
  worldEnemySprite.src = enemy.sprite;
  worldEnemySprite.alt = enemy.name;
  if (state.approachActive || player.walk.progress > encounterPoints[state.currentEncounter] - 440) {
    worldEnemy.classList.remove("hidden");
    worldEnemy.style.left = `${state.approachActive ? state.approachTarget : encounterPoints[state.currentEncounter]}px`;
  } else {
    worldEnemy.classList.add("hidden");
  }
}

function beginDefense() {
  state.battlePhase = "defense";
  state.defenseTimer = (currentEnemy().id === "sixseven" ? 7.5 : 4.8) * difficultyConfig[state.difficulty].defenseMult;
  state.bulletTimer = 0;
  state.bullets = [];
  playEncounterSound();
  setTimeout(() => {
    if (state.battlePhase === "defense") typeText(currentEnemy().turnText, true);
  }, 120);
}

function spawnBullet(enemy) {
  if (enemy.pattern === "bunnies") {
    state.bullets.push({ x: 20 + Math.random() * (canvas.width - 40), y: -8, vx: 0, vy: 2.7, size: 10, color: "#fff" });
    return;
  }
  if (enemy.pattern === "burst") {
    const side = Math.random() > 0.5 ? 1 : -1;
    state.bullets.push({ x: side > 0 ? canvas.width + 10 : -10, y: 35 + Math.random() * (canvas.height - 70), vx: side > 0 ? -3.4 : 3.4, vy: Math.sin(performance.now() / 130) * 0.9, size: 11, color: "#fff" });
    if (Math.random() > 0.55) state.bullets.push({ x: 40 + Math.random() * (canvas.width - 80), y: -12, vx: 0, vy: 3.8, size: 12, color: "#3aa3ff" });
    return;
  }
  const angle = Math.random() * Math.PI * 2;
  const speed = 2.6 + Math.random() * 2.7;
  const side = Math.floor(Math.random() * 4);
  const spawn = [
    { x: Math.random() * canvas.width, y: -12 },
    { x: canvas.width + 12, y: Math.random() * canvas.height },
    { x: Math.random() * canvas.width, y: canvas.height + 12 },
    { x: -12, y: Math.random() * canvas.height },
  ][side];
  state.bullets.push({ x: spawn.x, y: spawn.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: 12, color: Math.random() > 0.5 ? "#fff" : "#ff2b2b" });
}

function damagePlayer(amount) {
  if (player.soul.cooldown > 0) return;
  const scaledDamage = Math.max(1, Math.round(amount * difficultyConfig[state.difficulty].damageMult));
  player.hp = clamp(player.hp - scaledDamage, 0, player.maxHp);
  player.soul.cooldown = 0.5;
  updateHud();
  if (player.hp <= 0) {
    typeText("* Ты пал в мемной тьме.\n* Нажми RESET в меню для новой попытки.");
    state.battlePhase = "ended";
  }
}

function updateWorld() {
  if (state.scene !== "world") return;
  let moved = false;
  if (!state.approachActive) {
    if (state.keys.has("ArrowLeft") || state.keys.has("a")) { player.walk.progress -= player.walk.speed; moved = true; }
    if (state.keys.has("ArrowRight") || state.keys.has("d")) { player.walk.progress += player.walk.speed; moved = true; }
    if (state.keys.has("ArrowUp") || state.keys.has("w")) { player.walk.y -= 0.08; moved = true; }
    if (state.keys.has("ArrowDown") || state.keys.has("s")) { player.walk.y += 0.08; moved = true; }
  }

  if (moved) {
    startAmbience();
    playStepSound();
  }

  player.walk.progress = clamp(player.walk.progress, 180, corridorLength - 160);
  player.walk.y = clamp(player.walk.y, 45, 55);

  if (state.currentEncounter < encounterPoints.length && !state.encounterTriggered) {
    const point = encounterPoints[state.currentEncounter];
    if (player.walk.progress >= point - 250) {
      state.encounterTriggered = true;
      state.approachActive = true;
      state.approachTarget = point;
      updateWorldEnemy();
      typeText(`* В темноте кто-то появился...`, true);
    }
  }

  if (state.approachActive) {
    const target = player.walk.progress + 165;
    state.approachTarget += (target - state.approachTarget) * 0.065;
    if (Math.abs(state.approachTarget - target) < 4) {
      state.approachActive = false;
      startBattle();
      return;
    }
  }

  updateWorldEnemy();
  updatePlayerSprite();
}

function updateBattle(delta) {
  if (state.scene !== "battle") return;
  if (state.attackMeter) {
    state.attackCursor += state.attackDirection * delta * 82;
    if (state.attackCursor >= 100) {
      state.attackCursor = 100;
      state.attackDirection = -1;
    }
    if (state.attackCursor <= 0) {
      state.attackCursor = 0;
      state.attackDirection = 1;
    }
    attackCursorEl.style.left = `calc(${state.attackCursor}% - 5px)`;
  }
  if (state.battlePhase !== "defense") return;

  let dx = 0;
  let dy = 0;
  if (state.keys.has("ArrowLeft") || state.keys.has("a")) dx -= player.soul.speed;
  if (state.keys.has("ArrowRight") || state.keys.has("d")) dx += player.soul.speed;
  if (state.keys.has("ArrowUp") || state.keys.has("w")) dy -= player.soul.speed;
  if (state.keys.has("ArrowDown") || state.keys.has("s")) dy += player.soul.speed;
  player.soul.x = clamp(player.soul.x + dx, player.soul.size, canvas.width - player.soul.size);
  player.soul.y = clamp(player.soul.y + dy, player.soul.size, canvas.height - player.soul.size);

  state.defenseTimer -= delta;
  state.bulletTimer -= delta;
  if (state.bulletTimer <= 0) {
    const enemy = currentEnemy();
    const bulletRateMult = difficultyConfig[state.difficulty].bulletRateMult;
    spawnBullet(enemy);
    if (enemy.id === "sixseven") {
      if (Math.random() > 0.3) spawnBullet(enemy);
      if (Math.random() > 0.68) spawnBullet(enemy);
      state.bulletTimer = 0.08 / bulletRateMult;
    } else if (enemy.id === "mellstroy") {
      state.bulletTimer = 0.16 / bulletRateMult;
    } else if (enemy.id === "zaipalchik") {
      state.bulletTimer = 0.14 / bulletRateMult;
    } else {
      state.bulletTimer = 0.24 / bulletRateMult;
    }
  }

  const enemy = currentEnemy();
  state.bullets.forEach((bullet) => {
    bullet.x += bullet.vx;
    bullet.y += bullet.vy;
    const hit = Math.abs(bullet.x - player.soul.x) < bullet.size * 0.7 + player.soul.size && Math.abs(bullet.y - player.soul.y) < bullet.size * 0.7 + player.soul.size;
    if (hit) damagePlayer(Math.max(1, Math.round(enemy.damageScale)));
  });
  state.bullets = state.bullets.filter((bullet) => bullet.x > -18 && bullet.x < canvas.width + 18 && bullet.y > -18 && bullet.y < canvas.height + 18);
  if (player.soul.cooldown > 0) player.soul.cooldown -= delta;
  if (state.defenseTimer <= 0 && player.hp > 0) {
    state.battlePhase = "menu";
    state.bullets = [];
    typeText("* Твой ход.");
    renderMenu();
  }
}

function drawHeart(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.lineTo(x - size * 0.55, y - size * 0.15);
  ctx.lineTo(x - size * 0.2, y - size * 0.65);
  ctx.lineTo(x, y - size * 0.4);
  ctx.lineTo(x + size * 0.2, y - size * 0.65);
  ctx.lineTo(x + size * 0.55, y - size * 0.15);
  ctx.closePath();
  ctx.fill();
}

function drawBullet(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawBattle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  state.bullets.forEach((bullet) => drawBullet(bullet.x, bullet.y, bullet.size, bullet.color));
  drawHeart(player.soul.x, player.soul.y, player.soul.size * 1.7, player.soul.cooldown > 0 ? "#fff" : "#ff2b2b");
}

function loop(now) {
  const delta = Math.min((now - lastFrame) / 1000, 0.033);
  lastFrame = now;
  updateWorld();
  updateBattle(delta);
  drawBattle();
  requestAnimationFrame(loop);
}

function onKeyDown(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  state.keys.add(key);

  if (key === "x") {
    state.skipTyping = true;
    if (state.scene === "world") {
      setScene("menu");
      renderTitleMenu();
    }
  }

  if (state.scene === "menu") {
    if (key === "ArrowLeft") {
      state.selectedTitle = (state.selectedTitle + titleButtons.length - 1) % titleButtons.length;
      renderTitleMenu();
    }
    if (key === "ArrowRight") {
      state.selectedTitle = (state.selectedTitle + 1) % titleButtons.length;
      renderTitleMenu();
    }
    if (key === "ArrowUp") {
      const order = ["super_easy", "easy", "normal", "hard"];
      const currentIndex = order.indexOf(state.difficulty);
      state.difficulty = order[(currentIndex + order.length - 1) % order.length];
      player.maxHp = difficultyConfig[state.difficulty].hp;
      player.hp = player.maxHp;
      renderTitleMenu();
      updateHud();
    }
    if (key === "ArrowDown") {
      const order = ["super_easy", "easy", "normal", "hard"];
      const currentIndex = order.indexOf(state.difficulty);
      state.difficulty = order[(currentIndex + 1) % order.length];
      player.maxHp = difficultyConfig[state.difficulty].hp;
      player.hp = player.maxHp;
      renderTitleMenu();
      updateHud();
    }
    if (key === "z" || key === "Enter") activateMenuOption();
    return;
  }

  if (state.scene !== "battle") return;
  if (state.battlePhase === "menu") {
    if (key === "ArrowLeft") {
      state.selectedAction = (state.selectedAction + actionOrder.length - 1) % actionOrder.length;
      renderMenu();
    }
    if (key === "ArrowRight") {
      state.selectedAction = (state.selectedAction + 1) % actionOrder.length;
      renderMenu();
    }
    if (key === "z") chooseAction(actionOrder[state.selectedAction]);
  } else if (state.battlePhase === "attack" && key === "z") {
    resolveAttack();
  }
}

function onKeyUp(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  state.keys.delete(key);
}

titleButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    state.selectedTitle = index;
    renderTitleMenu();
    activateMenuOption();
  });
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.difficulty = button.dataset.difficulty;
    player.maxHp = difficultyConfig[state.difficulty].hp;
    player.hp = player.maxHp;
    renderTitleMenu();
    updateHud();
  });
});

menuButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (state.scene !== "battle" || state.battlePhase !== "menu") return;
    state.selectedAction = index;
    renderMenu();
    chooseAction(button.dataset.action);
  });
});

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

updateHud();
updatePlayerSprite();
renderTitleMenu();
requestAnimationFrame(loop);
