const LedgerSDK = require('../src')

const ledger = new LedgerSDK()

ledger.on('plug', () => console.log('Ledger plugged in'))
ledger.on('unplug', () => console.log('Ledger unplugged'))

ledger.on('btc:open', () => console.log('BTC wallet opened'))
ledger.on('btc:close', () => console.log('BTC wallet closed'))

ledger.on('ltc:open', () => console.log('LTC wallet opened'))
ledger.on('ltc:close', () => console.log('LTC wallet closed'))