"use client"

import React, { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Label } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { skill: "N5 Grammar", progress: 120, fill: "#FF4D4F" },   // strong red
  { skill: "N5 Vocabulary", progress: 150, fill: "#FF7875" }, // medium red
  { skill: "Hiragana", progress: 180, fill: "#FFA39E" },     // soft red
  { skill: "Katakana", progress: 130, fill: "#FFCCC7" },     // pale red
  { skill: "Kanji", progress: 100, fill: "#D9363E" },        // dark red / crimson
]

const chartConfig = {
  progress: { label: "Progress" },
  "N5 Grammar": { label: "N5 Grammar", color: "#FF4D4F" },
  "N5 Vocabulary": { label: "N5 Vocabulary", color: "#FF7875" },
  Hiragana: { label: "Hiragana", color: "#FFA39E" },
  Katakana: { label: "Katakana", color: "#FFCCC7" },
  Kanji: { label: "Kanji", color: "#D9363E" },
}


export default function ChartPieDonutText() {
  const totalProgress = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.progress, 0)
  }, [])

  return (
    <Card className="flex flex-col w-fit bg-slate-100">
      <CardHeader className="items-center pb-0">
        <CardTitle>Study Progress</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="progress"
              nameKey="skill"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalProgress.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 24}
                          className="fill-muted-foreground"
                        >
                          Points
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Progress up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total study points for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
