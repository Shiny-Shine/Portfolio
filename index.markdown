---
layout: default
title: Home
body_class: home-page
---

{% assign portfolio_entries = site.posts | where_exp: "post", "post.categories contains 'portfolio'" | sort: "order" %}
{% assign signature_entries = portfolio_entries | where: "featured", true %}
{% assign stelog_entries = site.posts | where_exp: "post", "post.categories contains 'stelog'" %}
{% assign portfolio_filters = site.portfolio_filters %}
{% assign stelog_filters = site.stelog_filters %}

<header>
  <div class="hero">
    <a class="hero-logo" href="{{ '/' | relative_url }}">
      <img src="{{ '/assets/images/portfolio/logoW.png' | relative_url }}" alt="{{ site.title }}">
    </a>
  </div>
</header>

<main>
  <section class="Portfolio">
    <aside class="side">
      <div class="profile">
        <img src="{{ '/assets/images/portfolio/profile.jpg' | relative_url }}" alt="Profile Image">
        <h1>Shine</h1>
        <p>Portfolio</p>
      </div>

      <div class="menu">
        <span class="line"></span>
        <ul>
          <li>E-mail<p>{{ site.email }}</p></li>
          <li>Skills<p>HTML, CSS, JavaScript, Python, C++, Java</p></li>
          <li>Interests<p>Web Development, Game Development, AI, Machine Learning</p></li>
          <li>Education<p>Computer Science, Kyonggi University</p></li>
        </ul>
        <span class="line"></span>
      </div>

      <div class="social">
        <ul>
          <li><a href="{{ '/' | relative_url }}"><img src="{{ '/assets/images/portfolio/cover.png' | relative_url }}" alt="Home"></a></li>
          <li><a href="#"><img src="{{ '/assets/images/portfolio/icon2.png' | relative_url }}" alt="LinkedIn"></a></li>
          <li><a href="#"><img src="{{ '/assets/images/portfolio/icon3.png' | relative_url }}" alt="GitHub"></a></li>
          <li><a href="#"><img src="{{ '/assets/images/portfolio/icon4.png' | relative_url }}" alt="Instagram"></a></li>
          <li><a href="#"><img src="{{ '/assets/images/portfolio/icon5.png' | relative_url }}" alt="Contact"></a></li>
        </ul>
      </div>
    </aside>

    <div class="containerP">
      <div class="subtitle">
        <p>Signature Works</p>
        <span class="line"></span>
      </div>

      <div class="boxP boxP--signature">
        {% for post in signature_entries %}
          <article class="itemP work-card" data-tags="{{ post.tags | join: ',' | downcase }}">
            <a href="{{ post.url | relative_url }}">
              <img src="{{ post.cover | relative_url }}" alt="{{ post.title }}">
              <div class="work-card__overlay">
                <span class="work-card__badge">Signature</span>
                <h3>{{ post.title }}</h3>
                <p>{{ post.summary }}</p>
              </div>
            </a>
          </article>
        {% else %}
          <p class="empty-state">Signature Works에 표시할 포트폴리오가 아직 없습니다.</p>
        {% endfor %}
      </div>

      <div class="textbox">
        <div class="subtitle">
          <p>Portfolio</p>
          <span class="line"></span>
        </div>
        <ul class="filter-list" data-filter-target="portfolio-grid">
          <li><button type="button" class="is-active" data-filter="all">All</button></li>
          {% for filter_tag in portfolio_filters %}
            <li><button type="button" data-filter="{{ filter_tag | downcase }}">{{ filter_tag }}</button></li>
          {% endfor %}
        </ul>
      </div>

      <div class="boxP" id="portfolio-grid">
        {% for post in portfolio_entries %}
          <article class="itemP work-card" data-tags="{{ post.tags | join: ',' | downcase }}">
            <a href="{{ post.url | relative_url }}">
              <img src="{{ post.cover | relative_url }}" alt="{{ post.title }}">
              <div class="work-card__overlay">
                <span class="work-card__badge">{{ post.tags | first | default: 'Portfolio' }}</span>
                <h3>{{ post.title }}</h3>
                <p>{{ post.summary }}</p>
              </div>
            </a>
          </article>
        {% else %}
          <p class="empty-state">Portfolio 항목이 아직 없습니다.</p>
        {% endfor %}
      </div>

      <nav class="section-pagination" data-pagination-target="portfolio-grid" aria-label="Portfolio pagination"></nav>

      <div class="textbox">
        <div class="subtitle">
          <p>Stelog</p>
          <span class="line"></span>
        </div>
        <ul class="filter-list" data-filter-target="stelog-grid">
          <li><button type="button" class="is-active" data-filter="all">All</button></li>
          {% for filter_tag in stelog_filters %}
            <li><button type="button" data-filter="{{ filter_tag | downcase }}">{{ filter_tag }}</button></li>
          {% endfor %}
        </ul>
      </div>

      <div class="boxP" id="stelog-grid">
        {% for post in stelog_entries %}
          {% assign post_cover = post.cover | default: '/assets/images/portfolio/cover.png' %}
          <article class="itemS" data-tags="{{ post.tags | join: ',' | downcase }}">
            <a class="post-card__link" href="{{ post.url | relative_url }}">
              <div class="thumbnail">
                <img src="{{ post_cover | relative_url }}" alt="{{ post.title }}">
              </div>
              <div class="info">
                <div class="tag">
                  <p>{{ post.tags | first | default: 'Stelog' }}</p>
                  <span class="line tagLine"></span>
                </div>
                <h3 class="info__title">{{ post.title }}</h3>
                <p class="info__summary">{{ post.excerpt | strip_html | truncate: 120 }}</p>
                <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
              </div>
            </a>
          </article>
        {% else %}
          <p class="empty-state">Stelog 글이 아직 없습니다.</p>
        {% endfor %}
      </div>
    </div>
  </section>
</main>

<footer class="site-footer-custom">
  <p>TOP</p>
  <p>@Copyright 2026 MinCheol Shin. All rights reserved.</p>
</footer>
