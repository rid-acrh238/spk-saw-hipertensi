"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { SAWComputation } from "@/lib/saw"

export function SAWResults({ results }: { results: SAWComputation }) {
  const { normalizedWeights, normalizedMatrix, ranking, criteria, alternatives } = results

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Bobot</CardTitle>
          <CardDescription>Bobot setelah normalisasi (total = 1)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {criteria.map((c) => (
              <div key={c.id} className="rounded-md border p-3">
                <div className="text-sm text-muted-foreground">
                  {c.name} ({c.type})
                </div>
                <div className="text-2xl font-semibold">{normalizedWeights[c.id]?.toFixed(3)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matriks Ternormalisasi</CardTitle>
          <CardDescription>Benefit = nilai/max, Cost = min/nilai</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alternatif</TableHead>
                {criteria.map((c) => (
                  <TableHead key={c.id}>{c.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {alternatives.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  {criteria.map((c) => (
                    <TableCell key={c.id}>
                      {normalizedMatrix[a.id]?.[c.id] !== undefined ? normalizedMatrix[a.id][c.id].toFixed(3) : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peringkat SAW</CardTitle>
          <CardDescription>Skor akhir dan urutan prioritas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peringkat</TableHead>
                  <TableHead>Alternatif</TableHead>
                  <TableHead>Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map((r, idx) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.score.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ChartContainer
            className="w-full"
            config={{
              score: { label: "Skor", color: "var(--chart-1)" },
            }}
          >
            <BarChart data={ranking.map((r) => ({ name: r.name, score: Number(r.score.toFixed(4)) }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="var(--chart-1)" radius={4} />
              {/* @ts-ignore */}
              <ChartLegend content={(props) => <ChartLegendContent {...props} />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
