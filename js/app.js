/* ===== MBG MiniApp - Main Application ===== */

// Configuration
const CONFIG = {
  MINING_DURATION: 2 * 60 * 60 * 1000, // 2 hours in ms
  MINING_REWARD: 0.5, // MBG per 2 hours
  ADS_REWARD: 0.1, // MBG per ad
  MAX_ADS_PER_DAY: 10,
  TOKEN_PRICE_USD: 0.01,
  BOOST_COSTS: [10, 15, 22.5, 33.75, 50.62, 75.94, 113.91, 170.86, 256.29, 384.43, 576.65, 864.98],
  ABOUT_US_URL: 'https://mbgdocs.vercel.app/',
  ADSGRAM_URL: 'https://adsgram.ai/' // Will be connected later
};

// Application State
let state = {
  balance: 0,
  totalEarned: 0,
  isMining: false,
  miningStartTime: null,
  miningEndTime: null,
  currentEarning: 0,
  boostLevel: 1,
  adsWatchedToday: 0,
  lastAdWatchDate: null,
  checkInStreak: 0,
  lastCheckInDate: null,
  checkedInDays: [],
  rank: 127,
  referrals: 0,
  joinedDate: new Date().toISOString()
};

// Leaderboard mock data
const leaderboard = [
  { name: 'CryptoKing', balance: 15420.50, avatar: 'CK' },
  { name: 'MBGWhale', balance: 12890.25, avatar: 'MW' },
  { name: 'DiamondHands', balance: 10250.75, avatar: 'DH' },
  { name: 'TokenMaster', balance: 8765.30, avatar: 'TM' },
  { name: 'MiningPro', balance: 7234.80, avatar: 'MP' },
  { name: 'BangCollector', balance: 6120.45, avatar: 'BC' },
  { name: 'GoldDigger', balance: 5432.10, avatar: 'GD' },
  { name: 'CoinHunter', balance: 4876.55, avatar: 'CH' },
  { name: 'MakanBang', balance: 0, avatar: 'MB', isMe: true }
];

// Initialize App
function init() {
  loadState();
  setupEventListeners();
  updateUI();
  startMiningTimer();
  hideLoading();
}

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem('mbg_state');
  if (saved) {
    try {
      state = { ...state, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
  // Check if it's a new day for ads counter
  const today = new Date().toDateString();
  if (state.lastAdWatchDate !== today) {
    state.adsWatchedToday = 0;
    state.lastAdWatchDate = today;
    saveState();
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem('mbg_state', JSON.stringify(state));
}

// Hide loading screen
function hideLoading() {
  setTimeout(() => {
    document.querySelector('.loading-screen').classList.add('hidden');
  }, 1500);
}

// Setup event listeners
function setupEventListeners() {
  // Mining button
  document.getElementById('miningBtn').addEventListener('click', toggleMining);
  
  // Boost upgrade
  document.getElementById('upgradeBoostBtn').addEventListener('click', upgradeBoost);
  
  // Bottom navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      switchTab(tab);
    });
  });
  
  // Watch ad buttons
  document.querySelectorAll('.watch-ad-btn').forEach(btn => {
    btn.addEventListener('click', () => watchAd(btn));
  });
  
  // Daily check-in
  document.getElementById('checkInBtn').addEventListener('click', dailyCheckIn);
  
  // Modal close
  document.querySelectorAll('.modal-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  // About us link
  const aboutUs = document.getElementById('aboutUsLink');
  if (aboutUs) {
    aboutUs.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(CONFIG.ABOUT_US_URL, '_blank');
    });
  }
}

// Switch tabs
function switchTab(tabName) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });
  
  // Update tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle mining
function toggleMining() {
  if (state.isMining) {
    // Claim mining rewards
    claimMining();
  } else {
    // Start mining
    startMining();
  }
}

// Start mining
function startMining() {
  state.isMining = true;
  state.miningStartTime = Date.now();
  state.miningEndTime = Date.now() + CONFIG.MINING_DURATION;
  state.currentEarning = 0;
  saveState();
  updateUI();
  showToast('⛏️ Mining dimulai! Selama 2 jam');
}

// Claim mining rewards
function claimMining() {
  const elapsed = Date.now() - state.miningStartTime;
  const progress = Math.min(elapsed / CONFIG.MINING_DURATION, 1);
  const boostMultiplier = 1 + (state.boostLevel - 1) * 0.5;
  const earned = CONFIG.MINING_REWARD * progress * boostMultiplier;
  
  state.balance += earned;
  state.totalEarned += earned;
  state.isMining = false;
  state.miningStartTime = null;
  state.miningEndTime = null;
  state.currentEarning = 0;
  
  saveState();
  updateUI();
  showToast(`✨ Berhasil klaim ${earned.toFixed(4)} MBG!`);
}

