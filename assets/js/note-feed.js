document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('note-feed');
  if (!feedContainer) return;

  feedContainer.innerHTML = '<div class="loading">記事を読み込み中...</div>';
  // RSSフィード取得用の既存プロキシURL。これは変更しません。
  const rssProxyUrl = 'https://note-rss-proxy.netlify.app/.netlify/functions/note';

  // CORSプロキシ関数 (画像用)
  // ここを Netlify Function の新しいエンドポイントに変更します。
  const corsProxy = (url) => {
    return `https://note-rss-proxy.netlify.app/api/image-proxy/${url}`;
  };

  fetch(rssProxyUrl) // RSSフィードの取得には rssProxyUrl を使用
    .then(response => {
      if (!response.ok) throw new Error(`Network error: ${response.status}`);
      return response.text();
    })
    .then(str => {
      console.log('Complete RSS Data:', str);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "text/xml");

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

        let thumbnailUrl = '';
        try {
          const mediaNS = "http://search.yahoo.com/mrss/";
          console.log(`Item ${index} - mediaNS:`, mediaNS);

          const thumbnails = el.getElementsByTagNameNS(mediaNS, "thumbnail");
          console.log(`Item ${index} - Found Thumbnails (NodeList):`, thumbnails);
          console.log(`Item ${index} - Number of Thumbnails:`, thumbnails.length);

          if (thumbnails.length > 0) {
            thumbnailUrl = thumbnails[0].textContent || '';
            console.log(`Item ${index} - Media Thumbnail URL (Before Proxy):`, thumbnailUrl);
          }

          if (!thumbnailUrl && description) {
            const imgRegex = /<img[^>]+src="([^">]+)"/i;
            const match = description.match(imgRegex);
            if (match?.[1]) {
              thumbnailUrl = match[1];
              console.log(`Item ${index} - Description Image (Before Proxy):`, thumbnailUrl);
            }
          }

          if (thumbnailUrl) {
            thumbnailUrl = thumbnailUrl
              .replace(/^http:/, 'https:')
              .split('?')[0];

            // ここで新しい画像プロキシ関数を使用
            thumbnailUrl = corsProxy(thumbnailUrl);
            console.log(`Item ${index} - Final Thumbnail URL (After Proxy):`, thumbnailUrl);
          }
        } catch (e) {
          console.error(`Item ${index} Thumbnail Error:`, e);
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
                      console.error('Image load failed (in HTML):', this.src);
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