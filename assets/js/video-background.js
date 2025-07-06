document.addEventListener('DOMContentLoaded', function() {
  const videoContainer = document.querySelector('.global-video-background');
  if (!videoContainer) return;
  
  const video = videoContainer.querySelector('video');
  
  // 動画が存在しない場合
  if (!video) {
    videoContainer.style.backgroundImage = 'url("{{ "/assets/images/video-poster.jpg" | relative_url }}")';
    return;
  }
  
  // デバイス性能チェック
  function checkDevicePerformance() {
    const isLowPerformance = (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) || 
      (navigator.deviceMemory && navigator.deviceMemory < 2) ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
    
    if (isLowPerformance) {
      document.body.classList.add('low-power-mode');
      return false;
    }
    return true;
  }
  
  // ネットワーク接続チェック
  function checkConnection() {
    const connection = navigator.connection;
    if (connection) {
      const isSlowConnection = (
        connection.saveData || 
        /2g|slow-2g/.test(connection.effectiveType)
      );
      
      if (isSlowConnection) {
        document.body.classList.add('low-power-mode');
        return false;
      }
    }
    return true;
  }
  
  // 動画再生処理
  function setupVideo() {
    if (!checkDevicePerformance() || !checkConnection()) {
      return;
    }
    
    // 動画メタデータが読み込まれたら再生
    if (video.readyState >= 3) {
      startVideoPlayback();
    } else {
      video.addEventListener('loadedmetadata', startVideoPlayback);
    }
    
    // エラーハンドリング
    video.addEventListener('error', fallbackToImage);
  }
  
  // 動画再生開始
  function startVideoPlayback() {
    try {
      video.playbackRate = 0.8;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error('動画の自動再生がブロックされました:', e);
          fallbackToImage();
        });
      }
    } catch (e) {
      console.error('動画再生エラー:', e);
      fallbackToImage();
    }
  }
  
  // フォールバック処理
  function fallbackToImage() {
    videoContainer.style.backgroundImage = 'url("' + (video.poster || '{{ "/assets/images/video-poster.jpg" | relative_url }}') + '")';
    if (video) video.remove();
  }
  
  // 動画設定を初期化
  setupVideo();
  
  // 画面リサイズ時に動画を中央に維持
  window.addEventListener('resize', function() {
    if (video) {
      video.style.transform = 'translate(-50%, -50%)';
    }
  });
});