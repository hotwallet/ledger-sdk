'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hwTransportU2f = require('@ledgerhq/hw-transport-u2f');

var _hwTransportU2f2 = _interopRequireDefault(_hwTransportU2f);

var _hwAppBtc = require('@ledgerhq/hw-app-btc');

var _hwAppBtc2 = _interopRequireDefault(_hwAppBtc);

var _hwAppEth = require('@ledgerhq/hw-app-eth');

var _hwAppEth2 = _interopRequireDefault(_hwAppEth);

var _xpubjs = require('xpubjs');

var _xpubjs2 = _interopRequireDefault(_xpubjs);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _detectSymbol = require('./detectSymbol');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultDerivationPath = {
  BTC: "44'/0'/0'",
  LTC: "44'/2'/0'",
  ETH: "44'/60'/0'"
};

var wallets = {
  BTC: ['BTC', 'LTC', 'ZEC'],
  ETH: ['ETH', 'ETC']
};

var LedgerSDK = function (_EventEmitter) {
  _inherits(LedgerSDK, _EventEmitter);

  function LedgerSDK() {
    _classCallCheck(this, LedgerSDK);

    var _this = _possibleConstructorReturn(this, (LedgerSDK.__proto__ || Object.getPrototypeOf(LedgerSDK)).call(this));

    _this.walletIndex = 0;
    _this.symbol = null;
    _this.busy = false;
    return _this;
  }

  _createClass(LedgerSDK, [{
    key: 'createTransport',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _hwTransportU2f2.default.create();

              case 2:
                this.transport = _context.sent;

                // this.transport.setDebugMode(true)
                this.transport.setExchangeTimeout(2000);
                this.transport.on('disconnect', function () {
                  return _this2.emit('disconnect');
                });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createTransport() {
        return _ref.apply(this, arguments);
      }

      return createTransport;
    }()
  }, {
    key: 'handleSymbol',
    value: function handleSymbol(symbol, data) {
      this.busy = false;
      if (this.symbol === symbol) return;
      if (_detectSymbol.symbols.includes(symbol)) {
        if (this.symbol) {
          this.emit(this.symbol + ':close');
        }
        this.symbol = symbol;
        this.emit(symbol + ':open', data);
      }
    }
  }, {
    key: 'getWalletIndex',
    value: function getWalletIndex() {
      var _this3 = this;

      return Object.keys(wallets).findIndex(function (w) {
        return wallets[w].includes(_this3.symbol);
      });
    }
  }, {
    key: 'close',
    value: function close(err) {
      this.busy = false;
      if (!this.symbol) return;
      this.emit(this.symbol + ':close');
      this.symbol = null;
      try {
        this.transport.close();
      } catch (error) {}
    }
  }, {
    key: 'pingDevice',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.busy) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return');

              case 2:
                if (this.symbol) {
                  this.walletIndex = this.getWalletIndex();
                }
                this.walletIndex += 1;
                this.busy = true;
                _context2.t0 = this.walletIndex;
                _context2.next = _context2.t0 === 1 ? 8 : _context2.t0 === 2 ? 9 : 10;
                break;

              case 8:
                return _context2.abrupt('return', this.checkBTC().catch(function (err) {
                  return _this4.close(err);
                }));

              case 9:
                return _context2.abrupt('return', this.checkETH().catch(function (err) {
                  return _this4.close(err);
                }));

              case 10:
                this.walletIndex = 0;

              case 11:
                this.busy = false;

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function pingDevice() {
        return _ref2.apply(this, arguments);
      }

      return pingDevice;
    }()
  }, {
    key: 'start',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.createTransport();

              case 2:
                this.pollInterval = setInterval(function () {
                  return _this5.pingDevice();
                }, 250);

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function start() {
        return _ref3.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'stop',
    value: function stop() {
      clearInterval(this.pollInterval);
    }
  }, {
    key: 'checkBTC',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var btc, _ref5, address, symbol, derivationPath, parentPath, _ref6, parentPubKey, response, pubKey, chainCode, xpub, data;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                btc = new _hwAppBtc2.default(this.transport);
                _context4.next = 3;
                return btc.getWalletPublicKey("0'");

              case 3:
                _ref5 = _context4.sent;
                address = _ref5.bitcoinAddress;
                symbol = (0, _detectSymbol.detectSymbol)(address);
                derivationPath = defaultDerivationPath[symbol];
                parentPath = derivationPath.split('/').slice(0, -1).join('/');
                _context4.next = 10;
                return btc.getWalletPublicKey(parentPath);

              case 10:
                _ref6 = _context4.sent;
                parentPubKey = _ref6.publicKey;
                _context4.next = 14;
                return btc.getWalletPublicKey(derivationPath);

              case 14:
                response = _context4.sent;
                pubKey = response.publicKey, chainCode = response.chainCode;
                xpub = (0, _xpubjs2.default)({ symbol: symbol, derivationPath: derivationPath, pubKey: pubKey, chainCode: chainCode, parentPubKey: parentPubKey });
                data = { pubKey: pubKey, chainCode: chainCode, address: address, xpub: xpub };

                this.handleSymbol(symbol, data);

              case 19:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function checkBTC() {
        return _ref4.apply(this, arguments);
      }

      return checkBTC;
    }()
  }, {
    key: 'checkETH',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var eth, derivationPath, data, symbol;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                eth = new _hwAppEth2.default(this.transport);
                _context5.next = 3;
                return eth.getAppConfiguration();

              case 3:
                this.busy = false;

                if (!this.symbol) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt('return');

              case 6:
                this.busy = true;
                derivationPath = defaultDerivationPath.ETH + '/0';
                _context5.next = 10;
                return eth.getAddress(derivationPath, false, true);

              case 10:
                data = _context5.sent;
                symbol = (0, _detectSymbol.detectSymbol)(data.address);

                this.handleSymbol(symbol, data);

              case 13:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function checkETH() {
        return _ref7.apply(this, arguments);
      }

      return checkETH;
    }()
  }]);

  return LedgerSDK;
}(_events2.default);

exports.default = LedgerSDK;


if (typeof window !== 'undefined') {
  window.LedgerSDK = LedgerSDK;
}