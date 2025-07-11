document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('note-feed');
  
  if (!feedContainer) return;
  
  // ローディング表示を追加
  feedContainer.innerHTML = '<div class="loading">記事を読み込み中...</div>';
  
  // CORS回避のためのプロキシURLを使用
  // const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const proxyUrl = 'https://corsproxy.io/?url=';
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
      const mediaNS = "http://search.yahoo.com/mrss/"; // 名前空間をループの外で定義
      
      items.forEach(el => {
        const title = el.querySelector("title").textContent;
        const link = el.querySelector("link").textContent;
        const pubDate = new Date(el.querySelector("pubDate").textContent).toLocaleDateString();
        const description = el.querySelector("description").textContent;
        
        // サムネイル画像のURLを抽出 - 修正箇所
        let thumbnailUrl = '';
        
       // 方法1: media:thumbnailタグから直接取得（名前空間対応）
        const mediaThumbnail = el.getElementsByTagNameNS(mediaNS, "thumbnail")[0];
        if (mediaThumbnail) {
          thumbnailUrl = mediaThumbnail.textContent; // textContentでURLを取得
        }
        
        // 方法2: descriptionから画像URLを抽出（CDATA内の最初のimgタグ）
        if (!thumbnailUrl) {
          const cdataContent = description.match(/<!\[CDATA\[(.*?)\]\]>/s);
          if (cdataContent && cdataContent[1]) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cdataContent[1];
            const img = tempDiv.querySelector('img');
            if (img) {
              thumbnailUrl = img.src;
            }
          }
        }

        // 説明文からHTMLタグを除去してテキストのみを取得
        const textDescription = description
          .replace(/<[^>]*>/g, '')
          .replace(/<!\[CDATA\[|\]\]>/g, '')
          .substring(0, 100) + '...';
          
        // 100文字を超える場合は省略して「...」を追加        
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