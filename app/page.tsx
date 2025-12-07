"use client"
import { SalaryCalculator } from "@/components/salary-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-12">
      <SalaryCalculator />
    </main>
  )
}
