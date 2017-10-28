const EventEmitter = require('events')
const util = require('util')
const Ledger = require('ledgerco')
const LedgerNode = require('ledgerco/src/ledger-comm-node')

const Btc = Ledger.btc

class LedgerSDK extends EventEmitter {
  constructor() {
    super()
    this.comm = null
    this.connected = false
    this.plugged = false
    this.btc = null
    this.walletType = null
    this.walletId = null
  }

  start() {
    if (this.poller) {
      throw new Error('LedgerSDK poller already started.')
    }
    this.emit('start')
    let i = 0
    this.poller = setInterval(() => {
      i += 1
      switch (i) {
        case 1: return this.pollDevices()
        case 2: return this.pollBitcoinCompatibleApp()
        default: i = 0
      }
    }, 250)
  }

  stop() {
    if (!this.poller) {
      throw new Error('LedgerSD poller already stopped.')
    }
    clearInterval(this.poller)
    this.poller = null
    this.emit('stop')
  }

  disconnect() {
    this.comm.device.close()
    this.connected = false
  }

  // bitcoin app must be open
  getFirmwareVersion() {
    return this.comm.exchange('E0C400000007', [0x9000])
      .then(hex => console.log('firmware version:', hex))
      .catch(err => console.log('firmware version:', err))
  }

  // bitcoin app must be open
  getRandom() {
    return this.comm.exchange('E0C000000000', [0x9000])
      .then(hex => console.log('random:', hex))
      .catch(err => console.log('random:', err))
  }

  getDeviceInfo() {
    return this.comm.device.getDeviceInfo()
  }

  pollDevices() {
    return LedgerNode.list_async().then(devices => {
      if (devices.length) {
        if (!this.plugged) {
          this.plugged = true
          this.emit('plug')
        }
        if (this.connected) {
          return // already connected
        }
        return LedgerNode.create_async()
          .then(comm => {
            this.comm = comm
            this.btc = new Btc(this.comm)
            this.connected = true
          })
      }
      if (this.plugged) {
        this.disconnect()
        this.plugged = false
        this.emit('unplug')
      }
    })
    .catch(console.log)
  }

  handleClosedBitcoinCompatibleApp() {
    if (this.walletType === 'btc' && this.walletId) {
      this.emit('btc:close')
    }
    if (this.walletType === 'ltc' && this.walletId) {
      this.emit('ltc:close')
    }
    this.walletType = null
    this.walletId = null
    this.disconnect()
  }

  pollBitcoinCompatibleApp() {
    const wallets = ['btc', 'ltc']
    if (!this.connected) {
      return
    }
    if (this.walletType && !wallets.includes(this.walletType)) {
      return
    }
    try {
      return this.getLedgerId()
        .then(ledgerId => {
          if (!ledgerId) {
            return this.handleClosedBitcoinCompatibleApp()
          }
          if (this.walletId !== ledgerId) {
            switch (ledgerId.charAt(0)) {
              case '1': this.walletType = 'btc'; break
              case 'L': this.walletType = 'ltc'; break
              default: throw new Error('Unsupported wallet.')
            }
            // bitcoin-compatible app just opened
            this.emit(`${this.walletType}:open`)
            this.walletId = ledgerId

          }
        })
    } catch (err) {
      this.handleClosedBitcoinCompatibleApp()
    }
  }

  getLedgerId() {
    return this.btc.getWalletPublicKey_async('0')
      .then(pubKey => pubKey.bitcoinAddress)
  }

  getExternalAddress(n) {
    return this.btc.getWalletPublicKey_async(`44'/0'/0'/0/${n}`)
  }

  getInternalAddress(n) {
    return this.btc.getWalletPublicKey_async(`44'/0'/0'/1/${n}`)
  }
}

util.inherits(LedgerSDK, EventEmitter)

module.exports = LedgerSDK
