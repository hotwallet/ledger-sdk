var LedgerSDK = window.LedgerSDK
var ledger = new LedgerSDK()
var body = document.querySelector('body')

var events = {
  'open': false,
  'BTC:open': false,
  'BTC:close': false,
  'LTC:open': false,
  'LTC:close': false,
  'ETH:open': false,
  'ETH:close': false,
  'ZEC:open': false,
  'ZEC:close': false
}

function updateMessage() {
  Object.keys(events).some(event => {
    if (events[event]) return false
    body.innerHTML = `Waiting for ${event}...`
    return true
  })
}

console.log('supported symbols:', ledger.getSupportedSymbols())

Object.keys(events).forEach(event => {
  ledger.on(event, data => {
    console.log(event, data || '')
    if (data && data.legacy) {
      console.log('legacy 0/0', data.legacy.getAddress('0/0'))
    }
    if (data && data.segwit) {
      console.log('segwit 0/0', data.segwit.getAddress('0/0'))
    }
    if (data && data.getAddress) {
      console.log('address 0/0', data.getAddress('0/0'))
    }
    events[event] = true
    updateMessage()
  })
})

ledger.start()
updateMessage()
