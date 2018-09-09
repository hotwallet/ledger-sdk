# ledger-sdk

Ledger SDK for Chrome browser

### TODO

- Add support for Node.js / Electron

### Install

```
npm i ledger-sdk
```

### Usage

```js
import LedgerSDK from 'ledger-sdk'

const ledger = new LedgerSDK()

ledger.on('open', data => console.log(`${data.symbol} open`, data))

ledger.on('BTC:open', data => console.log('BTC open', data))
ledger.on('BTC:close', () => console.log('BTC close'))

ledger.on('ETH:open', data => console.log('ETH open', data))
ledger.on('ETH:close', () => console.log('ETH close'))

ledger.on('LTC:open', data => console.log('LTC open', data))
ledger.on('LTC:close', () => console.log('LTC close'))

ledger.on('ZEC:open', data => console.log('ZEC open', data))
ledger.on('ZEC:close', () => console.log('ZEC close'))

ledger.start()
```
