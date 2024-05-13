export const NumberHelper = {
  formatBalance: (balance: number) => {
    return Number((balance / 1e18).toFixed(4))
  },
}