// Start mining timer for UI updates
function startMiningTimer() {
  setInterval(() => {
    if (state.isMining) {
      const now = Date.now();
      
      // Auto-claim if mining is complete
      if (now >= state.miningEndTime) {
        claimMining();
        return;
      }
      
      // Update current earning display
      const elapsed = now - state.miningStartTime;
      const progress = elapsed / CONFIG.MINING_DURATION;
      const boostMultiplier = 1 + (state.boostLevel - 1) * 0.5;
      state.currentEarning = CONFIG.MINING_REWARD * progress * boostMultiplier;
      
      updateMiningUI();
    }
  }, 1000);
}

// Update mining UI elements
function updateMiningUI() {
  const earnedEl = document.getElementById('currentEarning');
  const btnText = document.getElementById('miningBtnText');
  const btnSubtext = document.getElementById('miningBtnSubtext');
  const btn = document.getElementById('miningBtn');
  const progressCircle = document.querySelector('.progress-ring .progress');
  
  if (state.isMining) {
    earnedEl.textContent = state.currentEarning.toFixed(4);
    btn.classList.add('mining');
    btnText.textContent = '⛏️ Mining...';
    
    // Show countdown
    const remaining = state.miningEndTime - Date.now();
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    btnSubtext.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress ring
    const progress = (Date.now() - state.miningStartTime) / CONFIG.MINING_DURATION;
    const circumference = 2 * Math.PI * 105;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference * (1 - progress);
  } else {
    earnedEl.textContent = '0.0000';
    btn.classList.remove('mining');
    btnText.textContent = '🚀 Mulai Mining';
    btnSubtext.textContent = '2 Jam • 0.5 MBG';
    
    // Reset progress ring
    const circumference = 2 * Math.PI * 105;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
  }
}

// Upgrade boost
function upgradeBoost() {
  const nextLevel = state.boostLevel;
  if (nextLevel > CONFIG.BOOST_COSTS.length) {
    showToast('🚀 Boost sudah maksimal!');
    return;
  }
  
  const cost = CONFIG.BOOST_COSTS[nextLevel - 1];
  
  if (state.balance < cost) {
    showToast(`❌ Saldo tidak cukup! Butuh ${cost} MBG`);
    return;
  }
  
  state.balance -= cost;
  state.boostLevel++;
  saveState();
  updateUI();
  showToast(`⚡ Boost berhasil ditingkatkan ke Level ${state.boostLevel}!`);
}

// Watch ad
function watchAd(btn) {
  // Check if max ads reached
  if (state.adsWatchedToday >= CONFIG.MAX_ADS_PER_DAY) {
    showToast('🎯 Batas iklan harian tercapai! Coba lagi besok');
    return;
  }
  
  // Show ad simulation modal
  showModal('Menonton Iklan', 'Iklan akan segera dimulai... (Integrasi Adsgram akan menyusul)', () => {
    // Simulate ad watching
    setTimeout(() => {
      state.adsWatchedToday++;
      state.lastAdWatchDate = new Date().toDateString();
      state.balance += CONFIG.ADS_REWARD;
      state.totalEarned += CONFIG.ADS_REWARD;
      saveState();
      updateUI();
      showToast(`🎬 +${CONFIG.ADS_REWARD} MBG dari iklan!`);
    }, 1000);
  });
}

// Daily check-in
function dailyCheckIn() {
  const today = new Date().toDateString();
  
  if (state.lastCheckInDate === today) {
    showToast('✅ Kamu sudah check-in hari ini!');
    return;
  }
  
  // Calculate reward based on streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (state.lastCheckInDate === yesterday.toDateString()) {
    state.checkInStreak++;
  } else {
    state.checkInStreak = 1;
  }
  
  const reward = 0.1 * state.checkInStreak; // Increase with streak
  state.balance += reward;
  state.totalEarned += reward;
  state.lastCheckInDate = today;
  
  if (!state.checkedInDays) state.checkedInDays = [];
  state.checkedInDays.push(new Date().getDate());
  
  saveState();
  updateUI();
  showToast(`📅 Check-in berhasil! +${reward.toFixed(2)} MBG (Streak: ${state.checkInStreak} hari)`);
}

// Show modal
function showModal(title, message, onConfirm) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  
  overlay.classList.add('show');
  
  // Store confirm callback
  window._modalConfirm = onConfirm;
}

