export interface Depot {
  id: string
  user_id: string
  naam: string
  bank: string
  totaal_bedrag: number
  startdatum: string
  vervaldatum: string
  omschrijving: string | null
  created_at: string
}

export interface Factuur {
  id: string
  depot_id: string
  aanvrager_naam: string
  bedrag: number
  factuur_datum: string
  ingediend_op: string | null
  uitbetaald_op: string | null
  status: 'nieuw' | 'ingediend' | 'uitbetaald' | 'afgewezen'
  omschrijving: string | null
  pdf_url: string | null
  created_at: string
}
