document.addEventListener('DOMContentLoaded', () => {
  // ハンバーガーメニュー機能
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('main-nav');
  const navOverlay = document.createElement('div');
  const body = document.body;
  navOverlay.className = 'nav-overlay';
  body.appendChild(navOverlay);
  
  // 要素が正しく取得できているか確認
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      navOverlay.classList.toggle('active');
      
      // スクロールロックと位置リセット
      if (navMenu.classList.contains('active')) {
        body.classList.add('nav-active'); // CSSクラスで制御
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'メニューを閉じる');
        
        // スクロール位置をトップにリセット
        const container = document.querySelector('.nav-links-container');
        if (container) container.scrollTop = 0;
      } else {
        body.classList.remove('nav-active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      }
    });

    // オーバーレイクリックでメニュー閉じる（追加推奨）
    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      body.classList.remove('nav-active');
    });
  } else {
    console.error('ハンバーガーメニュー要素が見つかりません');
  }
});