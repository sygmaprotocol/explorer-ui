import { describe, it, expect } from "vitest"
import { SharedConfigDomain } from "../types"
import { getFormatedFee } from "./Helpers"

describe("Helpers", () => {
  describe("getFormatedFee", () => {
    it("parses ERC20 fee", () => {
      const formatedFee = getFormatedFee(
        {
          amount: "1000000000000000",
          tokenAddress: "0x0000000000000000000000000000000000000000",
          tokenSymbol: "eth",
        },
        {
          nativeTokenDecimals: 18,
          nativeTokenSymbol: "eth",
        } as SharedConfigDomain,
      )

      expect(formatedFee).toEqual("0.001 ETH")
    })
    it("parses PHA transfer fee", () => {
      const formatedFee = getFormatedFee(
        {
          amount: "100000000000",
          tokenAddress: '{"Concrete":{"parents":"0","interior":"Here"}}',
          tokenSymbol: "PHA",
        },
        {
          nativeTokenDecimals: 12,
          nativeTokenSymbol: "PHA",
        } as SharedConfigDomain,
      )

      expect(formatedFee).toEqual("0.1 PHA")
    })
  })
})
