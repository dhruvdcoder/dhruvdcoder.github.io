/**
 * Probability mass functions for stochviz widgets.
 * Uses log-space for binomial coefficients to avoid overflow at large n.
 */
(function (global) {
  'use strict';

  function logFactorial(n) {
    if (n < 0) return NaN;
    if (n <= 1) return 0;
    var sum = 0;
    for (var i = 2; i <= n; i++) sum += Math.log(i);
    return sum;
  }

  function logBinomialCoeff(n, k) {
    if (k < 0 || k > n) return -Infinity;
    return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
  }

  function binomialPmf(n, p, k) {
    if (p < 0 || p > 1 || k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    var logProb = logBinomialCoeff(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
    return Math.exp(logProb);
  }

  function poissonPmf(lambda, k) {
    if (lambda < 0 || k < 0 || !Number.isInteger(k)) return 0;
    if (lambda === 0) return k === 0 ? 1 : 0;
    return Math.exp(-lambda + k * Math.log(lambda) - logFactorial(k));
  }

  /** PMF values for k = 0, 1, …, maxK. */
  function pmfSeries(pmfFn, maxK) {
    var values = [];
    for (var k = 0; k <= maxK; k++) values.push(pmfFn(k));
    return values;
  }

  global.StochViz = global.StochViz || {};
  global.StochViz.binomialPmf = binomialPmf;
  global.StochViz.poissonPmf = poissonPmf;
  global.StochViz.pmfSeries = pmfSeries;
})(typeof window !== 'undefined' ? window : this);
