import type {
  EMIResult,
  AmortizationEntry,
  PrepaymentResult,
} from "@/types/finance";

/**
 * Calculate Equated Monthly Instalment (EMI) for a loan.
 * Formula: EMI = P * r * (1 + r)^n / [(1 + r)^n - 1]
 * where r = annualRate / 12, n = tenureMonths
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EMIResult {
  const r = annualRate / 12;

  let emi: number;
  if (r === 0) {
    emi = principal / tenureMonths;
  } else {
    emi =
      (principal * r * Math.pow(1 + r, tenureMonths)) /
      (Math.pow(1 + r, tenureMonths) - 1);
  }

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  return {
    emi,
    totalPayable,
    totalInterest,
    principal,
  };
}

/**
 * Generate a month-by-month amortization schedule.
 * Each entry shows EMI split into principal and interest parts.
 */
export function amortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number
): AmortizationEntry[] {
  const r = annualRate / 12;
  const { emi } = calculateEMI(principal, annualRate, tenureMonths);

  const schedule: AmortizationEntry[] = [];
  let balance = principal;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);

    schedule.push({
      month,
      emi,
      principalPart,
      interestPart,
      balance,
    });
  }

  return schedule;
}

/**
 * Calculate savings from making a fixed monthly prepayment on a loan.
 * Compares original loan cost with the prepaid version.
 */
export function prepaymentSavings(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  monthlyPrepayment: number
): PrepaymentResult {
  const r = annualRate / 12;
  const { emi, totalInterest: originalInterest } = calculateEMI(
    principal,
    annualRate,
    tenureMonths
  );

  // Simulate loan with monthly prepayment
  let balance = principal;
  let newTenureMonths = 0;
  let newInterest = 0;

  while (balance > 0 && newTenureMonths < tenureMonths) {
    const interestPart = balance * r;
    const totalPayment = Math.min(balance + interestPart, emi + monthlyPrepayment);
    const principalPart = totalPayment - interestPart;

    newInterest += interestPart;
    balance = Math.max(0, balance - principalPart);
    newTenureMonths++;
  }

  return {
    originalInterest,
    newInterest,
    interestSaved: originalInterest - newInterest,
    newTenureMonths,
    monthsSaved: tenureMonths - newTenureMonths,
  };
}
