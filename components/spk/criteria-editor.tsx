"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useSPKStore, defaultCriteria } from "@/lib/local-storage"

export function CriteriaEditor() {
  const { criteria, setCriteria } = useSPKStore()
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState<"benefit" | "cost">("benefit")
  const [newWeight, setNewWeight] = useState<number>(0.1)

  const addCriterion = () => {
    if (!newName.trim()) return
    setCriteria([
      ...criteria,
      { id: crypto.randomUUID(), name: newName.trim(), type: newType, weight: Number(newWeight) || 0 },
    ])
    setNewName("")
    setNewWeight(0.1)
    setNewType("benefit")
  }

  const updateName = (id: string, name: string) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, name } : c)))
  }
  const updateType = (id: string, type: "benefit" | "cost") => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, type } : c)))
  }
  const updateWeight = (id: string, weight: number) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, weight } : c)))
  }
  const remove = (id: string) => {
    setCriteria(criteria.filter((c) => c.id !== id))
  }
  const restoreDefault = () => setCriteria(defaultCriteria())

  const totalWeight = criteria.reduce((s, c) => s + (Number(c.weight) || 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="grid flex-1 gap-2">
          <label className="text-sm">Nama Kriteria</label>
          <Input placeholder="Contoh: Tekanan Sistolik" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div className="grid w-[180px] gap-2">
          <label className="text-sm">Tipe</label>
          <Select value={newType} onValueChange={(v) => setNewType(v as "benefit" | "cost")}>
            <SelectTrigger>
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="benefit">Benefit</SelectItem>
              <SelectItem value="cost">Cost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-[160px] gap-2">
          <label className="text-sm">Bobot</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={newWeight}
            onChange={(e) => setNewWeight(Number.parseFloat(e.target.value))}
          />
        </div>
        <Button onClick={addCriterion}>Tambah</Button>
        <Button variant="secondary" onClick={restoreDefault}>
          Muat Contoh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead className="w-[140px]">Tipe</TableHead>
                <TableHead className="w-[140px]">Bobot</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Input value={c.name} onChange={(e) => updateName(c.id, e.target.value)} />
                  </TableCell>
                  <TableCell>
                    <Select value={c.type} onValueChange={(v) => updateType(c.id, v as "benefit" | "cost")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="benefit">Benefit</SelectItem>
                        <SelectItem value="cost">Cost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={c.weight}
                      onChange={(e) => updateWeight(c.id, Number.parseFloat(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => remove(c.id)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {criteria.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Belum ada kriteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Total bobot saat ini: <span className="font-medium">{totalWeight.toFixed(2)}</span>
        </p>
        <p className="text-muted-foreground">Saat perhitungan, bobot akan dinormalisasi agar total = 1</p>
      </div>
    </div>
  )
}
