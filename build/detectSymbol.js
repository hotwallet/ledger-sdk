'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectSymbol = detectSymbol;
var patterns = {
  BTC: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
  ETH: '^0x[a-fA-F0-9]{40}$',
  LTC: '^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$',
  ZEC: '^[tz][a-km-zA-HJ-NP-Z1-9]{25,34}$'
};

function detectSymbol(address) {
  var detectedSymbol = null;
  Object.keys(patterns).some(function (symbol) {
    var pattern = patterns[symbol];
    var regex = new RegExp(pattern);
    var test = regex.test(address);
    if (test) {
      detectedSymbol = symbol;
      return true;
    }
  });
  return detectedSymbol;
}

var symbols = exports.symbols = Object.keys(patterns);