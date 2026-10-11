(function () {
  var PREFIX = '#popup:';
  var popups = {};
  var current = null;
  var lastFocus = null;

  function collect() {
    var list = document.querySelectorAll('.popup[data-popup]');
    for (var i = 0; i < list.length; i++) {
      var names = list[i].getAttribute('data-popup').split(' ');
      for (var j = 0; j < names.length; j++) popups[names[j]] = list[i];
      list[i].setAttribute('tabindex', '-1');
    }
  }

  function clearHash() {
    if (location.hash.indexOf(PREFIX) === 0) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function close(keepHash) {
    if (!current) return;
    var el = current;
    current = null;
    el.classList.remove('is-open');
    document.body.classList.remove('is-popup-open');
    window.setTimeout(function () {
      if (current !== el) el.hidden = true;
    }, 300);
    if (!keepHash) clearHash();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  function open(name) {
    var el = popups[name];
    if (!el) return false;
    if (current === el) return true;
    if (current) close(true);
    else lastFocus = document.activeElement;
    current = el;
    el.hidden = false;
    el.scrollTop = 0;
    void el.offsetWidth;
    el.classList.add('is-open');
    document.body.classList.add('is-popup-open');
    el.focus({ preventScroll: true });
    return true;
  }

  function fromHash() {
    var h = decodeURIComponent(location.hash);
    if (h.indexOf(PREFIX) === 0) {
      if (!open(h.slice(PREFIX.length))) close(true);
    } else if (current) {
      close(true);
    }
  }

  function init() {
    collect();

    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="' + PREFIX + '"]') : null;
      if (a) {
        var name = a.getAttribute('href').slice(PREFIX.length);
        if (popups[name]) {
          e.preventDefault();
          if (current && lastFocus === null) lastFocus = document.activeElement;
          open(name);
          history.replaceState(null, '', PREFIX + name);
        }
        return;
      }
      if (!current) return;
      if (e.target.closest('.popup__close')) {
        close();
      } else if (e.target === current || e.target.classList.contains('popup__scroll')) {
        close();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!current) return;
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'Tab') {
        var f = current.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
