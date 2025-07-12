document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('note-feed');
  if (!feedContainer) return;

  feedContainer.innerHTML = '<div class="loading">記事を読み込み中...</div>';
  const proxyUrl = 'https://note-rss-proxy.netlify.app/.netlify/functions/note';

  // CORSプロキシ関数 (必要に応じて使用) - サムネイルのCORS問題を解決するために有効化
  const corsProxy = (url) => {
    // 公開されているcors-anywhereは不安定な場合があるため、
    // 自身でプロキシをデプロイすることを推奨します。
    // 例: https://github.com/Rob--W/cors-anywhere/
    return `https://cors-anywhere.herokuapp.com/${url}`;
  };

  fetch(proxyUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Network error: ${response.status}`);
      return response.text();
    })
    .then(str => {
      // 生データを完全にログ出力
      console.log('Complete RSS Data:', str);
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "text/xml");
      
      // 詳細なパースエラーチェック
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        console.error('XML Parse Error Details:', parseError.innerHTML);
        throw new Error('Invalid XML format');
      }
      
      return xmlDoc;
    })
    .then(data => {
      const items = data.querySelectorAll("item");
      let html = '';

      items.forEach((el, index) => {
        const title = el.querySelector("title")?.textContent || '';
        const link = el.querySelector("link")?.textContent || '#';
        const pubDate = new Date(el.querySelector("pubDate")?.textContent || '').toLocaleDateString();
        const description = el.querySelector("description")?.textContent || '';
        
        // サムネイルURL取得 (Netlify対応版)
        let thumbnailUrl = '';
        try {
          // media:thumbnailを直接取得
          const mediaNS = "http://search.yahoo.com/mrss/";
          const thumbnails = el.getElementsByTagNameNS(mediaNS, "thumbnail");
          if (thumbnails.length > 0) {
            thumbnailUrl = thumbnails[0].getAttribute('url') || '';
            console.log(`Item ${index} - Media Thumbnail:`, thumbnailUrl);
          }

          // 見つからない場合はdescriptionから抽出
          if (!thumbnailUrl && description) {
            const imgRegex = /<img[^>]+src="([^">]+)"/i;
            const match = description.match(imgRegex);
            if (match?.[1]) {
              thumbnailUrl = match[1];
              console.log(`Item ${index} - Description Image:`, thumbnailUrl);
            }
          }

          // URLを正規化
          if (thumbnailUrl) {
            thumbnailUrl = thumbnailUrl
              .replace(/^http:/, 'https:')
              .split('?')[0];
            
            // CORS問題が疑われる場合はプロキシ経由に
            thumbnailUrl = corsProxy(thumbnailUrl); // <--- ここをコメント解除しました
          }
        } catch (e) {
          console.error(`Item ${index} Thumbnail Error:`, e);
        }

        // 画像の存在確認 (詳細版) - この部分はクライアント側での確認であり、CORSプロキシの使用後は不要な場合も
        // ただし、画像が完全に存在しない場合のフォールバックとしては残しておく
        if (thumbnailUrl) {
          const imgTest = new Image();
          imgTest.src = thumbnailUrl;
          imgTest.onload = () => console.log(`Item ${index} Image Load Success:`, thumbnailUrl);
          imgTest.onerror = () => {
            console.warn(`Item ${index} Image Load Failed:`, thumbnailUrl);
            thumbnailUrl = ''; // 読み込み失敗時はURLを空に
          };
        }

        const textDescription = description
          .replace(/<[^>]*>/g, '')
          .replace(/<!\[CDATA\[|\]\]>/g, '')
          .substring(0, 100) + (description.length > 100 ? '...' : '');

        html += `
          <div class="note-item">
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="note-item-link">
              ${thumbnailUrl ? `
                <div class="note-thumbnail">
                  <img src="${thumbnailUrl}"
                    alt="${title}"
                    loading="lazy"
                    crossorigin="anonymous"
                    onerror="
                      console.error('Image load failed:', this.src);
                      this.onerror = null;
                      this.src = 'https://placehold.co/400x225?text=No+Image';
                      this.style.opacity = '0.7';
                    ">
                </div>` : ''}
              <div class="note-content">
                <h3 class="note-title">${title}</h3>
                <time datetime="${el.querySelector("pubDate")?.textContent || ''}">${pubDate}</time>
                <p class="note-description">${textDescription}</p>
              </div>
            </a>
          </div>
        `;
      });

      feedContainer.innerHTML = html;
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      feedContainer.innerHTML = `
        <div class="error-message">
          <p>コンテンツの読み込みに問題が発生しました</p>
          <p><a href="https://note.com/yamiotoko" target="_blank">公式サイトをご確認ください</a></p>
          <details>
            <summary>エラー詳細</summary>
            <pre>${error.message}</pre>
          </details>
        </div>
      `;
    });
});