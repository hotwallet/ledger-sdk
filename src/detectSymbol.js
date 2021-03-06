const patterns = {
  BTC: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$',
  ETH: '^0x[a-fA-F0-9]{40}$',
  LTC: '^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$',
  ZEC: '^[tz][a-km-zA-HJ-NP-Z1-9]{25,34}$'
}

export function detectSymbol(address) {
  let detectedSymbol = null
  Object.keys(patterns).some(symbol => {
    const pattern = patterns[symbol]
    const regex = new RegExp(pattern)
    const test = regex.test(address)
    if (test) {
      detectedSymbol = symbol
      return true
    }
  })
  return detectedSymbol
}

export const symbols = Object.keys(patterns)

