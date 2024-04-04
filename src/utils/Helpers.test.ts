import { describe, it, expect } from "vitest"
import { formatDistanceStrict, sub } from "date-fns"
import { formatDistanceDate, getFormatedFee } from "./Helpers"

describe("Helpers", () => {
  describe("getFormatedFee", () => {
    it("parses ERC20 fee and returns fee with native token", () => {
      const formatedFee = getFormatedFee({
        amount: "1000000000000000",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenSymbol: "eth",
        transferId: "0x",
        decimals: 6,
        id: "0x",
      })

      expect(formatedFee).toEqual("0.001 ETH")
    })
    it("parses PHA transfer fee and return fee with native token", () => {
      const formatedFee = getFormatedFee({
        amount: "100000000000",
        tokenAddress: '{"Concrete":{"parents":"0","interior":"Here"}}',
        tokenSymbol: "PHA",
        transferId: "0x",
        decimals: 6,
        id: "0x",
      })

      expect(formatedFee).toEqual("0.1 PHA")
    })
  })

  describe("formatDistanceDate", () => {
    const wholeYear = sub(new Date(), { years: 1, days: 1 })
    const yearAndSomeDays = sub(new Date(), { years: 1, days: 14, hours: 7 })
    const yearAndSomeMonths = sub(new Date(), { years: 1, months: 2, hours: 10 })

    it.only("should return formated date days + hours", () => {
      const formattedDate = formatDistanceDate(wholeYear.toISOString())
      const distanceInDays = formatDistanceStrict(new Date(), wholeYear, { unit: "day" })
      const formattedDate2 = formatDistanceDate(yearAndSomeDays.toISOString())
      const distanceInDays2 = formatDistanceStrict(new Date(), yearAndSomeDays, { unit: "day" })
      const formattedDate3 = formatDistanceDate(yearAndSomeMonths.toISOString())
      const distanceInDays3 = formatDistanceStrict(new Date(), yearAndSomeMonths, { unit: "day" })

      expect(formattedDate.includes(distanceInDays)).toBe(true)
      expect(formattedDate.includes("hours ago")).toBe(false)
      expect(formattedDate2.includes(distanceInDays2)).toBe(true)
      expect(formattedDate2.includes("hours ago")).toBe(true)
      expect(formattedDate3.includes(distanceInDays3)).toBe(true)
      expect(formattedDate3.includes("hours ago")).toBe(true)
    })

    it("should return just days if date is between one month", () => {
      const monthAgo = sub(new Date(), { months: 1 })
      const formattedDate = formatDistanceDate(monthAgo.toISOString())
      const distanceInDays = formatDistanceStrict(new Date(), monthAgo, { unit: "day" })
      expect(formattedDate.includes(distanceInDays)).toBe(true)
    })

    it("should return days + hours if date is between one month and one year", () => {
      const twoMonthsAgo = sub(new Date(), { months: 2, hours: 6 })
      const formattedDate = formatDistanceDate(twoMonthsAgo.toISOString())
      const distanceInDays = formatDistanceStrict(new Date(), twoMonthsAgo, { unit: "day" })
      expect(formattedDate.includes(distanceInDays)).toBe(true)
      expect(formattedDate.includes("hours ago")).toBe(true)
    })

    it("should return hours + minutes if date is less than a day", () => {
      const twoHoursAgo = sub(new Date(), { hours: 2, minutes: 6 })
      const formattedDate = formatDistanceDate(twoHoursAgo.toISOString())
      const distanceInHours = formatDistanceStrict(new Date(), twoHoursAgo, { unit: "hour" })
      expect(formattedDate.includes(distanceInHours)).toBe(true)
      expect(formattedDate.includes("minutes ago")).toBe(true)
    })

    it("should return minutes ago if date is less than an hour", () => {
      const twoMinutesAgo = sub(new Date(), { minutes: 2, seconds: 6 })
      const formattedDate = formatDistanceDate(twoMinutesAgo.toISOString())
      const distanceInMinutes = formatDistanceStrict(new Date(), twoMinutesAgo, { unit: "minute" })
      expect(formattedDate.includes(distanceInMinutes)).toBe(true)
      expect(formattedDate.includes("minutes ago")).toBe(true)
    })
  })
})
