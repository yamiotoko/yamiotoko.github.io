document.addEventListener('DOMContentLoaded', () => {
  // ハンバーガーメニュー機能
  initHamburgerMenu();
  
  // 動画背景処理
  initVideoBackground();
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
 * 動画背景初期化
 */
function initVideoBackground() {
  const videoBg = document.querySelector('.video-background');
  if (!videoBg) return;

  const video = videoBg.querySelector('video');
  const fallbackImg = videoBg.querySelector('img');

  // iOSデバイス判定
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const handleVideoPlay = () => {
    video.play()
      .then(() => {
        videoBg.classList.remove('no-autoplay');
      })
      .catch(error => {
        console.log('動画自動再生失敗:', error);
        videoBg.classList.add('no-autoplay');
      });
  };

  // 初期再生試行
  if (!isIOS) {
    handleVideoPlay();
  }

  // iOS用: ユーザー操作後に動画ロード
  if (isIOS) {
    document.body.addEventListener('touchstart', function init() {
      video.load();
      handleVideoPlay();
      document.body.removeEventListener('touchstart', init);
    }, { once: true });
  }

  // 動画ロードチェック
  video.addEventListener('loadeddata', () => {
    if (video.readyState >= 3) {
      videoBg.classList.remove('no-autoplay');
    }
  });
}