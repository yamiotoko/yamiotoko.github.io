document.addEventListener('DOMContentLoaded', () => {
  // ハンバーガーメニュー機能
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('main-nav'); // IDを修正
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);
  
  // 要素が正しく取得できているか確認
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation(); // イベントの伝播を防止
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      navOverlay.classList.toggle('active');
      
      // スクロールロック
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'メニューを閉じる');
      } else {
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      }
    });
    
    // オーバーレイクリックでメニュー閉じる
    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'メニューを開く');
    });
    
    // メニュー項目クリックでメニュー閉じる
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // 外部リンクでない場合のみメニューを閉じる
        if (!link.getAttribute('target') || link.getAttribute('target') !== '_blank') {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          navOverlay.classList.remove('active');
          document.body.style.overflow = '';
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.setAttribute('aria-label', 'メニューを開く');
        }
      });
    });
    
    // 画面リサイズ時にメニューを閉じる
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      }
    });
  } else {
    console.error('ハンバーガーメニュー要素が見つかりません');
  }
});