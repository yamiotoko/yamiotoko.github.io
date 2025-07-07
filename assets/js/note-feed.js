document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('note-feed');
  
  if (!feedContainer) return;
  
  // ローディング表示を追加
  feedContainer.innerHTML = '<div class="loading">記事を読み込み中...</div>';
  
  const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const rssUrl = encodeURIComponent('https://note.com/yamiotoko/rss');
  
  fetch(`${proxyUrl}${rssUrl}`)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(str => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(str, "text/xml");
      
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) throw new Error('Error parsing XML');
      
      return xmlDoc;
    })
    .then(data => {
      const items = data.querySelectorAll("item");
      let html = '';
      
      items.forEach(el => {
        const title = el.querySelector("title").textContent;
        const link = el.querySelector("link").textContent;
        const pubDate = new Date(el.querySelector("pubDate").textContent).toLocaleDateString();
        const description = el.querySelector("description").textContent;
        
        // サムネイル画像のURLを抽出 - 修正箇所
        let thumbnailUrl = '';
        
        // 方法1: media:thumbnailタグから直接取得
        const mediaThumbnail = el.getElementsByTagName('media:thumbnail')[0];
        if (mediaThumbnail) {
          thumbnailUrl = mediaThumbnail.getAttribute('url');
        }
        
        // 方法2: 代替方法としてcontent:encodedから画像を抽出
        if (!thumbnailUrl) {
          const contentEncoded = el.getElementsByTagNameNS('*', 'content:encoded')[0];
          if (contentEncoded) {
            const contentHtml = contentEncoded.textContent;
            const imgMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/i);
            if (imgMatch && imgMatch[1]) {
              thumbnailUrl = imgMatch[1];
            }
          }
        }
        
        // 方法3: さらに代替方法としてdescriptionから画像を抽出
        if (!thumbnailUrl) {
          const descImgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
          if (descImgMatch && descImgMatch[1]) {
            thumbnailUrl = descImgMatch[1];
          }
        }
        
        // 説明文からHTMLタグを除去してテキストのみを取得
        const textDescription = description
          .replace(/<[^>]*>/g, '')
          .substring(0, 100) + '...';
        
        html += `
          <div class="note-item">
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="note-item-link">
              ${thumbnailUrl ? `<div class="note-thumbnail"><img src="${thumbnailUrl}" alt="${title}" loading="lazy"></div>` : ''}
              <div class="note-content">
                <h3 class="note-title">${title}</h3>
                <time datetime="${el.querySelector("pubDate").textContent}">${pubDate}</time>
                <p class="note-description">${textDescription}</p>
              </div>
            </a>
          </div>
        `;
      });
      
      feedContainer.innerHTML = html;
    })
    .catch(error => {
      console.error('RSS取得エラー:', error);
      feedContainer.innerHTML = `<p>記事の読み込みに失敗しました。直接<a href="https://note.com/yamiotoko" target="_blank" rel="noopener noreferrer">noteのページ</a>をご覧ください。</p>`;
    });
});