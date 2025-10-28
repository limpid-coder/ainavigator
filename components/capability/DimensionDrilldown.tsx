'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { getDimensionById, getConstructsForDimension } from '@/lib/constants/capability-metadata'
import { DimensionScore } from '@/lib/calculations/capability-analysis'

interface DimensionDrilldownProps {
  dimension: DimensionScore
  onBack: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export default function DimensionDrilldown({
  dimension,
  onBack,
  onNext,
  onPrevious
}: DimensionDrilldownProps) {
  
  const dimensionMeta = getDimensionById(dimension.dimensionId)
  const constructsMeta = getConstructsForDimension(dimension.dimensionId)
  
  const radarData = useMemo(() =>
    dimension.constructs.map((construct, idx) => ({
      construct: construct.name,
      score: construct.score,
      benchmark: construct.benchmark || dimension.benchmark / 2 // Rough estimate
    })),
    [dimension]
  )

  const getStatusDisplay = () => {
    const diff = dimension.average - dimension.benchmark
    if (dimension.status === 'significantly_below') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        text: 'Significantly below benchmark',
        color: 'text-red-400'
      }
    } else if (dimension.status === 'below') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        text: 'Below benchmark',
        color: 'text-orange-400'
      }
    } else if (dimension.status === 'above') {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        text: 'Above benchmark',
        color: 'text-green-400'
      }
    }
    return {
      icon: <CheckCircle className="w-5 h-5 text-gray-400" />,
      text: 'At benchmark',
      color: 'text-gray-400'
    }
  }

  const status = getStatusDisplay()

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>
        
        <div className="flex items-center gap-2">
          {onPrevious && (
            <button onClick={onPrevious} className="btn-secondary">
              Previous Dimension
            </button>
          )}
          {onNext && (
            <button onClick={onNext} className="btn-secondary">
              Next Dimension
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="glass-dark rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4">{dimension.name}</h2>
        
        {dimensionMeta?.description && (
          <div className="glass rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300 leading-relaxed">
                {dimensionMeta.description}
              </p>
            </div>
          </div>
        )}

        {/* Scores */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-gray-400 text-sm mb-1">Score</div>
            <div className="text-5xl font-bold">{dimension.average.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Benchmark</div>
            <div className="text-5xl font-bold text-purple-400">{dimension.benchmark.toFixed(1)}</div>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-3 ${status.color}`}>
          {status.icon}
          <span className="font-semibold">{status.text}</span>
        </div>
      </div>

      {/* 4-Construct Radar */}
      <div className="glass-dark rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Construct Breakdown</h3>
        
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
              <PolarAngleAxis
                dataKey="construct"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
              />
              <PolarRadiusAxis
                domain={[0, 10]}
                tick={{ fill: '#6B7280', fontSize: 10 }}
              />
              
              <Radar
                name="Score"
                dataKey="score"
                stroke="#0D7C7F"
                fill="#0D7C7F"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="#a855f7"
                fill="none"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Construct Details Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-white/10">
                <th className="p-2 text-left">Construct</th>
                <th className="p-2 text-center">Score</th>
                <th className="p-2 text-center">vs Benchmark</th>
              </tr>
            </thead>
            <tbody>
              {dimension.constructs.map((construct, idx) => {
                const benchmarkDiff = construct.benchmark 
                  ? construct.score - construct.benchmark
                  : null
                
                return (
                  <tr key={construct.constructId} className="border-b border-white/5">
                    <td className="p-3 text-sm">{construct.name}</td>
                    <td className="p-3 text-center font-semibold">{construct.score.toFixed(1)}</td>
                    <td className="p-3 text-center">
                      {benchmarkDiff !== null ? (
                        <span className={
                          benchmarkDiff > 0.5 ? 'text-green-400' :
                          benchmarkDiff < -0.5 ? 'text-red-400' :
                          'text-gray-400'
                        }>
                          {benchmarkDiff > 0 ? '+' : ''}{benchmarkDiff.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Weaknesses */}
      {dimension.constructs.some(c => c.score < dimension.average - 0.5) && (
        <div className="glass-dark rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Key Weaknesses in {dimension.name}
          </h3>
          <div className="space-y-2">
            {dimension.constructs
              .filter(c => c.score < dimension.average - 0.3)
              .sort((a, b) => a.score - b.score)
              .map(construct => (
                <div key={construct.constructId} className="glass rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm">{construct.name}</span>
                  <span className="text-sm font-semibold text-orange-400">
                    {construct.score.toFixed(1)} / 10
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}


