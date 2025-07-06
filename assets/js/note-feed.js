document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('note-feed');
  
  if (!feedContainer) return;
  
  fetch('https://note.com/yamiotoko/rss')
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("item");
      let html = '';
      
      items.forEach(el => {
        const title = el.querySelector("title").textContent;
        const link = el.querySelector("link").textContent;
        const pubDate = new Date(el.querySelector("pubDate").textContent).toLocaleDateString();
        const description = el.querySelector("description").textContent.substring(0, 100) + '...';
        
        html += `
          <div class="note-item">
            <h3><a href="${link}" target="_blank">${title}</a></h3>
            <time>${pubDate}</time>
            <p>${description}</p>
          </div>
        `;
      });
      
      feedContainer.innerHTML = html;
    })
    .catch(error => {
      feedContainer.innerHTML = `<p>記事の読み込みに失敗しました。直接<a href="https://note.com/yamiotoko" target="_blank">noteのページ</a>をご覧ください。</p>`;
    });
});