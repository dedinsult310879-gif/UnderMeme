const player = {
  name: "KODYS",
  maxHp: 20,
  hp: 20,
  items: 3,
  fruit: 0,
  meat: 0,
  walk: { progress: 240, y: 50, speed: 3.2 },
  soul: { x: 160, y: 105, size: 7, speed: 3.1, cooldown: 0 },
};
const STORAGE_KEY = "undermeme-save-v1";
const PET_DEFS = {
  zaichik: { label: "ZAICHIK", speed: 0.1, damage: 0.05 },
  okak: { label: "OKAK", speed: 0.05, damage: 0 },
  mellstroy: { label: "MELLSTROY", speed: 0.15, damage: -0.03 },
  yaponec: { label: "YAPONEC", speed: 0.2, damage: 0.3 },
  yaponecdemon: { label: "YAPONEC DEMON", speed: 0.6, damage: 0.7 },
  zaipalchik: { label: "ZAIPALCHIK", speed: 0.3, damage: 0.35 },
  sixseven: { label: "SIXSEVEN", speed: 0.4, damage: 0.45 },
  chigur: { label: "CHIGUR", speed: 0.8, damage: 0.8 },
};

const encounters = [
  { id: "zaichik", name: "Пакостный Заяц", sprite: "zaichik.jpg", hp: 34, maxHp: 34, mercyActs: 2, mercyText: "Ты смотришь на зайца без страха. Он резко теряет запал.", intro: "* Пакостный заяц: \"Все дороги ведут в рим\"", turnText: "* Заяц кидает мелкие пакости.", pattern: "bunnies", damageScale: 1 },
  { id: "okak_a", name: "OKAK", sprite: "okak.jpg", hp: 12, maxHp: 12, mercyActs: 1, mercyText: "OKAK сдулся почти сразу.", intro: "* Маленький OKAK выскочил из тьмы.", turnText: "* OKAK делает один легкий выпад.", pattern: "bunnies", damageScale: 0.4, worldScale: 0.62, portraitScale: 0.72 },
  { id: "okak_b", name: "OKAK", sprite: "okak.jpg", hp: 12, maxHp: 12, mercyActs: 1, mercyText: "OKAK сдулся почти сразу.", intro: "* Еще один OKAK преградил путь.", turnText: "* OKAK делает один легкий выпад.", pattern: "bunnies", damageScale: 0.4, worldScale: 0.62, portraitScale: 0.72 },
  { id: "mellstroy", name: "MELLSTROY", sprite: "mellstroy.jpg", hp: 58, maxHp: 58, mercyActs: 3, mercyText: "Ты игнорируешь шум. Mellstroy теряет лицо.", intro: "* MELLSTROY: \"Шо ты лысый плаки плаки?\"", turnText: "* Mellstroy устраивает громкий хаос.", pattern: "burst", damageScale: 1.35 },
  { id: "okak_c", name: "OKAK", sprite: "okak.jpg", hp: 14, maxHp: 14, mercyActs: 1, mercyText: "OKAK сдулся почти сразу.", intro: "* OKAK пытается напасть исподтишка.", turnText: "* OKAK делает один легкий выпад.", pattern: "bunnies", damageScale: 0.45, worldScale: 0.62, portraitScale: 0.72 },
  { id: "yaponec", name: "YAPONEC", sprite: "yaponec.png", hp: 82, maxHp: 82, mercyActs: 3, mercyText: "Yaponec сбился с ритма и перестал давить.", intro: "* YAPONEC: \"Чето не багаеться...\"", turnText: "* YAPONEC засыпает арену быстрыми атаками.", pattern: "burst", damageScale: 1.6 },
  { id: "okak_d", name: "OKAK", sprite: "okak.jpg", hp: 14, maxHp: 14, mercyActs: 1, mercyText: "OKAK сдулся почти сразу.", intro: "* Впереди мелькает OKAK.", turnText: "* OKAK делает один легкий выпад.", pattern: "bunnies", damageScale: 0.45, worldScale: 0.62, portraitScale: 0.72 },
  { id: "okak_e", name: "OKAK", sprite: "okak.jpg", hp: 15, maxHp: 15, mercyActs: 1, mercyText: "OKAK сдулся почти сразу.", intro: "* OKAK нервно вылетает на дорожку.", turnText: "* OKAK делает один легкий выпад.", pattern: "bunnies", damageScale: 0.5, worldScale: 0.62, portraitScale: 0.72 },
  { id: "zaipalchik", name: "ZAIPALCHIK", sprite: "zaipalchik.png", hp: 96, maxHp: 96, mercyActs: 4, mercyText: "Zaipalchik замирает и больше не напирает.", intro: "* ZAIPALCHIK: \"Ало монотон? да да завтра!!!\"", turnText: "* Zaipalchik давит тяжелыми залпами.", pattern: "burst", damageScale: 1.8 },
  { id: "okak_f", name: "OKAK", sprite: "okak.jpg", hp: 16, maxHp: 16, mercyActs: 1, mercyText: "OKAK сдулся почти сразу.", intro: "* Последний OKAK мелькнул перед боссом.", turnText: "* OKAK делает один легкий выпад.", pattern: "bunnies", damageScale: 0.55, worldScale: 0.62, portraitScale: 0.72 },
  { id: "sixseven", name: "SIXSEVEN", sprite: "sixseven.png", hp: 220, maxHp: 220, mercyActs: 99, mercyText: "SIXSEVEN даже не заметил попытку диалога.", intro: "* SIXSEVEN: \"67 67 67 67 67\"", turnText: "* SIXSEVEN начинает почти невозможный паттерн.", pattern: "hell", damageScale: 2.2 },
];
const yaponecDemon = { id: "yaponecdemon", name: "YAPONEC DEMON", sprite: "yaponecdemon.png", hp: 120, maxHp: 120, mercyActs: 99, mercyText: "Демон не собирается слушать.", intro: "* YAPONEC DEMON восстал из ошибки.", turnText: "* YAPONEC DEMON швыряет яростные залпы.", pattern: "hell", damageScale: 2 };
const chigurBoss = { id: "chigur", name: "ANTON CHIGUR", sprite: "chigur.jpg", hp: 320, maxHp: 320, mercyActs: 99, mercyText: "Чигур не собирается договариваться.", intro: "* АНТОН ЧИГУР появился.\n* Он одним ударом устраняет SIXSEVEN.\n* Теперь он идет за тобой.", turnText: "* АНТОН ЧИГУР начинает безжалостный ход.", pattern: "hell", damageScale: 2.7, portraitScale: 1.02 };
const surfaceChigurBoss = { id: "chigur_surface", name: "ANTON CHIGUR", sprite: "chigur.jpg", hp: 460, maxHp: 460, mercyActs: 99, mercyText: "На поверхности он еще холоднее.", intro: "* На горизонте снова появился ANTON CHIGUR.\n* Сейчас он сильнее, чем в подземелье.", turnText: "* ANTON CHIGUR открывает охоту на поверхности.", pattern: "hell", damageScale: 3.15, portraitScale: 1.05, worldScale: 1.15 };
const surfaceEnemyDefs = {
  crow: { id: "crow", name: "CROW", sprite: "okak.jpg", hp: 20, maxHp: 20, mercyActs: 1, mercyText: "CROW пугается света.", intro: "* Черная CROW вылетела из кустов.", turnText: "* CROW делает быстрый пикирующий замах.", pattern: "bunnies", damageScale: 0.7, worldScale: 0.58, portraitScale: 0.72 },
  doggo: { id: "doggo", name: "DOGGO", sprite: "zaichik.jpg", hp: 26, maxHp: 26, mercyActs: 2, mercyText: "DOGGO отступает к обочине.", intro: "* DOGGO выбежал из травы.", turnText: "* DOGGO рывками наседает на арену.", pattern: "burst", damageScale: 0.9, worldScale: 0.76, portraitScale: 0.82 },
  grunt: { id: "grunt", name: "GRUNT", sprite: "mellstroy.jpg", hp: 32, maxHp: 32, mercyActs: 2, mercyText: "GRUNT осекся и сдает назад.", intro: "* Один из мемных GRUNT побежал.", turnText: "* GRUNT кидает неровный залп.", pattern: "burst", damageScale: 1.1, worldScale: 0.8, portraitScale: 0.84 },
};
const surfaceEncounters = [
  { id: "surface_pack_1", worldSprite: "okak.jpg", worldScale: 0.72, enemies: ["crow"] },
  { id: "surface_pack_2", worldSprite: "zaichik.jpg", worldScale: 0.84, enemies: ["doggo", "crow"] },
  { id: "surface_pack_3", worldSprite: "mellstroy.jpg", worldScale: 0.92, enemies: ["grunt"] },
  { id: "surface_pack_4", worldSprite: "okak.jpg", worldScale: 0.82, enemies: ["crow", "crow", "doggo"] },
  { id: "surface_pack_5", worldSprite: "mellstroy.jpg", worldScale: 0.96, enemies: ["grunt", "doggo"] },
  { id: "surface_pack_6", worldSprite: "chigur.jpg", worldScale: 1.1, boss: true, enemy: "chigur_surface" },
];
const undergroundCorridorLength = 20500;
const surfaceCorridorLength = 30200;
const encounterPoints = [1400, 2900, 4300, 6200, 8200, 9800, 11250, 13100, 14950, 17150, 19350];
const surfaceEncounterPoints = [3100, 7600, 11800, 16950, 22400, 28200];
const surfacePickups = [
  { id: "fruit_1", type: "fruit", x: 1800, y: 49 },
  { id: "meat_1", type: "meat", x: 5200, y: 50 },
  { id: "fruit_2", type: "fruit", x: 9100, y: 48 },
  { id: "fruit_3", type: "fruit", x: 13450, y: 52 },
  { id: "meat_2", type: "meat", x: 18400, y: 49 },
  { id: "fruit_4", type: "fruit", x: 24750, y: 51 },
];

