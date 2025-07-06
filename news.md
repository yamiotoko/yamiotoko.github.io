---
layout: default
title: お知らせ
---

<div class="container">
  <h2>お知らせ</h2>
  
  <div class="news-list">
    {% for post in site.posts %}
      <article class="news-item">
        <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
        <time datetime="{{ post.date | date_to_xmlschema }}">
          {{ post.date | date: "%Y年%m月%d日" }}
        </time>
        <div>{{ post.excerpt }}</div>
      </article>
    {% endfor %}
  </div>
</div>