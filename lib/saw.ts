export type Criterion = {
  id: string
  name: string
  type: "benefit" | "cost"
  weight: number
}

export type Alternative = {
  id: string
  name: string
  scores: Record<string, number> // key: criterionId
}

export type SAWComputation = {
  criteria: Criterion[]
  alternatives: Alternative[]
  normalizedWeights: Record<string, number>
  normalizedMatrix: Record<string, Record<string, number>> // altId -> critId -> value
  scores: Record<string, number> // altId -> score
  ranking: { id: string; name: string; score: number }[]
}

export function normalizeWeights(criteria: Criterion[]) {
  const sum = criteria.reduce((acc, c) => acc + (Number(c.weight) || 0), 0)
  if (sum === 0) {
    const equal = criteria.length ? 1 / criteria.length : 0
    return Object.fromEntries(criteria.map((c) => [c.id, equal]))
  }
  return Object.fromEntries(criteria.map((c) => [c.id, (Number(c.weight) || 0) / sum]))
}

export function getSAWResults(criteria: Criterion[], alternatives: Alternative[]): SAWComputation {
  const normalizedWeights = normalizeWeights(criteria)

  // Kumpulkan min/max per kriteria
  const maxByCrit: Record<string, number> = {}
  const minByCrit: Record<string, number> = {}
  for (const c of criteria) {
    const values = alternatives.map((a) => Number(a.scores[c.id] ?? 0))
    maxByCrit[c.id] = values.length ? Math.max(...values) : 0
    minByCrit[c.id] = values.length ? Math.min(...values) : 0
  }

  // Normalisasi matriks
  const normalizedMatrix: Record<string, Record<string, number>> = {}
  for (const a of alternatives) {
    normalizedMatrix[a.id] = {}
    for (const c of criteria) {
      const v = Number(a.scores[c.id] ?? 0)
      let n = 0
      if (c.type === "benefit") {
        n = maxByCrit[c.id] === 0 ? 0 : v / maxByCrit[c.id]
      } else {
        n = v === 0 ? 0 : minByCrit[c.id] === 0 ? 0 : minByCrit[c.id] / v
      }
      normalizedMatrix[a.id][c.id] = n
    }
  }

  // Hitung skor
  const scores: Record<string, number> = {}
  for (const a of alternatives) {
    let s = 0
    for (const c of criteria) {
      s += (normalizedMatrix[a.id][c.id] || 0) * (normalizedWeights[c.id] || 0)
    }
    scores[a.id] = s
  }

  const ranking = [...alternatives]
    .map((a) => ({ id: a.id, name: a.name, score: scores[a.id] || 0 }))
    .sort((x, y) => y.score - x.score)

  return {
    criteria,
    alternatives,
    normalizedWeights,
    normalizedMatrix,
    scores,
    ranking,
  }
}