const state = {
  scene: "menu",
  storyPhase: "underground",
  keys: new Set(),
  currentEncounter: 0,
  activeDemon: false,
  activeChigur: false,
  surfaceUnlocked: false,
  surfaceIntroSeen: false,
  cutsceneLines: [],
  cutsceneIndex: 0,
  activeGroup: null,
  collectedPickups: [],
  difficulty: "normal",
  unlockedPets: [],
  activePet: null,
  showPetMenu: false,
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
  lastAutosaveAt: 0,
};

const menuScene = document.getElementById("menuScene");
const worldScene = document.getElementById("worldScene");
const worldScreen = document.getElementById("worldScreen");
const cutsceneScene = document.getElementById("cutsceneScene");
const battleScene = document.getElementById("battleScene");
const corridorTrack = document.getElementById("corridorTrack");
const visionMask = document.getElementById("visionMask");
const pickupLayer = document.getElementById("pickupLayer");
const worldStatus = document.getElementById("worldStatus");
const cutsceneText = document.getElementById("cutsceneText");
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
const petMenu = document.getElementById("petMenu");
const activePetLabel = document.getElementById("activePetLabel");
const petPanel = document.getElementById("petPanel");
const canvas = document.getElementById("battleCanvas");
const ctx = canvas.getContext("2d");
const menuButtons = [...document.querySelectorAll(".menu-btn")];
const titleButtons = [...document.querySelectorAll(".title-option")];
const difficultyButtons = [...document.querySelectorAll(".difficulty-option")];
const attackMeterEl = document.getElementById("attackMeter");
const attackCursorEl = document.getElementById("attackCursor");
const audioMap = {
  zaichik: document.getElementById("zaichikSound"),
  okak_a: document.getElementById("okakSound"),
  okak_b: document.getElementById("okakSound"),
  okak_c: document.getElementById("okakSound"),
  okak_d: document.getElementById("okakSound"),
  okak_e: document.getElementById("okakSound"),
  okak_f: document.getElementById("okakSound"),
  mellstroy: document.getElementById("mellstroySound"),
  yaponec: document.getElementById("yaponecSound"),
  yaponecdemon: document.getElementById("yaponecDemonSound"),
  chigur: document.getElementById("chigurSound"),
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
  "Сначала длинное подземелье, потом поверхность с новыми боями и лутом.",
  "Открой питомцев и выбери одного активного помощника.",
  "Сбросить HP, предметы и путь к началу.",
];

