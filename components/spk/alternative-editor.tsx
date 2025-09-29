"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useSPKStore, defaultAlternatives } from "@/lib/local-storage"

export function AlternativeEditor() {
  const { criteria, alternatives, setAlternatives } = useSPKStore()
  const [newName, setNewName] = useState("")

  const criteriaOrder = useMemo(() => criteria.map((c) => c.id), [criteria])

  const addAlternative = () => {
    if (!newName.trim()) return
    const scores: Record<string, number> = {}
    criteria.forEach((c) => {
      scores[c.id] = 0
    })
    setAlternatives([...alternatives, { id: crypto.randomUUID(), name: newName.trim(), scores }])
    setNewName("")
  }

  const updateName = (id: string, name: string) => {
    setAlternatives(alternatives.map((a) => (a.id === id ? { ...a, name } : a)))
  }

  const updateScore = (altId: string, critId: string, value: number) => {
    setAlternatives(alternatives.map((a) => (a.id === altId ? { ...a, scores: { ...a.scores, [critId]: value } } : a)))
  }

  const remove = (id: string) => setAlternatives(alternatives.filter((a) => a.id !== id))

  const loadExamples = () => setAlternatives(defaultAlternatives(criteria))

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ criteria, alternatives }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "spk-saw-posyandu.json"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const importJSON = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed?.alternatives)) {
        // Tidak memaksa kriteria, karena bisa berbeda. Hanya muat alternatif jika strukturalnya sesuai.
        setAlternatives(parsed.alternatives)
      }
    } catch (_e) {
      // ignore
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="grid flex-1 gap-2">
          <label className="text-sm">Nama Alternatif</label>
          <Input placeholder="Contoh: Ibu Siti (RW 04)" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <Button onClick={addAlternative}>Tambah</Button>
        <Button variant="secondary" onClick={loadExamples}>
          Muat Contoh
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportJSON}>
            Ekspor JSON
          </Button>
          <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            Impor JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) importJSON(f)
              }}
            />
          </label>
        </div>
      </div>

      <Card>
        <CardContent className="overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Nama</TableHead>
                {criteria.map((c) => (
                  <TableHead key={c.id} className="text-nowrap">
                    {c.name}
                  </TableHead>
                ))}
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alternatives.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="min-w-[220px]">
                    <Input value={a.name} onChange={(e) => updateName(a.id, e.target.value)} />
                  </TableCell>
                  {criteriaOrder.map((cid) => (
                    <TableCell key={cid}>
                      <Input
                        type="number"
                        step="0.01"
                        value={a.scores[cid] ?? 0}
                        onChange={(e) => updateScore(a.id, cid, Number.parseFloat(e.target.value))}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => remove(a.id)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {alternatives.length === 0 && (
                <TableRow>
                  <TableCell colSpan={criteria.length + 2} className="text-center text-muted-foreground">
                    Belum ada alternatif
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-sm">
        Tips: Isikan nilai yang sebanding antar alternatif untuk setiap kriteria (mis. tekanan sistolik dalam mmHg).
      </p>
    </div>
  )
}
