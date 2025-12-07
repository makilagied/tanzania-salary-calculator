"use client"

interface ResultBreakdownProps {
  results: {
    gross: number
    nssf: number
    paye: number
    net: number
  }
}

export function ResultBreakdown({ results }: ResultBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalDeductions = results.nssf + results.paye
  const deductionPercentage = (totalDeductions / results.gross) * 100

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Gross Salary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg bg-secondary/8 border border-secondary/20 gap-2">
        <div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Gross Salary</p>
          <p className="text-xs text-muted-foreground mt-1">Total amount</p>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-foreground">{formatCurrency(results.gross)}</p>
      </div>

      {/* Deductions Section */}
      <div className="space-y-3 p-3 sm:p-4 rounded-lg bg-destructive/5 border border-destructive/20">
        <p className="text-xs font-bold text-foreground uppercase tracking-widest">Deductions</p>

        <div className="space-y-3">
          {/* NSSF */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <p className="text-xs sm:text-sm font-medium text-foreground">NSSF Contribution</p>
              <p className="text-xs text-muted-foreground mt-0.5">10% of gross</p>
            </div>
            <p className="text-base sm:text-lg font-semibold text-foreground">{formatCurrency(results.nssf)}</p>
          </div>

          {/* PAYE */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div>
              <p className="text-xs sm:text-sm font-medium text-foreground">P.A.Y.E Tax</p>
              <p className="text-xs text-muted-foreground mt-0.5">Based on brackets</p>
            </div>
            <p className="text-base sm:text-lg font-semibold text-foreground">{formatCurrency(results.paye)}</p>
          </div>
        </div>

        {/* Total Deductions */}
        <div className="pt-3 mt-3 border-t border-destructive/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <p className="text-xs sm:text-sm font-bold text-destructive">Total Deductions</p>
            <p className="text-xs text-muted-foreground mt-0.5">{deductionPercentage.toFixed(1)}% of gross</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-destructive">{formatCurrency(totalDeductions)}</p>
        </div>
      </div>

      {/* Net Salary - Highlighted */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 shadow-sm gap-3">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Net Salary</p>
          <p className="text-xs text-muted-foreground mt-1">Your take-home amount</p>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          {formatCurrency(results.net)}
        </p>
      </div>
    </div>
  )
}