let lastFrame = performance.now();

function currentEnemy() {
  if (state.activeChigur) return chigurBoss;
  if (state.activeDemon) return yaponecDemon;
  if (state.activeGroup?.length) return state.activeGroup[0];
  const descriptor = activeEncounterList()[state.currentEncounter];
  if (state.storyPhase === "surface" && descriptor?.boss) return surfaceChigurBoss;
  return descriptor;
}

function getPetKey(enemyId) {
  if (enemyId === "chigur_surface") return "chigur";
  return enemyId.startsWith("okak") ? "okak" : enemyId;
}

function currentPet() {
  return state.activePet ? PET_DEFS[state.activePet] : null;
}

function activeEncounterList() {
  return state.storyPhase === "surface" ? surfaceEncounters : encounters;
}

function activeEncounterPoints() {
  return state.storyPhase === "surface" ? surfaceEncounterPoints : encounterPoints;
}

function currentWorldLength() {
  return state.storyPhase === "surface" ? surfaceCorridorLength : undergroundCorridorLength;
}

function cloneEnemy(enemy) {
  return { ...enemy, hp: enemy.maxHp, spareable: false };
}

function resolveSurfaceEnemy(name) {
  if (name === "chigur_surface") return cloneEnemy(surfaceChigurBoss);
  return cloneEnemy(surfaceEnemyDefs[name]);
}

