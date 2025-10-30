'use client'

import { motion } from 'framer-motion'
import { 
  FileText, Download, Share2, Presentation, FileSpreadsheet,
  CheckCircle, Clock, Users, BarChart3, Calendar, Mail
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportsViewProps {
  companyName: string
  onExportPDF: () => void
}

export default function ReportsView({ companyName, onExportPDF }: ReportsViewProps) {

  const reportTypes = [
    {
      id: 'executive',
      icon: FileText,
      title: 'Executive Summary Report',
      description: 'Comprehensive 25-page PDF with all findings, insights, and recommendations',
      features: ['Sentiment analysis', 'Capability assessment', 'AI insights', 'Action plan', 'ROI estimates'],
      format: 'PDF',
      pages: '25-30 pages',
      status: 'ready',
      action: onExportPDF
    },
    {
      id: 'board',
      icon: Presentation,
      title: 'Board Presentation Deck',
      description: 'Executive summary slides formatted for board meetings and stakeholder presentations',
      features: ['Key findings', 'Visual dashboards', 'Recommendations', 'Financial impact'],
      format: 'PowerPoint',
      pages: '12-15 slides',
      status: 'coming_soon',
      action: null
    },
    {
      id: 'detailed',
      icon: BarChart3,
      title: 'Detailed Analytics Report',
      description: 'In-depth statistical analysis with all data points, segmentations, and methodology',
      features: ['Full data set', 'Statistical breakdowns', 'Demographic segments', 'Methodology notes'],
      format: 'PDF',
      pages: '40-50 pages',
      status: 'coming_soon',
      action: null
    },
    {
      id: 'data',
      icon: FileSpreadsheet,
      title: 'Raw Data Export',
      description: 'Complete dataset in CSV format for custom analysis and integration',
      features: ['All responses', 'Calculated scores', 'Demographics', 'Timestamps'],
      format: 'CSV',
      pages: 'Full dataset',
      status: 'coming_soon',
      action: null
    }
  ]

  const shareOptions = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email Report',
      description: 'Send report directly to stakeholders'
    },
    {
      id: 'link',
      icon: Share2,
      title: 'Shareable Link',
      description: 'Generate secure view-only link (7-day expiry)'
    },
    {
      id: 'calendar',
      icon: Calendar,
      title: 'Schedule Presentation',
      description: 'Book follow-up session to review findings'
    }
  ]

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Reports & Export</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Generate professional reports and share findings with stakeholders
            </p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Analysis Complete</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-lg border border-teal-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-900 dark:text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">{companyName} - AI Readiness Assessment</h3>
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>October 27, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>1,000 respondents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>33 data points analyzed</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onExportPDF}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-400 hover:to-purple-400 text-slate-900 dark:text-white font-semibold transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <Download className="w-5 h-5" />
              Quick Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Available Report Formats</h3>
        
        <div className="grid md:grid-cols-2 gap-3 mb-6">
          {reportTypes.map((report, index) => {
            const Icon = report.icon
            const isReady = report.status === 'ready'
            
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  isReady
                    ? "bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 hover:border-white/20 cursor-pointer hover:shadow-lg"
                    : "bg-white/[0.03] border-white/5 opacity-60"
                )}
                onClick={isReady && report.action ? report.action : undefined}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      isReady
                        ? "bg-gradient-to-br from-blue-500 to-purple-500"
                        : "bg-white/10"
                    )}>
                      <Icon className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-0.5">{report.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{report.format}</span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-500">{report.pages}</span>
                      </div>
                    </div>
                  </div>
                  {isReady ? (
                    <span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                      Ready
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500 text-xs font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-gray-400 mb-3 leading-relaxed">{report.description}</p>

                <div className="space-y-1 mb-4">
                  {report.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400">
                      <CheckCircle className="w-3 h-3 text-teal-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {isReady && report.action && (
                  <button
                    onClick={report.action}
                    className="w-full px-4 py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 hover:border-teal-400/50 text-teal-300 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Generate & Download
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Share Options */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3 mt-6">Share & Distribute</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map((option, index) => {
            const Icon = option.icon
            
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 hover:border-white/20 p-4 text-center transition-all hover:shadow-lg opacity-60 cursor-not-allowed"
                disabled
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">{option.title}</h4>
                <p className="text-xs text-gray-500">{option.description}</p>
                <div className="mt-3 px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-600 text-[10px] font-semibold">
                  Coming Soon
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Help Text */}
      <div className="flex-shrink-0 px-4 py-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
        <p className="text-xs text-slate-600 dark:text-gray-400 flex items-start gap-2">
          <FileText className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <span>
            Reports include all assessment data, insights, and recommendations. 
            <span className="text-slate-900 dark:text-white font-medium"> For custom report formats or additional analyses, contact your account manager.</span>
          </span>
        </p>
      </div>
    </div>
  )
}
