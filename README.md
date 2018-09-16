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

ledger.on('open', data => {
  console.log(`${data.symbol} open`, data)
  const address = data.getAddress('0/0')
})

ledger.on('BTC:open', data => console.log('BTC open', data))
ledger.on('BTC:close', () => console.log('BTC close'))

ledger.on('LTC:open', data => console.log('LTC open', data))
ledger.on('LTC:close', () => console.log('LTC close'))

ledger.start()
```