function currentEncounterDescriptor() {
  return activeEncounterList()[state.currentEncounter];
}

function isChigurFight(enemy) {
  return enemy && enemy.id.startsWith("chigur");
}

function saveGame() {
  try {
    const payload = {
      storyPhase: state.storyPhase,
      surfaceUnlocked: state.surfaceUnlocked,
      surfaceIntroSeen: state.surfaceIntroSeen,
      difficulty: state.difficulty,
      currentEncounter: state.currentEncounter,
      unlockedPets: state.unlockedPets,
      activePet: state.activePet,
      activeChigur: state.activeChigur,
      collectedPickups: state.collectedPickups,
      walkProgress: player.walk.progress,
      walkY: player.walk.y,
      hp: player.hp,
      maxHp: player.maxHp,
      items: player.items,
      fruit: player.fruit || 0,
      meat: player.meat || 0,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (_) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const payload = JSON.parse(raw);
    state.storyPhase = payload.storyPhase === "surface" ? "surface" : "underground";
    state.surfaceUnlocked = Boolean(payload.surfaceUnlocked);
    state.surfaceIntroSeen = Boolean(payload.surfaceIntroSeen);
    state.difficulty = difficultyConfig[payload.difficulty] ? payload.difficulty : "normal";
    state.unlockedPets = Array.isArray(payload.unlockedPets) ? payload.unlockedPets.filter((pet) => PET_DEFS[pet]) : [];
    state.activePet = state.unlockedPets.includes(payload.activePet) ? payload.activePet : null;
    state.activeChigur = Boolean(payload.activeChigur);
    state.collectedPickups = Array.isArray(payload.collectedPickups) ? payload.collectedPickups : [];
    state.currentEncounter = clamp(Number(payload.currentEncounter) || 0, 0, activeEncounterList().length);
    player.maxHp = difficultyConfig[state.difficulty].hp;
    player.hp = clamp(Number(payload.hp) || player.maxHp, 1, player.maxHp);
    player.items = clamp(Number(payload.items) || 3, 0, 99);
    player.fruit = clamp(Number(payload.fruit) || 0, 0, 99);
    player.meat = clamp(Number(payload.meat) || 0, 0, 99);
    player.walk.progress = clamp(Number(payload.walkProgress) || 240, 180, currentWorldLength() - 160);
    player.walk.y = clamp(Number(payload.walkY) || 50, 45, 55);
  } catch (_) {}
}

function renderPetMenu() {
  const activeLabel = currentPet() ? currentPet().label : "NONE";
  activePetLabel.textContent = `ACTIVE: ${activeLabel}`;
  const buttons = ['<button class="pet-option ' + (state.activePet === null ? 'active' : '') + '" data-pet="">NONE</button>'];
  Object.entries(PET_DEFS).forEach(([key, pet]) => {
    const unlocked = state.unlockedPets.includes(key);
    buttons.push(
      `<button class="pet-option ${unlocked ? "" : "locked"} ${state.activePet === key ? "active" : ""}" data-pet="${key}" ${unlocked ? "" : "disabled"}>${pet.label}<br>SPD ${Math.round(pet.speed * 100)}% DMG ${Math.round(pet.damage * 100)}%</button>`
    );
  });
  petMenu.innerHTML = buttons.join("");
  [...petMenu.querySelectorAll(".pet-option")].forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      const pet = button.dataset.pet || null;
      state.activePet = pet;
      renderPetMenu();
      saveGame();
    });
  });
}

function unlockPet(enemy) {
  const petKey = getPetKey(enemy.id);
  if (!PET_DEFS[petKey]) return;
  if (!state.unlockedPets.includes(petKey)) {
    state.unlockedPets.push(petKey);
    renderPetMenu();
  }
}

function setScene(scene) {
  state.scene = scene;
  menuScene.classList.toggle("scene-active", scene === "menu");
  worldScene.classList.toggle("scene-active", scene === "world");
  cutsceneScene.classList.toggle("scene-active", scene === "cutscene");
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
  renderWorldStatus();
}

function renderWorldStatus() {
  const phaseLabel = state.storyPhase === "surface" ? "SURFACE" : "UNDERGROUND";
  worldStatus.textContent = `${phaseLabel} | PIE ${player.items} | FRUIT ${player.fruit} | MEAT ${player.meat}`;
}

