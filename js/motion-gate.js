// Honor the OS-level "reduce motion" preference: hold back the sketch
// scripts (and any music) behind a click-to-play overlay instead of
// autoplaying. Sketch scripts are marked up as inert placeholders:
//   <script type="text/plain" class="gated" data-src="/js/foo.js"></script>
// or, for inline code, <script type="text/plain" class="gated">...</script>
(function() {
  var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load/run the gated scripts one at a time, preserving document order,
  // since inline sketch code depends on the libraries before it.
  function runGatedScripts() {
    var gated = Array.prototype.slice.call(
        document.querySelectorAll('script.gated'));
    (function next() {
      var placeholder = gated.shift();
      if (!placeholder) {
        // Processing.js only scans for sketches on DOMContentLoaded, which
        // has already fired by now, so trigger the scan by hand. reload()
        // reads the processingInstances global that only the never-run
        // init would have defined, so seed it first.
        if (window.Processing) {
          window.processingInstances = window.processingInstances || [];
          window.Processing.reload();
        }
        return;
      }
      var script = document.createElement('script');
      if (placeholder.getAttribute('data-src')) {
        script.src = placeholder.getAttribute('data-src');
        script.onload = next;
        script.onerror = next;
        document.body.appendChild(script);
      } else {
        script.text = placeholder.text;
        document.body.appendChild(script);
        next();
      }
    })();
  }

  document.addEventListener('DOMContentLoaded', function() {
    var player = document.getElementById('player');
    if (!reduceMotion) {
      runGatedScripts();
      return;
    }

    if (player) {
      player.autoplay = false;
      player.pause();
      player.currentTime = 0;
    }

    var gate = document.createElement('div');
    gate.id = 'motion-gate';
    gate.innerHTML =
        '<div id="motion-gate-box">' +
        '<p>This artwork is an animation with rapidly changing shapes and ' +
        'colors' + (player ? ', with music' : '') + '.</p>' +
        '<p>Because your system asks for reduced motion, it will not start ' +
        'until you press play.</p>' +
        '<button id="motion-gate-play">&#9654; Play animation</button>' +
        '</div>';
    document.body.appendChild(gate);
    document.getElementById('motion-gate-play')
        .addEventListener('click', function() {
      gate.parentNode.removeChild(gate);
      if (player) {
        player.play();
      }
      runGatedScripts();
    });
  });
})();
