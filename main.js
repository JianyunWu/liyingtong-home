/* 利盈通官网交互脚本：中英双语切换 / 移动端导航 / 滚动高亮 */
(function () {
  'use strict';

  var LANG_KEY = 'lyt-lang';

  function applyLang(lang) {
    var nodes = document.querySelectorAll('[data-zh]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var val = el.getAttribute(lang === 'zh' ? 'data-zh' : 'data-en');
      if (val === null || val === undefined) continue;
      if (el.tagName === 'META') {
        el.setAttribute('content', val);
      } else if (val.indexOf('<') !== -1) {
        el.innerHTML = val; /* 含 <br> 或内嵌 span 的文案 */
      } else {
        el.textContent = val;
      }
    }
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'en';

    var btns = document.querySelectorAll('.lang-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].classList.toggle('active', btns[j].getAttribute('data-lang') === lang);
    }
    updateYear();
  }

  function updateYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* 语言切换按钮 */
  var langBtns = document.querySelectorAll('.lang-btn');
  for (var i = 0; i < langBtns.length; i++) {
    langBtns[i].addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      applyLang(lang);
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* 私有模式忽略 */ }
    });
  }

  /* 初始化语言（默认中文） */
  var saved = 'zh';
  try { saved = localStorage.getItem(LANG_KEY) || 'zh'; } catch (e) { /* 忽略 */ }
  applyLang(saved === 'en' ? 'en' : 'zh');

  /* 移动端导航 */
  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelectorAll('.site-nav > a');

  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    for (var k = 0; k < navLinks.length; k++) {
      navLinks[k].addEventListener('click', function () {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /* 滚动高亮当前区块对应的导航项 */
  var sections = document.querySelectorAll('section[id], footer[id]');
  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      for (var m = 0; m < entries.length; m++) {
        if (!entries[m].isIntersecting) continue;
        var id = entries[m].target.getAttribute('id');
        for (var n = 0; n < navLinks.length; n++) {
          var link = navLinks[n];
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        }
      }
    }, { rootMargin: '-40% 0px -55% 0px' });
    for (var p = 0; p < sections.length; p++) observer.observe(sections[p]);
  }
})();
