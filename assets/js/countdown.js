document.addEventListener('DOMContentLoaded', () => {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  
  if (!daysEl || !hoursEl) return;
  
  const launchDate = new Date('2025-10-31T00:00:00');
  
  function updateCountdown() {
    const now = new Date();
    const diff = launchDate - now;
    
    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
  }
  
  updateCountdown();
  setInterval(updateCountdown, 3600000); // 1時間ごとに更新
});