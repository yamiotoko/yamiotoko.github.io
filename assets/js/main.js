document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  const body = document.body;
  
  // ローカルストレージから設定を読み込み
  if (localStorage.getItem('darkMode') === 'disabled') {
    body.classList.remove('dark-mode');
  }
  
  // トグルイベント
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // 設定を保存
    if (body.classList.contains('dark-mode')) {
      localStorage.removeItem('darkMode');
    } else {
      localStorage.setItem('darkMode', 'disabled');
    }
  });
});