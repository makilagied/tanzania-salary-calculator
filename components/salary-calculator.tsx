"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ResultBreakdown } from "./result-breakdown"

export function SalaryCalculator() {
  const [calculationMode, setCalculationMode] = useState<"gross" | "net">("gross")
  const [grossSalary, setGrossSalary] = useState("")
  const [netSalary, setNetSalary] = useState("")
  const [results, setResults] = useState<{
    gross: number
    nssf: number
    paye: number
    net: number
  } | null>(null)

  const formatNumberInput = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, "")
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const parseFormattedNumber = (value: string): number => {
    return Number.parseFloat(value.replace(/,/g, ""))
  }

  const calculatePAYE = (taxable: number): number => {
    if (taxable <= 270000) return 0
    if (taxable <= 520000) return (taxable - 270000) * 0.08
    if (taxable <= 760000) return 20000 + (taxable - 520000) * 0.2
    if (taxable <= 1000000) return 68000 + (taxable - 760000) * 0.25
    return 128000 + (taxable - 1000000) * 0.3
  }

  const calculateGrossFromNet = (net: number): number => {
    let grossEstimate = net / 0.82

    for (let i = 0; i < 10; i++) {
      const nssf = grossEstimate * 0.1
      const taxable = grossEstimate - nssf
      const paye = calculatePAYE(taxable)
      const calculatedNet = grossEstimate - (nssf + paye)

      if (Math.abs(calculatedNet - net) < 1) {
        return grossEstimate
      }

      const difference = net - calculatedNet
      grossEstimate += difference / 0.82
    }

    return grossEstimate
  }

  const handleCalculate = () => {
    let gross: number
    let net: number
    let nssf: number
    let paye: number

    if (calculationMode === "gross") {
      gross = parseFormattedNumber(grossSalary)
      if (!gross || gross <= 0) {
        setResults(null)
        return
      }

      nssf = gross * 0.1
      const taxableIncome = gross - nssf
      paye = calculatePAYE(taxableIncome)
      net = gross - (nssf + paye)
    } else {
      net = parseFormattedNumber(netSalary)
      if (!net || net <= 0) {
        setResults(null)
        return
      }

      gross = calculateGrossFromNet(net)
      nssf = gross * 0.1
      const taxableIncome = gross - nssf
      paye = calculatePAYE(taxableIncome)
    }

    setResults({
      gross,
      nssf,
      paye,
      net,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCalculate()
    }
  }

  const handleGrossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setGrossSalary(formatted)
  }

  const handleNetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setNetSalary(formatted)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:p-12">
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-2 sm:mb-3">
            Salary Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Calculate your take-home salary with Tanzania's NSSF and P.A.Y.E deductions
          </p>
        </div>

        {/* Main Card */}
        <Card className="border border-border shadow-lg overflow-hidden flex-1 flex flex-col">
          <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground pb-6 pt-6 sm:pb-8 sm:pt-8">
            <div className="space-y-1 sm:space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-bold">Calculate Your Salary</CardTitle>
              <CardDescription className="text-primary-foreground/85 text-xs sm:text-sm">
                Choose your calculation method and enter the amount
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-6 sm:pt-8 space-y-6 flex-1 flex flex-col">
            {/* Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 bg-muted rounded-lg">
              <button
                onClick={() => {
                  setCalculationMode("gross")
                  setResults(null)
                  setNetSalary("")
                }}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 ${
                  calculationMode === "gross"
                    ? "bg-primary text-primary-foreground shadow-md scale-100"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Gross to Net
              </button>
              <button
                onClick={() => {
                  setCalculationMode("net")
                  setResults(null)
                  setGrossSalary("")
                }}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 ${
                  calculationMode === "net"
                    ? "bg-primary text-primary-foreground shadow-md scale-100"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Net to Gross
              </button>
            </div>

            {/* Input Section */}
            <div className="space-y-2 sm:space-y-3">
              {calculationMode === "gross" ? (
                <>
                  <label className="block text-xs sm:text-sm font-semibold text-foreground">
                    Gross Salary (TZS)
                    <span className="text-muted-foreground font-normal ml-1 sm:ml-2 text-xs sm:text-xs">
                      Amount before deductions
                    </span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 2,500,000"
                    value={grossSalary}
                    onChange={handleGrossChange}
                    onKeyDown={handleKeyPress}
                    className="h-12 sm:h-14 text-base sm:text-lg border-border focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </>
              ) : (
                <>
                  <label className="block text-xs sm:text-sm font-semibold text-foreground">
                    Net Salary (TZS)
                    <span className="text-muted-foreground font-normal ml-1 sm:ml-2 text-xs sm:text-xs">
                      Amount after deductions
                    </span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 2,000,000"
                    value={netSalary}
                    onChange={handleNetChange}
                    onKeyDown={handleKeyPress}
                    className="h-12 sm:h-14 text-base sm:text-lg border-border focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </>
              )}
            </div>

            {/* Calculate Button */}
            <Button
              onClick={handleCalculate}
              className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-md transition-all duration-200"
            >
              Calculate Salary
            </Button>

            {/* Results */}
            {results && (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border">
                <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 sm:mb-6">
                  Breakdown
                </h3>
                <ResultBreakdown results={results} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 sm:mt-6 border border-border shadow-sm bg-card/40 backdrop-blur-sm">
          <CardContent className="pt-5 sm:pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">NSSF Contribution</p>
                <p className="text-xl sm:text-2xl font-bold text-accent">10%</p>
                <p className="text-xs text-muted-foreground">Of gross salary</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">P.A.Y.E Tax</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">Progressive</p>
                <p className="text-xs text-muted-foreground">Based on income brackets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
