document.addEventListener('DOMContentLoaded', () => {
  // ハンバーガーメニュー機能
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('main-nav');
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);
  
  // 要素が正しく取得できているか確認
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      navOverlay.classList.toggle('active');
      
      // スクロールロックと位置リセット
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'メニューを閉じる');
        
        // スクロール位置をトップにリセット
        const container = document.querySelector('.nav-links-container');
        if (container) container.scrollTop = 0;
      } else {
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'メニューを開く');
      }
    });
  } else {
    console.error('ハンバーガーメニュー要素が見つかりません');
  }
});