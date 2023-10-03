import { describe, it, expect } from "vitest"
import { ResourceTypes, SubstrateSharedConfigResource } from "../types"
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
          resourceId: "0x0000000000000000000000000000000000000000000000000000000000000300",
          decimals: 18,
          address: "0x3F9A68fF29B3d86a6928C44dF171A984F6180009",
          symbol: "ERC20LRTest",
          type: ResourceTypes.FUNGIBLE,
        },
      )

      expect(formatedFee).toEqual("0.001 ERC20LRTest")
    })
    it("parses PHA transfer fee", () => {
      const formatedFee = getFormatedFee(
        {
          amount: "100000000000",
          tokenAddress: '{"Concrete":{"parents":"0","interior":"Here"}}',
          tokenSymbol: "PHA",
        },
        {
          resourceId: "0x0000000000000000000000000000000000000000000000000000000000001000",
          type: ResourceTypes.FUNGIBLE,
          native: true,
          symbol: "PHA",
          decimals: 12,
          assetName: "Phala",
          xcmMultiAssetId: {
            concrete: {
              parents: 0,
              interior: "Here",
            },
          },
        } as SubstrateSharedConfigResource,
      )

      expect(formatedFee).toEqual("0.1 PHA")
    })
  })
})
