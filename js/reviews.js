(function () {
  var SWIPE_THRESHOLD = 50;

  function init(root) {
    var viewport = root.querySelector('.reviews__viewport');
    var track = root.querySelector('.reviews__track');
    var prev = root.querySelector('.reviews__arrow--prev');
    var next = root.querySelector('.reviews__arrow--next');
    var pos = 0;
    var startX = 0;
    var startY = 0;
    var tracking = false;

    function step() {
      var slides = track.children;
      return slides[1].offsetLeft - slides[0].offsetLeft;
    }

    function max() {
      var last = track.lastElementChild;
      var tail = parseFloat(getComputedStyle(track).getPropertyValue('--tail')) || 0;
      return Math.max(0, last.offsetLeft + last.offsetWidth - viewport.clientWidth + tail);
    }

    function set(value) {
      pos = value;
      track.style.setProperty('--x', pos);
    }

    function go(dir) {
      var limit = max();
      if (dir > 0) {
        set(pos >= limit - 1 ? 0 : Math.min(pos + step(), limit));
      } else {
        set(pos <= 1 ? limit : Math.max(pos - step(), 0));
      }
    }

    prev.addEventListener('click', function () {
      go(-1);
    });

    next.addEventListener('click', function () {
      go(1);
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === 'ArrowRight') {
        go(1);
      }
    });

    window.addEventListener('resize', function () {
      set(0);
    });

    viewport.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') {
        return;
      }
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    viewport.addEventListener('pointerup', function (e) {
      if (!tracking) {
        return;
      }
      tracking = false;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
      }
    });

    viewport.addEventListener('pointercancel', function () {
      tracking = false;
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-reviews]'), init);
})();