function renderPickups() {
  if (state.storyPhase !== "surface") {
    pickupLayer.innerHTML = "";
    return;
  }
  pickupLayer.innerHTML = surfacePickups
    .filter((pickup) => !state.collectedPickups.includes(pickup.id))
    .map((pickup) => `<div class="pickup ${pickup.type}" data-pickup="${pickup.id}" style="left:${pickup.x}px;top:${pickup.y}%;"></div>`)
    .join("");
}

function applyWorldTheme() {
  const isSurface = state.storyPhase === "surface";
  worldScene.classList.toggle("surface-mode", isSurface);
  worldScreen.classList.toggle("surface-mode", isSurface);
  corridorTrack.style.width = `${currentWorldLength()}px`;
  renderWorldStatus();
  renderPickups();
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
  const cameraX = clamp(player.walk.progress - viewportWidth * 0.22, 0, currentWorldLength() - viewportWidth);
  corridorTrack.style.transform = `translateX(${-cameraX}px)`;
  const visionX = ((player.walk.progress - cameraX) / Math.max(viewportWidth, 1)) * 100;
  visionMask.style.setProperty("--vision-x", `${visionX}%`);
  visionMask.style.setProperty("--vision-y", `${player.walk.y}%`);
}

function renderTitleMenu() {
  titleButtons.forEach((button, index) => button.classList.toggle("active", index === state.selectedTitle));
  difficultyButtons.forEach((button) => button.classList.toggle("active", button.dataset.difficulty === state.difficulty));
  renderPetMenu();
  petPanel.classList.toggle("hidden", !state.showPetMenu);
  menuInfo.textContent = titleInfo[state.selectedTitle];
}

function resetGame() {
  player.maxHp = difficultyConfig[state.difficulty].hp;
  player.hp = player.maxHp;
  player.items = 3;
  player.fruit = 0;
  player.meat = 0;
  player.walk.progress = 240;
  player.walk.y = 50;
  state.storyPhase = "underground";
  state.currentEncounter = 0;
  state.activeDemon = false;
  state.activeChigur = false;
  state.surfaceUnlocked = false;
  state.surfaceIntroSeen = false;
  state.activeGroup = null;
  state.collectedPickups = [];
  state.showPetMenu = false;
  state.approachActive = false;
  state.encounterTriggered = false;
  encounters.forEach((enemy) => {
    enemy.hp = enemy.maxHp;
    enemy.spareable = false;
  });
  yaponecDemon.hp = yaponecDemon.maxHp;
  chigurBoss.hp = chigurBoss.maxHp;
  surfaceChigurBoss.hp = surfaceChigurBoss.maxHp;
  updateHud();
  applyWorldTheme();
  updatePlayerSprite();
  renderPetMenu();
  saveGame();
}

