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
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/8 border border-secondary/20">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Gross Salary</p>
          <p className="text-xs text-muted-foreground mt-1">Total amount</p>
        </div>
        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.gross)}</p>
      </div>

      <div className="space-y-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
        <p className="text-xs font-bold text-foreground uppercase tracking-widest">Deductions</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">NSSF Contribution</p>
              <p className="text-xs text-muted-foreground mt-0.5">10% of gross</p>
            </div>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(results.nssf)}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">P.A.Y.E Tax</p>
              <p className="text-xs text-muted-foreground mt-0.5">Based on brackets</p>
            </div>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(results.paye)}</p>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-destructive/10 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-destructive">Total Deductions</p>
            <p className="text-xs text-muted-foreground mt-0.5">{deductionPercentage.toFixed(1)}% of gross</p>
          </div>
          <p className="text-xl font-bold text-destructive">{formatCurrency(totalDeductions)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-5 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Net Salary</p>
          <p className="text-xs text-muted-foreground mt-1">Your take-home amount</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {formatCurrency(results.net)}
          </p>
        </div>
      </div>
    </div>
  )
}
