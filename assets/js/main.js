document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu(); // ハンバーガーメニュー機能
  initVideoPlayer(); // 動画プレイヤー初期化
});

/**
 * ハンバーガーメニュー初期化
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('main-nav');
  const navOverlay = document.createElement('div');
  const body = document.body;
  
  navOverlay.className = 'nav-overlay';
  body.appendChild(navOverlay);

  if (!hamburger || !navMenu) {
    console.error('ハンバーガーメニュー要素が見つかりません');
    return;
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(hamburger, navMenu, navOverlay, body);
  });

  navOverlay.addEventListener('click', () => {
    closeMenu(hamburger, navMenu, navOverlay, body);
  });
}

/**
 * メニュー開閉処理
 */
function toggleMenu(hamburger, navMenu, navOverlay, body) {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  navOverlay.classList.toggle('active');

  if (navMenu.classList.contains('active')) {
    body.classList.add('nav-active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'メニューを閉じる');
    document.querySelector('.nav-links-container')?.scrollTo(0, 0);
  } else {
    closeMenu(hamburger, navMenu, navOverlay, body);
  }
}

/**
 * メニュー閉じる処理
 */
function closeMenu(hamburger, navMenu, navOverlay, body) {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  navOverlay.classList.remove('active');
  body.classList.remove('nav-active');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'メニューを開く');
}


/**
 * 動画プレイヤー初期化
 */
function initVideoPlayer() {
  const video = document.querySelector('.bg-video');
  const playButton = document.querySelector('.video-play-button');
  const videoContainer = document.querySelector('.video-background');
  
  if (!video || !playButton) return;

  // 低電力モード検出
  const isLowPowerMode = matchMedia('(prefers-reduced-data: reduce)').matches || 
                        navigator.connection?.saveData;
  
  if (isLowPowerMode) {
    document.body.classList.add('low-power-mode');
    video.autoplay = false; // 自動再生を無効化
    playButton.style.display = 'block'; // ボタンを表示
  }

  // 再生ボタンのクリックイベント
  playButton.addEventListener('click', () => {
    video.play()
      .then(() => {
        videoContainer.classList.add('playing');
      })
      .catch(e => {
        console.error('動画再生に失敗しました:', e);
        // エラー時のフォールバック処理（例: 静止画像表示）
      });
  });

  // 自動再生がブロックされた場合のフォールバック
  video.play().catch(e => {
    console.log('自動再生がブロックされました:', e);
    playButton.style.display = 'block';
  });

  // 動画再生状態の監視
  video.addEventListener('play', () => {
    videoContainer.classList.add('playing');
  });

  video.addEventListener('pause', () => {
    videoContainer.classList.remove('playing');
    if (isLowPowerMode) {
      playButton.style.display = 'block';
    }
  });
}