var LedgerSDK = window.LedgerSDK
var ledger = new LedgerSDK()
var body = document.querySelector('body')

var events = {
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

Object.keys(events).forEach(event => {
  ledger.on(event, data => {
    console.log(event, data || '')
    events[event] = true
    updateMessage()
  })
})

ledger.start()
updateMessage()