// Close modal
function closeModal(e) {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('show');
  
  if (e.target.classList.contains('primary') && window._modalConfirm) {
    window._modalConfirm();
  }
  window._modalConfirm = null;
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Update all UI elements
function updateUI() {
  // Balance
  document.querySelectorAll('.balance-display').forEach(el => {
    el.textContent = state.balance.toFixed(4);
  });
  
  // Wallet balance
  const walletBalance = document.getElementById('walletBalance');
  if (walletBalance) walletBalance.textContent = state.balance.toFixed(4);
  
  const walletUsd = document.getElementById('walletUsd');
  if (walletUsd) walletUsd.textContent = `≈ $${(state.balance * CONFIG.TOKEN_PRICE_USD).toFixed(4)}`;
  
  // Mining UI
  updateMiningUI();
  
  // Boost info
  const boostLevel = document.getElementById('boostLevel');
  if (boostLevel) boostLevel.textContent = `Level ${state.boostLevel}`;
  
  const boostMultiplier = document.getElementById('boostMultiplier');
  if (boostMultiplier) {
    const mult = 1 + (state.boostLevel - 1) * 0.5;
    boostMultiplier.textContent = `${mult.toFixed(1)}x Kecepatan Mining`;
  }
  
  const upgradeBtn = document.getElementById('upgradeBoostBtn');
  const boostCostEl = document.getElementById('boostCost');
  
  if (state.boostLevel <= CONFIG.BOOST_COSTS.length) {
    const nextCost = CONFIG.BOOST_COSTS[state.boostLevel - 1];
    if (upgradeBtn) {
      upgradeBtn.textContent = `⬆️ Upgrade`;
      upgradeBtn.disabled = state.balance < nextCost;
    }
    if (boostCostEl) boostCostEl.textContent = `Biaya: ${nextCost} MBG`;
  } else {
    if (upgradeBtn) {
      upgradeBtn.textContent = '✨ MAX';
      upgradeBtn.disabled = true;
    }
    if (boostCostEl) boostCostEl.textContent = 'Level maksimum tercapai';
  }
  
  // Ads counter
  const adsCounter = document.getElementById('adsCounter');
  if (adsCounter) {
    adsCounter.textContent = `${state.adsWatchedToday}/${CONFIG.MAX_ADS_PER_DAY} iklan ditonton hari ini`;
  }
  
  // Update ad buttons
  document.querySelectorAll('.watch-ad-btn').forEach(btn => {
    btn.disabled = state.adsWatchedToday >= CONFIG.MAX_ADS_PER_DAY;
    if (state.adsWatchedToday >= CONFIG.MAX_ADS_PER_DAY) {
      btn.textContent = 'Habis';
    }
  });
  
  // Check-in
  updateCheckInUI();
  
  // Rank
  document.getElementById('userRank').textContent = `#${state.rank}`;
  document.getElementById('userReferrals').textContent = state.referrals;
  
  // Update leaderboard with user's balance
  leaderboard[leaderboard.length - 1].balance = state.balance;
  renderLeaderboard();
}

// Update check-in UI
function updateCheckInUI() {
  const today = new Date();
  const todayDate = today.getDate();
  const checkInBtn = document.getElementById('checkInBtn');
  const streakEl = document.getElementById('checkInStreak');
  
  if (streakEl) streakEl.textContent = `${state.checkInStreak} hari`;
  
  // Check if already checked in today
  if (state.lastCheckInDate === today.toDateString()) {
    checkInBtn.textContent = '✅ Sudah Check-in';
    checkInBtn.disabled = true;
  } else {
    const reward = 0.1 * (state.checkInStreak + 1);
    checkInBtn.textContent = `🎁 Check-in Sekarang (+${reward.toFixed(2)} MBG)`;
    checkInBtn.disabled = false;
  }
  
  // Update calendar days
  const days = document.querySelectorAll('.checkin-day');
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDay = firstDay.getDay();
  
  days.forEach((dayEl, index) => {
    const dayNum = index - startDay + 1;
    if (dayNum > 0 && dayNum <= new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()) {
      dayEl.querySelector('.checkin-day-num').textContent = dayNum;
      dayEl.classList.remove('hidden');
      
      if (state.checkedInDays && state.checkedInDays.includes(dayNum)) {
        dayEl.classList.add('checked');
      }
      
      if (dayNum === todayDate) {
        dayEl.classList.add('today');
      }
    } else {
      dayEl.classList.add('hidden');
    }
  });
}

// Render leaderboard
function renderLeaderboard() {
  // Sort leaderboard by balance
  const sorted = [...leaderboard].sort((a, b) => b.balance - a.balance);
  
  // Update user's rank
  const userIndex = sorted.findIndex(u => u.isMe);
  state.rank = userIndex + 1;
  
  const rankList = document.getElementById('rankList');
  if (!rankList) return;
  
  rankList.innerHTML = sorted.map((user, index) => {
    const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
    const meClass = user.isMe ? 'me' : '';
    
    return `
      <div class="rank-item ${meClass}">
        <div class="rank-number ${rankClass}">${index + 1}</div>
        <div class="rank-avatar">${user.avatar}</div>
        <div class="rank-info">
          <div class="rank-name">${user.name}${user.isMe ? ' (Kamu)' : ''}</div>
          <div class="rank-balance">${user.balance.toFixed(2)} MBG</div>
        </div>
      </div>
    `;
  }).join('');
}

// Initialize Telegram WebApp if available
function initTelegram() {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Set header color
    tg.setHeaderColor('#1A1A2E');
    tg.setBackgroundColor('#0F0F1A');
    
    // Get user info if available
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const user = tg.initDataUnsafe.user;
      document.querySelector('.profile-name').textContent = `${user.first_name} ${user.last_name || ''}`.trim();
      document.querySelector('.profile-username').textContent = user.username ? `@${user.username}` : '';
      document.querySelector('.profile-avatar').textContent = user.first_name.charAt(0).toUpperCase();
      leaderboard[leaderboard.length - 1].name = user.first_name;
      leaderboard[leaderboard.length - 1].avatar = user.first_name.charAt(0).toUpperCase();
    }
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  init();
});
