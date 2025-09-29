"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CriteriaEditor } from "@/components/spk/criteria-editor"
import { AlternativeEditor } from "@/components/spk/alternative-editor"
import { SAWResults } from "@/components/spk/saw-results"
import { useSPKStore } from "@/lib/local-storage"
import { getSAWResults } from "@/lib/saw"

export default function Page() {
  const { criteria, alternatives, resetAll } = useSPKStore()

  const results = useMemo(() => {
    return getSAWResults(criteria, alternatives)
  }, [criteria, alternatives])

  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/placeholder-logo.svg" alt="Logo Posyandu Flamboyan" className="h-8 w-8" />
              <div>
                <h1 className="text-pretty text-xl font-semibold leading-tight">SPK Prioritas Pemantauan Hipertensi</h1>
                <p className="text-muted-foreground text-sm">
                  Posyandu Flamboyan • Metode SAW (Simple Additive Weighting)
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={resetAll}>
              Reset ke Contoh
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="hasil">Hasil</TabsTrigger>
            <TabsTrigger value="tentang">Tentang</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Kriteria</CardTitle>
                <CardDescription>
                  Tentukan kriteria, tipe (benefit/cost), dan bobot. Bobot akan dinormalisasi agar total = 1.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CriteriaEditor />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternatif (Warga/Responden)</CardTitle>
                <CardDescription>
                  Tambahkan daftar warga yang akan diprioritaskan beserta skor per kriteria.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlternativeEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hasil">
            <SAWResults results={results} />
          </TabsContent>

          <TabsContent value="tentang">
            <Card>
              <CardHeader>
                <CardTitle>Tentang Sistem</CardTitle>
                <CardDescription>Metode SAW dan panduan singkat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Sistem Pendukung Keputusan (SPK) ini membantu kader Posyandu Flamboyan menentukan prioritas pemantauan
                  hipertensi berdasarkan beberapa kriteria. Metode yang digunakan adalah Simple Additive Weighting
                  (SAW).
                </p>
                <Separator />
                <div className="space-y-2">
                  <p className="font-medium">Langkah SAW:</p>
                  <ol className="list-inside list-decimal space-y-1 leading-relaxed">
                    <li>Normalisasi matriks keputusan: benefit = nilai/max, cost = min/nilai</li>
                    <li>Hitung skor: sum(normalisasi × bobot_ternormalisasi)</li>
                    <li>Urutkan skor untuk mendapatkan prioritas tertinggi</li>
                  </ol>
                </div>
                <Separator />
                <p className="text-muted-foreground text-sm">
                  Catatan: Data disimpan di browser (localStorage). Anda dapat ekspor/impor data JSON dari panel Data.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
