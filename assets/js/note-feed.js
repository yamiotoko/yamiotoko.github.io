document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('note-feed');
  
  if (!feedContainer) return;
  
  // CORSプロキシを追加
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
      
      // パースエラーチェック
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
        
        // サムネイル画像のURLを抽出
        let thumbnailUrl = '';
        const contentEncoded = el.getElementsByTagNameNS('*', 'content:encoded')[0];
        if (contentEncoded) {
          const contentHtml = contentEncoded.textContent;
          const imgMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch && imgMatch[1]) {
            thumbnailUrl = imgMatch[1];
          }
        }
        
        // 代替方法: descriptionから画像を抽出
        if (!thumbnailUrl) {
          const descImgMatch = description.match(/<img[^>]+src="([^">]+)"/i);
          if (descImgMatch && descImgMatch[1]) {
            thumbnailUrl = descImgMatch[1];
          }
        }
        
        // 説明文からHTMLタグを除去してテキストのみを取得
        const textDescription = description
          .replace(/<[^>]*>/g, '') // HTMLタグを除去
          .substring(0, 100) + '...';
        
          html += `
            <div class="note-item">
              <a href="${link}" target="_blank" rel="noopener noreferrer" class="note-item-link">
                ${thumbnailUrl ? `<div class="note-thumbnail"><img src="${thumbnailUrl}" alt="${title}"></div>` : ''}
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