function activateMenuOption() {
  if (state.selectedTitle === 0) {
    state.showPetMenu = false;
    player.maxHp = difficultyConfig[state.difficulty].hp;
    player.hp = player.maxHp;
    updateHud();
    startAmbience();
    saveGame();
    setScene("world");
    return;
  }
  if (state.selectedTitle === 1) {
    state.showPetMenu = false;
    menuInfo.textContent = "Подземелье ведет на поверхность: там враги идут пачками, а в конце ждет усиленный Chigur.";
    return;
  }
  if (state.selectedTitle === 2) {
    state.showPetMenu = !state.showPetMenu;
    renderTitleMenu();
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
  const audio =
    audioMap[enemy.id] ||
    (enemy.id === "chigur_surface" ? audioMap.chigur : null) ||
    (enemy.id === "doggo" ? audioMap.zaichik : null) ||
    (enemy.id === "grunt" ? audioMap.mellstroy : null) ||
    (enemy.id === "crow" ? audioMap.okak_a : null);
  if (!audio) return;
  audio.playbackRate = enemy.id === "sixseven" ? 0.88 : enemy.id.startsWith("chigur") ? 0.94 : enemy.id === "yaponec" ? 1.08 : 1;
  audio.play().catch(() => {});
}

function renderEnemyStage() {
  const enemy = currentEnemy();
  const isBoss = enemy.id === "sixseven" || isChigurFight(enemy);
  const groupText = state.activeGroup?.length > 1 ? `<br>LEFT ${state.activeGroup.length}` : "";
  enemyStage.innerHTML = `<div class="enemy-title ${isBoss ? "boss" : ""}">${enemy.name}<br>HP ${enemy.hp} / ${enemy.maxHp}${groupText}</div>`;
  enemyPortrait.innerHTML = `<img src="${enemy.sprite}" alt="${enemy.name}" style="transform: scale(${enemy.portraitScale || 1});">`;
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
  state.activeGroup = null;
  state.attackMeter = false;
  player.soul.x = canvas.width / 2;
  player.soul.y = canvas.height / 2;
  const descriptor = currentEncounterDescriptor();
  if (state.storyPhase === "surface" && descriptor?.enemies) {
    state.activeGroup = descriptor.enemies.map(resolveSurfaceEnemy);
  } else if (state.storyPhase === "surface" && descriptor?.boss) {
    surfaceChigurBoss.hp = surfaceChigurBoss.maxHp;
  }
  if (state.storyPhase === "underground" && !state.activeChigur && !state.activeDemon && currentEnemy().id === "sixseven" && Math.random() < 0.1) {
    state.activeChigur = true;
    chigurBoss.hp = chigurBoss.maxHp;
  }
  renderEnemyStage();
  renderMenu();
  playEncounterSound();
  worldEnemy.classList.add("hidden");
  typeText(currentEnemy().intro);
}

function beginCutscene(lines) {
  state.cutsceneLines = lines;
  state.cutsceneIndex = 0;
  cutsceneText.textContent = lines[0] || "";
  setScene("cutscene");
}

function startSurfaceAct() {
  state.storyPhase = "surface";
  state.surfaceUnlocked = true;
  state.surfaceIntroSeen = true;
  state.currentEncounter = 0;
  state.activeDemon = false;
  state.activeChigur = false;
  state.activeGroup = null;
  state.encounterTriggered = false;
  state.approachActive = false;
  player.walk.progress = 260;
  player.walk.y = 50;
  applyWorldTheme();
  updatePlayerSprite();
  saveGame();
  setScene("world");
}

function advanceCutscene() {
  if (state.scene !== "cutscene") return;
  if (state.cutsceneIndex < state.cutsceneLines.length - 1) {
    state.cutsceneIndex += 1;
    cutsceneText.textContent = state.cutsceneLines[state.cutsceneIndex];
    return;
  }
  startSurfaceAct();
}

function backToWorld(afterWin = true, rewardPet = false) {
  setScene("world");
  state.battlePhase = "menu";
  state.bullets = [];
  state.attackMeter = false;
  attackMeterEl.classList.add("hidden");
  if (afterWin) {
    const defeatedEnemy = currentEnemy();
    if (rewardPet) unlockPet(defeatedEnemy);
    if (state.storyPhase === "underground" && (defeatedEnemy.id === "sixseven" || state.activeChigur)) {
      state.activeChigur = false;
      state.activeDemon = false;
      beginCutscene([
        "Свет режет глаза.\nТы оставляешь мемное подземелье позади.",
        "Холодный коридор заканчивается.\nПеред тобой поверхность и долгий путь дальше.",
        "Теперь враги слабее, но часто нападают сразу группами.\nПо дороге можно собирать FRUIT и MEAT для лечения.",
      ]);
      return;
    }
    state.activeChigur = false;
    state.activeDemon = false;
    state.activeGroup = null;
    state.currentEncounter += 1;
    state.encounterTriggered = false;
    state.approachActive = false;
    const points = activeEncounterPoints();
    if (state.currentEncounter < points.length) {
      player.walk.progress = points[state.currentEncounter - 1] + 220;
    } else if (state.storyPhase === "surface") {
      player.walk.progress = currentWorldLength() - 260;
      menuInfo.textContent = "Поверхность зачищена. Антон Чигур пал.";
    }
  }
  applyWorldTheme();
  updateWorldEnemy();
  updatePlayerSprite();
  renderWorldStatus();
  saveGame();
}

function damageFromCursor(enemy) {
  const centerDistance = Math.abs(state.attackCursor - 50);
  let baseDamage = Math.max(5, Math.round(16 - centerDistance / 4.8));
  if (enemy.id.startsWith("chigur")) baseDamage = Math.max(1, Math.round(3 - centerDistance / 22));
  else if (enemy.id === "sixseven") baseDamage = Math.max(1, Math.round(4 - centerDistance / 18));
  else if (enemy.id.startsWith("okak")) baseDamage = Math.max(9, Math.round(22 - centerDistance / 3.8));
  else if (enemy.id === "yaponec") baseDamage = Math.max(3, Math.round(11 - centerDistance / 6));
  else if (enemy.id === "mellstroy") baseDamage = Math.max(4, Math.round(14 - centerDistance / 5));
  else if (enemy.id === "crow") baseDamage = Math.max(10, Math.round(20 - centerDistance / 4));
  else if (enemy.id === "doggo") baseDamage = Math.max(7, Math.round(16 - centerDistance / 5));
  else if (enemy.id === "grunt") baseDamage = Math.max(6, Math.round(14 - centerDistance / 5.5));
  return Math.max(1, Math.round(baseDamage * (1 + (currentPet()?.damage || 0))));
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
  renderEnemyStage();
  state.attackMeter = false;
  attackMeterEl.classList.add("hidden");
  if (enemy.hp <= 0) {
    if (enemy.id === "yaponec" && !state.activeDemon && Math.random() < 0.5) {
      state.activeDemon = true;
      yaponecDemon.hp = yaponecDemon.maxHp;
      renderEnemyStage();
      playEncounterSound();
      typeText("* YAPONEC распадается...\n* ...и возвращается как YAPONEC DEMON!");
      return;
    }
    if (state.activeGroup?.length > 1) {
      const defeatedName = enemy.name;
      state.activeGroup.shift();
      state.actCount = 0;
      renderEnemyStage();
      playEncounterSound();
      typeText(`* ${defeatedName} повержен.\n* Следующий враг выходит вперед.`);
      state.battlePhase = "menu";
      renderMenu();
      return;
    }
    typeText(enemy.id === "sixseven" ? "* SIXSEVEN дрогнул." : `* ${enemy.name} повержен.`);
    setTimeout(() => backToWorld(true, true), 1000);
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
  if (player.hp < player.maxHp) {
    if (player.meat > 0) {
      player.meat -= 1;
      player.hp = clamp(player.hp + 15, 0, player.maxHp);
      updateHud();
      renderWorldStatus();
      typeText(`* Ты съел MEAT. Осталось: ${player.meat}.`);
      beginDefense();
      return;
    }
    if (player.fruit > 0) {
      player.fruit -= 1;
      player.hp = clamp(player.hp + 8, 0, player.maxHp);
      updateHud();
      renderWorldStatus();
      typeText(`* Ты съел FRUIT. Осталось: ${player.fruit}.`);
      beginDefense();
      return;
    }
    if (player.items > 0) {
      player.items -= 1;
      player.hp = clamp(player.hp + 9, 0, player.maxHp);
      updateHud();
      renderWorldStatus();
      typeText(`* Ты съел мемный пирог. Осталось: ${player.items}.`);
      beginDefense();
      return;
    }
  }
  typeText("* Нечего использовать.");
}

function useMercy() {
  const enemy = currentEnemy();
  if (enemy.spareable) {
    enemy.hp = 0;
    if (state.activeGroup?.length > 1) {
      const sparedName = enemy.name;
      state.activeGroup.shift();
      state.actCount = 0;
      renderEnemyStage();
      playEncounterSound();
      typeText(`* Ты пощадил ${sparedName}.\n* Но бой еще не окончен.`);
      state.battlePhase = "menu";
      renderMenu();
      return;
    }
    typeText(`* Ты пощадил ${enemy.name}.`);
    setTimeout(() => backToWorld(true, false), 900);
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
  const list = activeEncounterList();
  const points = activeEncounterPoints();
  if (state.currentEncounter >= list.length) {
    worldEnemy.classList.add("hidden");
    return;
  }
  const descriptor = currentEncounterDescriptor();
  const enemy = state.storyPhase === "surface"
    ? (descriptor.boss ? surfaceChigurBoss : { sprite: descriptor.worldSprite, name: descriptor.id, worldScale: descriptor.worldScale })
    : currentEnemy();
  worldEnemySprite.src = enemy.sprite;
  worldEnemySprite.alt = enemy.name || "Enemy";
  worldEnemy.style.width = `${Math.round(120 * (enemy.worldScale || 1))}px`;
  worldEnemy.style.height = `${Math.round(120 * (enemy.worldScale || 1))}px`;
  if (state.approachActive || player.walk.progress > points[state.currentEncounter] - 440) {
    worldEnemy.classList.remove("hidden");
    worldEnemy.style.left = `${state.approachActive ? state.approachTarget : points[state.currentEncounter]}px`;
  } else {
    worldEnemy.classList.add("hidden");
  }
}

function beginDefense() {
  state.battlePhase = "defense";
  const enemy = currentEnemy();
  const progressiveDefense = 4.2 + state.currentEncounter * 1.15 + ((enemy.id.startsWith("okak") || enemy.id === "crow") ? -1.8 : 0) + (state.activeDemon ? 0.9 : 0) + (state.activeGroup?.length ? Math.max(0, state.activeGroup.length - 1) * 0.9 : 0);
  const bossDefense = 12.5;
  const defenseBase = isChigurFight(enemy) ? 24 : enemy.id === "sixseven" ? bossDefense : progressiveDefense;
  const petSpeed = currentPet()?.speed || 0;
  const petSpeedFactor = isChigurFight(enemy)
    ? Math.max(0.72, 1 - petSpeed * 0.35)
    : Math.max(0.25, 1 - petSpeed);
  state.defenseTimer = defenseBase * difficultyConfig[state.difficulty].defenseMult * petSpeedFactor;
  state.bulletTimer = 0;
  state.bullets = [];
  playEncounterSound();
  setTimeout(() => {
    if (state.battlePhase === "defense") {
      typeText(isChigurFight(enemy) ? "* Единственный ход ANTON CHIGUR.\n* Он очень длинный. Просто выживи." : enemy.id === "sixseven" ? "* Финальный ход SIXSEVEN. Выживи любой ценой." : currentEnemy().turnText, true);
    }
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
    const now = performance.now();
    if (now - state.lastAutosaveAt > 1800) {
      state.lastAutosaveAt = now;
      saveGame();
    }
  }

  player.walk.progress = clamp(player.walk.progress, 180, currentWorldLength() - 160);
  player.walk.y = clamp(player.walk.y, 45, 55);

  if (state.storyPhase === "surface") {
    surfacePickups.forEach((pickup) => {
      if (state.collectedPickups.includes(pickup.id)) return;
      const closeX = Math.abs(player.walk.progress - pickup.x) < 46;
      const closeY = Math.abs(player.walk.y - pickup.y) < 2.8;
      if (!closeX || !closeY) return;
      state.collectedPickups.push(pickup.id);
      if (pickup.type === "fruit") player.fruit += 1;
      if (pickup.type === "meat") player.meat += 1;
      renderPickups();
      renderWorldStatus();
      saveGame();
    });
  }

  const points = activeEncounterPoints();
  if (state.currentEncounter < points.length && !state.encounterTriggered) {
    const point = points[state.currentEncounter];
    if (player.walk.progress >= point - 250) {
      state.encounterTriggered = true;
      state.approachActive = true;
      state.approachTarget = point;
      updateWorldEnemy();
      typeText(state.storyPhase === "surface" ? "* Впереди кто-то выбегает прямо на тебя..." : "* В темноте кто-то появился...", true);
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
    } else if (isChigurFight(enemy)) {
      if (Math.random() > 0.22) spawnBullet(enemy);
      if (Math.random() > 0.55) spawnBullet(enemy);
      if (Math.random() > 0.78) spawnBullet(enemy);
      state.bulletTimer = 0.075 / bulletRateMult;
    } else if (enemy.id === "mellstroy") {
      state.bulletTimer = 0.16 / bulletRateMult;
    } else if (enemy.id === "zaipalchik") {
      state.bulletTimer = 0.14 / bulletRateMult;
    } else if (enemy.id === "grunt") {
      state.bulletTimer = 0.17 / bulletRateMult;
    } else if (enemy.id === "doggo") {
      state.bulletTimer = 0.19 / bulletRateMult;
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
    if (isChigurFight(enemy)) {
      state.battlePhase = "ended";
      state.bullets = [];
      enemy.hp = 0;
      renderEnemyStage();
      typeText("* Ты пережил единственный ход ANTON CHIGUR.\n* Он наконец повержен.");
      setTimeout(() => backToWorld(true, true), 1200);
      return;
    }
    if (enemy.id === "sixseven") {
      state.battlePhase = "ended";
      state.bullets = [];
      typeText("* Ты пережил финальный ход.\n* SIXSEVEN побежден.");
      setTimeout(() => backToWorld(true, true), 1200);
      return;
    }
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

  if (state.scene === "cutscene") {
    if (key === "z" || key === "Enter") advanceCutscene();
    return;
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
      saveGame();
    }
    if (key === "ArrowDown") {
      const order = ["super_easy", "easy", "normal", "hard"];
      const currentIndex = order.indexOf(state.difficulty);
      state.difficulty = order[(currentIndex + 1) % order.length];
      player.maxHp = difficultyConfig[state.difficulty].hp;
      player.hp = player.maxHp;
      renderTitleMenu();
      updateHud();
      saveGame();
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
    saveGame();
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
window.addEventListener("beforeunload", saveGame);

loadGame();
updateHud();
applyWorldTheme();
updatePlayerSprite();
renderTitleMenu();
requestAnimationFrame(loop);
