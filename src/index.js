import Transport from '@ledgerhq/hw-transport-u2f'
import LedgerBTC from '@ledgerhq/hw-app-btc'
import LedgerETH from '@ledgerhq/hw-app-eth'
import { deriveExtendedPublicKey, deriveAddress } from 'xpubjs'
import EventEmitter from 'events'
import { detectSymbol, symbols } from './detectSymbol'
import 'babel-polyfill'

const defaultDerivationPath = {
  BTC: "44'/0'/0'",
  LTC: "44'/2'/0'",
  ETH: "44'/60'/0'"
}

const wallets = {
  BTC: ['BTC', 'LTC', 'ZEC'],
  ETH: ['ETH', 'ETC']
}

export default class LedgerSDK extends EventEmitter {
  constructor() {
    super()
    this.walletIndex = 0
    this.symbol = null
    this.busy = false
  }

  async createTransport() {
    this.transport = await Transport.create()
    // this.transport.setDebugMode(true)
    this.transport.setExchangeTimeout(2000)
    this.transport.on('disconnect', () => this.emit('disconnect'))
  }

  handleSymbol(symbol, data) {
    this.busy = false
    if (this.symbol === symbol) return
    if (symbols.includes(symbol)) {
      if (this.symbol) {
        this.emit(`${this.symbol}:close`)
        this.emit('close')
      }
      const xpub = data.xpub
      if (xpub) {
        Object.assign(data, {
          getAddress: path => deriveAddress({ symbol, xpub, path })
        })
      }
      this.symbol = symbol
      this.emit(`${symbol}:open`, data)
      this.emit('open', Object.assign({ symbol }, data))
    }
  }

  getWalletIndex() {
    return Object.keys(wallets).findIndex(w => wallets[w].includes(this.symbol))
  }

  close(err) {
    this.busy = false
    if (!this.symbol) return
    this.emit(`${this.symbol}:close`)
    this.symbol = null
    try { this.transport.close() } catch (error) {}
  }

  async pingDevice() {
    if (this.busy) return
    if (this.symbol) {
      this.walletIndex = this.getWalletIndex()
    }
    this.walletIndex += 1
    this.busy = true
    switch (this.walletIndex) {
      case 1: return this.checkBTC().catch(err => this.close(err))
      case 2: return this.checkETH().catch(err => this.close(err))
      default: this.walletIndex = 0
    }
    this.busy = false
  }

  async start() {
    await this.createTransport()
    this.pollInterval = setInterval(() => this.pingDevice(), 350)
  }

  stop() {
    clearInterval(this.pollInterval)
  }

  async checkBTC() {
    const btc = new LedgerBTC(this.transport)
    const { bitcoinAddress: address } = await btc.getWalletPublicKey("0'")
    const symbol = detectSymbol(address)
    console.log('symbol:', symbol)
    const derivationPath = defaultDerivationPath[symbol]
    const parentPath = derivationPath.split('/').slice(0, -1).join('/')
    const { publicKey: parentPubKey } = await btc.getWalletPublicKey(parentPath)
    const response = await btc.getWalletPublicKey(derivationPath)
    const { publicKey: pubKey, chainCode } = response
    const xpub = deriveExtendedPublicKey({ symbol, derivationPath, pubKey, chainCode, parentPubKey })
    const data = { pubKey, chainCode, address, xpub }
    this.handleSymbol(symbol, data)
  }

  async checkETH() {
    const eth = new LedgerETH(this.transport)
    await eth.getAppConfiguration()
    this.busy = false
    if (this.symbol) return
    this.busy = true
    const derivationPath = `${defaultDerivationPath.ETH}/0`
    const data = await eth.getAddress(derivationPath, false, true)
    const symbol = detectSymbol(data.address)
    this.handleSymbol(symbol, data)
  }
}

if (typeof window !== 'undefined') {
  window.LedgerSDK = LedgerSDK
}