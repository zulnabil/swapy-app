export const StringHelper = {
  shortenAddress: (address: string, first = 6, last = 4) => {
    if (address.length < first + last + 2) return address
    return `${address.slice(0, first)}...${address.slice(-last)}`
  },
}
