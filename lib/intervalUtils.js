/**
 * Calculates the next follow_up_date.
 *
 * Rules (from spec):
 *  - ALWAYS uses current date at moment of click, never previous follow_up_date
 *  - If completed late, starts from actual completion date (today)
 *  - Returns ISO date string (YYYY-MM-DD) for Supabase timestamptz column
 */
export function calcNextFollowUp(intervalDays) {
  if (!intervalDays || intervalDays <= 0) return null

  const today = new Date()
  today.setDate(today.getDate() + Number(intervalDays))

  // Return YYYY-MM-DD — Supabase accepts this into timestamptz
  return today.toISOString().slice(0, 10)
}