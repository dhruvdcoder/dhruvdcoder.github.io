(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'cursor-shadow-layer';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width, docHeight;

  var PARTICLE_PER_PX = 1 / 90; // roughly one particle per 90px of page height
  var MIN_PARTICLES = 12;
  var MAX_PARTICLES = 60;

  function rand(min, max) { return min + Math.random() * (max - min); }

  function makeParticle(yFrom, yTo) {
    return {
      x: rand(0, width),
      y: rand(yFrom, yTo),
      vx: rand(-0.3, 0.3),
      vy: rand(-0.3, 0.3),
      r: rand(1.5, 4)
    };
  }

  var particles = [];

  function resize() {
    width = window.innerWidth;
    var newDocHeight = document.documentElement.scrollHeight;
    var prevDocHeight = docHeight || 0;
    docHeight = newDocHeight;

    canvas.width = width * dpr;
    canvas.height = docHeight * dpr;
    canvas.style.height = docHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var desiredCount = Math.max(MIN_PARTICLES, Math.min(MAX_PARTICLES, Math.round(docHeight * PARTICLE_PER_PX)));
    while (particles.length < desiredCount) {
      // New particles emerge in the newly revealed bottom region of the page
      // as content loads or the viewport grows, instead of resetting everyone.
      particles.push(makeParticle(prevDocHeight, docHeight));
    }
    if (particles.length > desiredCount) {
      particles.length = desiredCount;
    }
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);

  var mouse = { x: width / 2, y: (docHeight || 0) / 2 };
  var pointerActive = false;
  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX + window.scrollX;
    mouse.y = e.clientY + window.scrollY;
    pointerActive = true;
  });
  window.addEventListener('mouseleave', function () {
    pointerActive = false;
  });

  // The shadow itself lags slightly behind the raw cursor position.
  var shadow = { x: mouse.x, y: mouse.y };
  var SHADOW_EASE = 0.12;

  var ATTRACT_RADIUS = 220;
  var ATTRACT_STRENGTH = 0.02;
  var DAMPING = 0.985;
  var DRIFT_STRENGTH = 0.006;

  function step() {
    shadow.x += (mouse.x - shadow.x) * SHADOW_EASE;
    shadow.y += (mouse.y - shadow.y) * SHADOW_EASE;

    ctx.clearRect(0, 0, width, docHeight);

    if (pointerActive) {
      var grad = ctx.createRadialGradient(shadow.x, shadow.y, 0, shadow.x, shadow.y, 160);
      grad.addColorStop(0, 'rgba(0, 136, 176, 0.25)');
      grad.addColorStop(1, 'rgba(0, 136, 176, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(shadow.x, shadow.y, 160, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (pointerActive) {
        var dx = shadow.x - p.x;
        var dy = shadow.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < ATTRACT_RADIUS) {
          var force = (1 - dist / ATTRACT_RADIUS) * ATTRACT_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      p.vx += rand(-DRIFT_STRENGTH, DRIFT_STRENGTH);
      p.vy += rand(-DRIFT_STRENGTH, DRIFT_STRENGTH);

      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > docHeight) { p.y = docHeight; p.vy *= -1; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 136, 176, 0.45)';
      ctx.fill();
    }

    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();
