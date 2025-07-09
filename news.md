---
layout: default
title: お知らせ
---

<section class="news-container">
  <div class="container">
    <h2>お知らせ</h2>
    <div class="news-list">
      {% for post in site.posts %}
        <a href="{{ post.url }}" class="news-item-link">
          <article class="news-item">
            <h3>{{ post.title }}</h3>
            <time datetime="{{ post.date | date_to_xmlschema }}">
              {{ post.date | date: "%Y年%m月%d日" }}
            </time>
            <div>{{ post.excerpt }}</div>
          </article>
        </a>
      {% endfor %}
    </div>
  </div>
</section>