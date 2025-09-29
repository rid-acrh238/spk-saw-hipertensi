"use client"

import useSWR from "swr"
import type { Criterion, Alternative } from "./saw"

const STORAGE_KEY = "spk-saw-posyandu"

type StoreData = {
  criteria: Criterion[]
  alternatives: Alternative[]
}

function load(): StoreData {
  if (typeof window === "undefined")
    return { criteria: defaultCriteria(), alternatives: defaultAlternatives(defaultCriteria()) }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { criteria: defaultCriteria(), alternatives: defaultAlternatives(defaultCriteria()) }
    const parsed = JSON.parse(raw)
    return {
      criteria: Array.isArray(parsed.criteria) ? parsed.criteria : defaultCriteria(),
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : defaultAlternatives(defaultCriteria()),
    }
  } catch {
    return { criteria: defaultCriteria(), alternatives: defaultAlternatives(defaultCriteria()) }
  }
}

function save(data: StoreData) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function defaultCriteria(): Criterion[] {
  // Contoh kriteria relevan hipertensi
  return [
    { id: "k1", name: "Tekanan Sistolik (mmHg)", type: "cost", weight: 0.35 },
    { id: "k2", name: "Tekanan Diastolik (mmHg)", type: "cost", weight: 0.25 },
    { id: "k3", name: "Usia (tahun)", type: "benefit", weight: 0.15 },
    { id: "k4", name: "Komorbiditas (skor)", type: "benefit", weight: 0.15 },
    { id: "k5", name: "Kepatuhan Minum Obat (skor)", type: "benefit", weight: 0.1 },
  ]
}

export function defaultAlternatives(criteria: Criterion[]): Alternative[] {
  // Contoh 3 warga
  const mapScores = (scores: Record<string, number>) => {
    const norm: Record<string, number> = {}
    for (const c of criteria) norm[c.id] = scores[c.id] ?? 0
    return norm
  }
  return [
    {
      id: "a1",
      name: "Ibu Siti",
      scores: mapScores({
        k1: 160, // sistolik tinggi (cost)
        k2: 95, // diastolik (cost)
        k3: 68, // usia (benefit)
        k4: 3, // komorbid (benefit)
        k5: 2, // kepatuhan (benefit)
      }),
    },
    {
      id: "a2",
      name: "Bapak Andi",
      scores: mapScores({
        k1: 150,
        k2: 90,
        k3: 62,
        k4: 2,
        k5: 3,
      }),
    },
    {
      id: "a3",
      name: "Ibu Rina",
      scores: mapScores({
        k1: 155,
        k2: 100,
        k3: 71,
        k4: 1,
        k5: 4,
      }),
    },
  ]
}

export function useSPKStore() {
  const { data, mutate } = useSWR<StoreData>(STORAGE_KEY, () => Promise.resolve(load()), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const criteria = data?.criteria ?? defaultCriteria()
  const alternatives = data?.alternatives ?? defaultAlternatives(criteria)

  const setCriteria = (next: Criterion[]) => {
    const updated: StoreData = { criteria: next, alternatives }
    save(updated)
    mutate(updated, false)
  }

  const setAlternatives = (next: Alternative[]) => {
    const updated: StoreData = { criteria, alternatives: next }
    save(updated)
    mutate(updated, false)
  }

  const resetAll = () => {
    const updated: StoreData = { criteria: defaultCriteria(), alternatives: defaultAlternatives(defaultCriteria()) }
    save(updated)
    mutate(updated, false)
  }

  return { criteria, alternatives, setCriteria, setAlternatives, resetAll }
}
