/**
 * CTMC post (2026-05-10): Binomial(n, λ/n) vs Poisson(λ) convergence widget.
 * Depends on assets/js/stochviz/distributions.js and D3.
 */
(function (global) {
  'use strict';

  var SV = global.StochViz;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function readTheme() {
    return {
      barFill: cssVar('--stochviz-bar-fill'),
      barStroke: cssVar('--stochviz-bar-stroke'),
      refFill: cssVar('--stochviz-ref-fill'),
      axis: cssVar('--stochviz-axis'),
      text: cssVar('--stochviz-text'),
      grid: cssVar('--stochviz-grid'),
      intervalFill: cssVar('--stochviz-interval-fill'),
      intervalStroke: cssVar('--stochviz-interval-stroke'),
    };
  }

  function formatP(p) {
    if (p < 0.001) return p.toExponential(2);
    return p.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0');
  }

  /**
   * @param {HTMLElement} container - root element with .stochviz-panel
   * @param {object} opts
   * @param {number} [opts.lambda=3]
   * @param {number} [opts.n=10]
   * @param {number} [opts.nMin=5]
   * @param {number} [opts.nMax=500]
   * @param {number} [opts.nStep=5]
   * @param {number} [opts.maxK=12]
   * @param {number} [opts.width=640]
   * @param {number} [opts.height=280]
   */
  function createBinomialPoissonConvergenceWidget(container, opts) {
    if (!global.d3 || !SV) {
      console.warn('createBinomialPoissonConvergenceWidget: d3 or StochViz not loaded');
      return null;
    }

    opts = opts || {};
    var lambda = opts.lambda != null ? opts.lambda : 3;
    var n = opts.n != null ? opts.n : 10;
    var nMin = opts.nMin != null ? opts.nMin : 5;
    var nMax = opts.nMax != null ? opts.nMax : 500;
    var nStep = opts.nStep != null ? opts.nStep : 5;
    var maxK = opts.maxK != null ? opts.maxK : 12;
    var width = opts.width != null ? opts.width : 640;
    var height = opts.height != null ? opts.height : 280;
    var margin = { top: 20, right: 16, bottom: 44, left: 48 };
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;

    var intervalEl = container.querySelector('.stochviz-interval');
    var plotEl = container.querySelector('.stochviz-plot');
    var sliderEl = container.querySelector('.stochviz-n-slider');
    var nOutEl = container.querySelector('.stochviz-n-out');
    var pOutEl = container.querySelector('.stochviz-p-out');

    if (!plotEl || !sliderEl) {
      console.warn('createBinomialPoissonConvergenceWidget: missing plot or slider element');
      return null;
    }

    sliderEl.min = String(nMin);
    sliderEl.max = String(nMax);
    sliderEl.step = String(nStep);
    sliderEl.value = String(n);

    var intervalWidth = width;
    var intervalHeight = 28;
    var intervalInnerW = intervalWidth - 8;
    var cellBarHeight = 12;

    var intervalSvg = intervalEl
      ? d3.select(intervalEl)
          .append('svg')
          .attr('viewBox', '0 0 ' + intervalWidth + ' ' + intervalHeight)
          .attr('width', '100%')
          .attr('height', intervalHeight)
          .attr('role', 'img')
          .attr('aria-label', 'Unit interval divided into n equal subintervals')
      : null;

    var intervalG = intervalSvg
      ? intervalSvg.append('g').attr('transform', 'translate(4, 2)')
      : null;

    var intervalCellsG = intervalG ? intervalG.append('g').attr('class', 'stochviz-interval-cells') : null;

    if (intervalG) {
      intervalG.append('text')
        .attr('class', 'stochviz-interval-end')
        .attr('x', 0)
        .attr('y', intervalHeight - 4)
        .attr('font-size', 9)
        .text('0');

      intervalG.append('text')
        .attr('class', 'stochviz-interval-end')
        .attr('x', intervalInnerW)
        .attr('y', intervalHeight - 4)
        .attr('text-anchor', 'end')
        .attr('font-size', 9)
        .text('1');
    }

    var svg = d3.select(plotEl)
      .append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('width', '100%')
      .attr('role', 'img')
      .attr('aria-label', 'Binomial versus Poisson probability mass functions');

    var g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scaleBand()
      .domain(d3.range(maxK + 1).map(String))
      .range([0, innerW])
      .padding(0.18);

    var yScale = d3.scaleLinear()
      .domain([0, 0.28])
      .range([innerH, 0]);

    var xAxisG = g.append('g')
      .attr('class', 'stochviz-axis stochviz-axis-x')
      .attr('transform', 'translate(0,' + innerH + ')');

    var yAxisG = g.append('g')
      .attr('class', 'stochviz-axis stochviz-axis-y');

    g.append('g').attr('class', 'stochviz-grid');
    g.append('g').attr('class', 'stochviz-bars');
    g.append('g').attr('class', 'stochviz-ref');

    g.append('text')
      .attr('class', 'stochviz-axis-label')
      .attr('x', innerW / 2)
      .attr('y', innerH + 36)
      .attr('text-anchor', 'middle')
      .text('count of successes k');

    g.append('text')
      .attr('class', 'stochviz-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerH / 2)
      .attr('y', -36)
      .attr('text-anchor', 'middle')
      .text('probability');

    var legend = g.append('g')
      .attr('class', 'stochviz-legend')
      .attr('transform', 'translate(0, -8)');

    legend.append('rect')
      .attr('class', 'stochviz-legend-bar')
      .attr('x', 0)
      .attr('y', -10)
      .attr('width', 14)
      .attr('height', 10)
      .attr('rx', 1);

    legend.append('text')
      .attr('class', 'stochviz-legend-text')
      .attr('x', 18)
      .attr('y', 0)
      .text('Binomial(n, p)');

    legend.append('circle')
      .attr('class', 'stochviz-legend-dot')
      .attr('cx', 130)
      .attr('cy', -5)
      .attr('r', 4);

    legend.append('text')
      .attr('class', 'stochviz-legend-text')
      .attr('x', 140)
      .attr('y', 0)
      .text('Poisson(\u03BB), \u03BB = ' + lambda);

    function poissonData() {
      return d3.range(maxK + 1).map(function (k) {
        return { k: k, prob: SV.poissonPmf(lambda, k) };
      });
    }

    function binomialData(nVal) {
      var p = lambda / nVal;
      return d3.range(maxK + 1).map(function (k) {
        return { k: k, prob: SV.binomialPmf(nVal, p, k) };
      });
    }

    function applyTheme() {
      var theme = readTheme();
      svg.selectAll('.stochviz-axis path, .stochviz-axis line').attr('stroke', theme.axis);
      svg.selectAll('.stochviz-axis text, .stochviz-axis-label, .stochviz-legend-text')
        .attr('fill', theme.text);
      g.selectAll('.stochviz-grid line').attr('stroke', theme.grid);
      g.selectAll('.stochviz-bars rect').attr('fill', theme.barFill).attr('stroke', theme.barStroke);
      g.selectAll('.stochviz-ref circle').attr('fill', theme.refFill);
      legend.select('.stochviz-legend-bar').attr('fill', theme.barFill).attr('stroke', theme.barStroke);
      legend.select('.stochviz-legend-dot').attr('fill', theme.refFill);

      if (intervalCellsG) {
        intervalCellsG.selectAll('rect')
          .attr('fill', theme.intervalFill)
          .attr('stroke', theme.intervalStroke);
        intervalG.selectAll('.stochviz-interval-end').attr('fill', theme.text);
      }
    }

    function drawAxes() {
      var theme = readTheme();
      xAxisG.call(d3.axisBottom(xScale).tickFormat(function (d) { return d; }));
      yAxisG.call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.2f')));

      g.select('.stochviz-grid')
        .selectAll('line')
        .data(yScale.ticks(5))
        .join('line')
        .attr('x1', 0)
        .attr('x2', innerW)
        .attr('y1', function (d) { return yScale(d); })
        .attr('y2', function (d) { return yScale(d); })
        .attr('stroke', theme.grid)
        .attr('stroke-dasharray', '2,3');

      applyTheme();
    }

    function drawReference() {
      g.select('.stochviz-ref')
        .selectAll('circle')
        .data(poissonData(), function (d) { return d.k; })
        .join('circle')
        .attr('cx', function (d) { return xScale(String(d.k)) + xScale.bandwidth() / 2; })
        .attr('cy', function (d) { return yScale(d.prob); })
        .attr('r', 4);
      applyTheme();
    }

    function updateInterval(nVal) {
      if (!intervalCellsG) return;

      var cellWidth = intervalInnerW / nVal;
      var strokeWidth = nVal > 120 ? 0.25 : nVal > 40 ? 0.5 : 0.75;

      intervalCellsG
        .selectAll('rect')
        .data(d3.range(nVal))
        .join('rect')
        .attr('x', function (i) { return i * cellWidth; })
        .attr('y', 2)
        .attr('width', Math.max(cellWidth, 0))
        .attr('height', cellBarHeight)
        .attr('stroke-width', strokeWidth);

      applyTheme();
    }

    function updateBars(nVal) {
      g.select('.stochviz-bars')
        .selectAll('rect')
        .data(binomialData(nVal), function (d) { return d.k; })
        .join('rect')
        .attr('x', function (d) { return xScale(String(d.k)); })
        .attr('y', function (d) { return yScale(d.prob); })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return innerH - yScale(d.prob); })
        .attr('rx', 1);

      if (nOutEl) nOutEl.textContent = String(nVal);
      if (pOutEl) pOutEl.textContent = formatP(lambda / nVal);
      applyTheme();
    }

    function setN(nVal) {
      nVal = Math.max(nMin, Math.min(nMax, Math.round(nVal / nStep) * nStep));
      n = nVal;
      sliderEl.value = String(nVal);
      updateInterval(nVal);
      updateBars(nVal);
    }

    sliderEl.addEventListener('input', function () {
      setN(Number(sliderEl.value));
    });

    var themeObserver = new MutationObserver(function () {
      applyTheme();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    drawAxes();
    drawReference();
    setN(n);

    return {
      setN: setN,
      destroy: function () {
        themeObserver.disconnect();
        if (intervalSvg) intervalSvg.remove();
        svg.remove();
      },
    };
  }

  global.createBinomialPoissonConvergenceWidget = createBinomialPoissonConvergenceWidget;
})(typeof window !== 'undefined' ? window : this);
