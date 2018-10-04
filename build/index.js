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
          this.emit('close');
        }
        this.symbol = symbol;
        this.emit(symbol + ':open', data);
        this.emit('open', Object.assign({ symbol: symbol }, data));
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
      this.emit('close');
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
                  _this4.close(err);
                }));

              case 9:
                return _context2.abrupt('return', this.checkETH().catch(function (err) {
                  _this4.close(err);
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
                }, 1350);

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
    key: 'getBTCData',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref4) {
        var btc = _ref4.btc,
            symbol = _ref4.symbol,
            derivationPath = _ref4.derivationPath,
            _ref4$isSegwit = _ref4.isSegwit,
            isSegwit = _ref4$isSegwit === undefined ? false : _ref4$isSegwit;

        var parentPath, _ref6, parentPubKey, response, pubKey, chainCode, xpub, getAddress;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                parentPath = derivationPath.split('/').slice(0, -1).join('/');
                _context4.next = 3;
                return btc.getWalletPublicKey(parentPath);

              case 3:
                _ref6 = _context4.sent;
                parentPubKey = _ref6.publicKey;
                _context4.next = 7;
                return btc.getWalletPublicKey(derivationPath);

              case 7:
                response = _context4.sent;
                pubKey = response.publicKey, chainCode = response.chainCode;
                xpub = (0, _xpubjs.deriveExtendedPublicKey)({ symbol: symbol, derivationPath: derivationPath, pubKey: pubKey, chainCode: chainCode, parentPubKey: parentPubKey });

                getAddress = function getAddress(path) {
                  return (0, _xpubjs.deriveAddress)({ symbol: symbol, xpub: xpub, path: path, isSegwit: isSegwit });
                };

                return _context4.abrupt('return', { pubKey: pubKey, parentPubKey: parentPubKey, chainCode: chainCode, xpub: xpub, getAddress: getAddress, derivationPath: derivationPath });

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getBTCData(_x) {
        return _ref5.apply(this, arguments);
      }

      return getBTCData;
    }()
  }, {
    key: 'checkBTC',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var data, btc, _ref8, address, symbol, derivationPath, isSegwit;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                data = {};
                btc = new _hwAppBtc2.default(this.transport);
                _context5.next = 4;
                return btc.getWalletPublicKey("0'");

              case 4:
                _ref8 = _context5.sent;
                address = _ref8.bitcoinAddress;
                symbol = (0, _detectSymbol.detectSymbol)(address);
                derivationPath = defaultDerivationPath[symbol];
                _context5.next = 10;
                return this.getBTCData({ btc: btc, symbol: symbol, derivationPath: derivationPath });

              case 10:
                data.legacy = _context5.sent;

                derivationPath = derivationPath.replace("44'", "49'");
                isSegwit = true;
                _context5.next = 15;
                return this.getBTCData({ btc: btc, symbol: symbol, derivationPath: derivationPath, isSegwit: isSegwit });

              case 15:
                data.segwit = _context5.sent;

                this.handleSymbol(symbol, data);

              case 17:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function checkBTC() {
        return _ref7.apply(this, arguments);
      }

      return checkBTC;
    }()
  }, {
    key: 'checkETH',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var eth, derivationPath, data, symbol;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                eth = new _hwAppEth2.default(this.transport);
                _context6.next = 3;
                return eth.getAppConfiguration();

              case 3:
                this.busy = false;

                if (!this.symbol) {
                  _context6.next = 6;
                  break;
                }

                return _context6.abrupt('return');

              case 6:
                this.busy = true;
                derivationPath = defaultDerivationPath.ETH + '/0';
                _context6.next = 10;
                return eth.getAddress(derivationPath, false, true);

              case 10:
                data = _context6.sent;
                symbol = (0, _detectSymbol.detectSymbol)(data.address);

                this.handleSymbol(symbol, data);

              case 13:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function checkETH() {
        return _ref9.apply(this, arguments);
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