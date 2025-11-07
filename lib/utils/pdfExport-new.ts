/**
 * PDF Export Utility - The Gem of the Platform ✨
 * Generates stunning, professional PDF reports with real data and visual captures
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFExportOptions {
  companyName: string
  industry?: string
  assessment: {
    date: string
    respondents: number
    readinessScore: number
    sentimentAverage: number
    capabilityMaturity: number
  }
  sentimentData?: {
    stats?: {
      overallAverage: number
      totalRespondents: number
    }
    lowestCells: any[]
    problemCategories?: any[]
  }
  capabilityData?: {
    dimensions: any[]
    weakestDimensions: any[]
    overall?: {
      average: number
      max: number
      min: number
    }
  }
  interventions?: any[]
  filters?: any
  selectedFlow: 'sentiment' | 'capability' | 'both'
  elementIds?: {
    heatmap?: string
    radarChart?: string
  }
}

// Brand colors for PDF
const BRAND = {
  teal: { r: 20, g: 184, b: 166 },
  purple: { r: 168, g: 85, b: 247 },
  pink: { r: 236, g: 72, b: 153 },
  orange: { r: 249, g: 115, b: 22 },
  blue: { r: 59, g: 130, b: 246 },
  green: { r: 16, g: 185, b: 129 },
  red: { r: 239, g: 68, b: 68 },
  gray: { r: 107, g: 114, b: 128 }
}

/**
 * Generate a stunning, professional PDF report ✨
 */
export async function generatePDF(options: PDFExportOptions): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const W = pdf.internal.pageSize.getWidth()
    const H = pdf.internal.pageSize.getHeight()
    const M = 20 // margin
    const CW = W - 2 * M // content width
    let Y = M // current Y position

    // ==================== HELPERS ====================
    
    const newPage = () => {
      pdf.addPage()
      Y = M
      footer()
    }

    const checkSpace = (needed: number = 40) => {
      if (Y + needed > H - M) {
        newPage()
        return true
      }
      return false
    }

    const text = (content: string, fontSize = 10, bold = false, color = BRAND.gray) => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', bold ? 'bold' : 'normal')
      pdf.setTextColor(color.r, color.g, color.b)
      const lines = pdf.splitTextToSize(content, CW)
      checkSpace(lines.length * fontSize * 0.35 + 5)
      pdf.text(lines, M, Y)
      Y += lines.length * fontSize * 0.35 + 3
    }

    const gradient = (x: number, y: number, w: number, h: number, c1: any, c2: any) => {
      const steps = 30
      for (let i = 0; i < steps; i++) {
        const ratio = i / steps
        pdf.setFillColor(
          Math.round(c1.r + (c2.r - c1.r) * ratio),
          Math.round(c1.g + (c2.g - c1.g) * ratio),
          Math.round(c1.b + (c2.b - c1.b) * ratio)
        )
        pdf.rect(x, y + (h / steps) * i, w, h / steps, 'F')
      }
    }

    const circle = (x: number, y: number, r: number, color: any, opacity = 0.1) => {
      pdf.setFillColor(color.r, color.g, color.b)
      pdf.setGState(new (pdf as any).GState({ opacity }))
      pdf.circle(x, y, r, 'F')
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }))
    }

    const footer = () => {
      const fY = H - 10
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text('LeadingWith.AI - AI Navigator', W / 2, fY, { align: 'center' })
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, M, fY)
      const pageNum = (pdf as any).internal.getNumberOfPages()
      pdf.text(`Page ${pageNum}`, W - M, fY, { align: 'right' })
    }

    const card = (x: number, y: number, w: number, h: number, title: string, value: string, subtitle: string, color: any) => {
      // Light background
      const lightColor = {
        r: Math.min(255, color.r + 220),
        g: Math.min(255, color.g + 220),
        b: Math.min(255, color.b + 220)
      }
      pdf.setFillColor(lightColor.r, lightColor.g, lightColor.b)
      pdf.setDrawColor(color.r, color.g, color.b)
      pdf.setLineWidth(0.8)
      pdf.roundedRect(x, y, w, h, 3, 3, 'FD')
      
      // Title
      pdf.setTextColor(color.r, color.g, color.b)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.text(title, x + w/2, y + 7, { align: 'center' })
      
      // Value
      pdf.setFontSize(28)
      pdf.text(value, x + w/2, y + 20, { align: 'center' })
      
      // Subtitle
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      pdf.text(subtitle, x + w/2, y + 27, { align: 'center' })
    }

    // ==================== PAGE 1: COVER ====================
    
    // Stunning gradient background
    gradient(0, 0, W, 110, BRAND.teal, BRAND.purple)
    
    // Decorative circles
    circle(15, 25, 35, BRAND.pink, 0.2)
    circle(W - 15, 75, 45, BRAND.purple, 0.25)
    circle(W/2, 45, 25, BRAND.teal, 0.15)
    
    // Title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(40)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI Readiness', W / 2, 38, { align: 'center' })
    pdf.setFontSize(36)
    pdf.text('Assessment Report', W / 2, 55, { align: 'center' })

    // Company name
    pdf.setFontSize(22)
    pdf.setFont('helvetica', 'normal')
    pdf.text(options.companyName, W / 2, 75, { align: 'center' })
    
    if (options.industry) {
      pdf.setFontSize(13)
      pdf.text(options.industry, W / 2, 88, { align: 'center' })
    }
    
    // Date
    Y = 120
    pdf.setTextColor(100, 100, 100)
    pdf.setFontSize(10)
    pdf.text(`Assessment Completed: ${options.assessment.date}`, W / 2, Y, { align: 'center' })
    Y += 7
    pdf.text(`${options.assessment.respondents.toLocaleString()} Employees Surveyed`, W / 2, Y, { align: 'center' })
    
    // ==================== EXECUTIVE SUMMARY ====================
    Y = 145
    
    // Section header
    pdf.setTextColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Executive Summary', M, Y)
    gradient(M, Y + 3, 65, 2, BRAND.teal, BRAND.purple)
    Y += 15

    // Three metric cards
    const cW = (CW - 8) / 3
    card(M, Y, cW, 32, 'AI READINESS', 
      `${options.assessment.readinessScore}%`,
      options.assessment.readinessScore >= 75 ? 'Strong' : options.assessment.readinessScore >= 60 ? 'Moderate' : 'Developing',
      BRAND.teal)
    
    card(M + cW + 4, Y, cW, 32, 'SENTIMENT', 
      `${options.assessment.sentimentAverage}`,
      'out of 5.0',
      BRAND.purple)
    
    card(M + 2 * cW + 8, Y, cW, 32, 'CAPABILITY', 
      `${options.assessment.capabilityMaturity}`,
      'out of 10.0',
      BRAND.blue)
    
    Y += 40

    // Key insights box
    pdf.setFillColor(249, 250, 251)
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(M, Y, CW, 40, 3, 3, 'FD')
    
    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('📊 At a Glance', M + 4, Y + 7)
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(70, 70, 70)
    
    let iY = Y + 14
    if (options.sentimentData?.stats) {
      pdf.text(`✓ ${options.assessment.respondents} employees surveyed across 25 sentiment dimensions`, M + 4, iY)
      iY += 5
      pdf.text(`✓ Overall sentiment: ${options.sentimentData.stats.overallAverage.toFixed(2)}/5.0 average`, M + 4, iY)
      iY += 5
    }
    if (options.capabilityData?.overall) {
      pdf.text(`✓ 8 organizational capabilities assessed vs. industry benchmarks`, M + 4, iY)
      iY += 5
      pdf.text(`✓ Average capability maturity: ${options.capabilityData.overall.average.toFixed(1)}/10.0`, M + 4, iY)
    }
    
    Y += 47

    footer()

    // ==================== PAGE 2: SENTIMENT ANALYSIS ====================
    if (options.selectedFlow === 'sentiment' || options.selectedFlow === 'both') {
      newPage()

      // Beautiful header
      pdf.setTextColor(BRAND.purple.r, BRAND.purple.g, BRAND.purple.b)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Employee Sentiment Analysis', M, Y)
      gradient(M, Y + 3, 85, 2, BRAND.purple, BRAND.pink)
      Y += 13
      
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      text('Understanding how your team feels about AI - from excitement to resistance across 25 dimensions.')
      Y += 5

      // Stats summary
      if (options.sentimentData?.stats) {
        const bW = (CW - 6) / 3
        const bH = 24
        const bY = Y

        // Responses
        pdf.setFillColor(240, 253, 250)
        pdf.setDrawColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
        pdf.setLineWidth(0.5)
        pdf.roundedRect(M, bY, bW, bH, 2, 2, 'FD')
        pdf.setTextColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'bold')
        pdf.text('RESPONSES', M + bW/2, bY + 5, { align: 'center' })
        pdf.setFontSize(18)
        pdf.text(options.sentimentData.stats.totalRespondents.toString(), M + bW/2, bY + 16, { align: 'center' })

        // Score
        pdf.setFillColor(250, 245, 255)
        pdf.setDrawColor(BRAND.purple.r, BRAND.purple.g, BRAND.purple.b)
        pdf.roundedRect(M + bW + 3, bY, bW, bH, 2, 2, 'FD')
        pdf.setTextColor(BRAND.purple.r, BRAND.purple.g, BRAND.purple.b)
        pdf.setFontSize(8)
        pdf.text('AVG SCORE', M + bW + 3 + bW/2, bY + 5, { align: 'center' })
        pdf.setFontSize(18)
        pdf.text(`${options.sentimentData.stats.overallAverage.toFixed(1)}`, M + bW + 3 + bW/2, bY + 16, { align: 'center' })

        // Priority
        const priority = options.sentimentData.lowestCells?.length || 0
        pdf.setFillColor(255, 247, 237)
        pdf.setDrawColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
        pdf.roundedRect(M + 2*bW + 6, bY, bW, bH, 2, 2, 'FD')
        pdf.setTextColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
        pdf.setFontSize(8)
        pdf.text('PRIORITY', M + 2*bW + 6 + bW/2, bY + 5, { align: 'center' })
        pdf.setFontSize(18)
        pdf.text(priority.toString(), M + 2*bW + 6 + bW/2, bY + 16, { align: 'center' })

        Y = bY + bH + 12
      }

      // Capture heatmap if element provided
      if (options.elementIds?.heatmap) {
        try {
          const element = document.getElementById(options.elementIds.heatmap)
          if (element) {
            const canvas = await html2canvas(element, {
              scale: 2,
              logging: false,
              backgroundColor: '#ffffff'
            })
            const imgData = canvas.toDataURL('image/png')
            const imgW = CW
            const imgH = (canvas.height * imgW) / canvas.width
            
            checkSpace(imgH + 10)
            pdf.addImage(imgData, 'PNG', M, Y, imgW, imgH)
            Y += imgH + 10
          }
        } catch (err) {
          console.log('Could not capture heatmap:', err)
        }
      }

      // Priority areas - beautiful cards
      if (options.sentimentData?.lowestCells && options.sentimentData.lowestCells.length > 0) {
        checkSpace(50)
        
        pdf.setTextColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('🚨 Priority Areas', M, Y)
        Y += 9

        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(80, 80, 80)
        text('These areas show the highest concern and should be prioritized for intervention.')
        Y += 3

        options.sentimentData.lowestCells.slice(0, 5).forEach((cell, idx) => {
          checkSpace(20)
          
          // Card background
          pdf.setFillColor(255, 247, 237)
          pdf.setDrawColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
          pdf.setLineWidth(0.5)
          pdf.roundedRect(M, Y, CW, 16, 2, 2, 'FD')
          
          // Number badge
          pdf.setFillColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
          pdf.circle(M + 5, Y + 8, 3.5, 'F')
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`${idx + 1}`, M + 5, Y + 9.5, { align: 'center' })
          
          // Title
          pdf.setTextColor(50, 50, 50)
          pdf.setFontSize(10)
          pdf.text(`${cell.level} × ${cell.reason}`, M + 11, Y + 6)
          
          // Score badge
          const scoreColor = cell.score < 2.5 ? BRAND.red : BRAND.orange
          pdf.setFillColor(scoreColor.r, scoreColor.g, scoreColor.b)
          pdf.roundedRect(CW + M - 28, Y + 2, 26, 7, 2, 2, 'F')
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(8)
          pdf.text(`${cell.score?.toFixed(2)}`, CW + M - 15, Y + 6.5, { align: 'center' })
          
          // Details
          pdf.setTextColor(70, 70, 70)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(7)
          pdf.text(`${cell.count || 0} affected • Rank #${cell.rank}`, M + 11, Y + 12)

          Y += 18
        })
      }
    }

    // ==================== PAGE 3: CAPABILITY ASSESSMENT ====================
    if (options.selectedFlow === 'capability' || options.selectedFlow === 'both') {
      newPage()

      // Header
      pdf.setTextColor(BRAND.blue.r, BRAND.blue.g, BRAND.blue.b)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Organizational Capability Assessment', M, Y)
      gradient(M, Y + 3, 95, 2, BRAND.blue, BRAND.teal)
      Y += 13
      
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      text('Your organizational readiness across 8 strategic dimensions compared to industry benchmarks.')
      Y += 5

      // Stats
      if (options.capabilityData?.overall) {
        const bW = (CW - 6) / 3
        const bH = 24
        const bY = Y

        card(M, bY, bW, bH, 'AVERAGE', 
          `${options.capabilityData.overall.average.toFixed(1)}`,
          'out of 10.0', BRAND.teal)
        
        const above = options.capabilityData.dimensions?.filter(d => (d.average || 0) >= (d.benchmark || 0)).length || 0
        card(M + bW + 3, bY, bW, bH, 'ABOVE BENCHMARK',
          `${above}`,
          'dimensions', BRAND.green)
        
        const below = options.capabilityData.dimensions?.filter(d => (d.average || 0) < (d.benchmark || 0)).length || 0
        card(M + 2*bW + 6, bY, bW, bH, 'NEED FOCUS',
          `${below}`,
          'dimensions', BRAND.orange)

        Y = bY + bH + 12
      }

      // Capture radar chart if provided
      if (options.elementIds?.radarChart) {
        try {
          const element = document.getElementById(options.elementIds.radarChart)
          if (element) {
            const canvas = await html2canvas(element, {
              scale: 2,
              logging: false,
              backgroundColor: '#ffffff'
            })
            const imgData = canvas.toDataURL('image/png')
            const imgW = CW * 0.8
            const imgH = (canvas.height * imgW) / canvas.width
            
            checkSpace(imgH + 10)
            pdf.addImage(imgData, 'PNG', M + (CW - imgW)/2, Y, imgW, imgH)
            Y += imgH + 10
          }
        } catch (err) {
          console.log('Could not capture radar chart:', err)
        }
      }

      // Dimensions table - beautiful and clear
      if (options.capabilityData?.dimensions && options.capabilityData.dimensions.length > 0) {
        checkSpace(70)
        
        pdf.setTextColor(BRAND.blue.r, BRAND.blue.g, BRAND.blue.b)
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Dimension Breakdown', M, Y)
        Y += 9

        // Table header - gradient
        gradient(M, Y, CW, 7, BRAND.blue, BRAND.teal)
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Dimension', M + 2, Y + 5)
        pdf.text('Your Score', M + 90, Y + 5)
        pdf.text('Benchmark', M + 120, Y + 5)
        pdf.text('Gap', M + 148, Y + 5)
        pdf.text('Status', M + 165, Y + 5)
        Y += 8

        // Rows
        options.capabilityData.dimensions.forEach((dim, idx) => {
          checkSpace(7)
          
          // Alternating row colors
          pdf.setFillColor(idx % 2 === 0 ? 249 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 251 : 255)
          pdf.rect(M, Y, CW, 7, 'F')

          pdf.setTextColor(50, 50, 50)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(8)
          
          // Name
          const name = (dim.name || '').length > 35 ? dim.name.substring(0, 32) + '...' : dim.name
          pdf.text(name, M + 2, Y + 4.5)
          
          // Score - colored
          const score = dim.average || 0
          const benchmark = dim.benchmark || 0
          const gap = score - benchmark
          
          pdf.setFont('helvetica', 'bold')
          pdf.setTextColor(gap >= 0 ? BRAND.green.r : BRAND.orange.r, 
                          gap >= 0 ? BRAND.green.g : BRAND.orange.g, 
                          gap >= 0 ? BRAND.green.b : BRAND.orange.b)
          pdf.text(score.toFixed(1), M + 100, Y + 4.5, { align: 'right' })
          
          pdf.setTextColor(100, 100, 100)
          pdf.setFont('helvetica', 'normal')
          pdf.text(benchmark.toFixed(1), M + 130, Y + 4.5, { align: 'right' })
          
          // Gap with arrow
          pdf.setTextColor(gap >= 0 ? BRAND.green.r : BRAND.red.r,
                          gap >= 0 ? BRAND.green.g : BRAND.red.g,
                          gap >= 0 ? BRAND.green.b : BRAND.red.b)
          pdf.setFont('helvetica', 'bold')
          const arrow = gap >= 0 ? '↑' : '↓'
          pdf.text(`${arrow} ${Math.abs(gap).toFixed(1)}`, M + 155, Y + 4.5, { align: 'right' })
          
          // Status badge
          const status = gap >= 0 ? 'STRONG' : gap > -1 ? 'BELOW' : 'CRITICAL'
          const statusColor = gap >= 0 ? BRAND.green : gap > -1 ? BRAND.orange : BRAND.red
          pdf.setFillColor(statusColor.r, statusColor.g, statusColor.b)
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(6)
          pdf.roundedRect(M + 162, Y + 1.5, 20, 4.5, 1, 1, 'F')
          pdf.text(status, M + 172, Y + 4.5, { align: 'center' })

          Y += 7
        })

        Y += 5
      }
    }

    // ==================== PAGE 4: INTERVENTIONS ====================
    if (options.interventions && options.interventions.length > 0) {
      newPage()

      // Header
      pdf.setTextColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Recommended Interventions', M, Y)
      gradient(M, Y + 3, 80, 2, BRAND.orange, BRAND.pink)
      Y += 13
      
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      text('Prioritized actions to improve AI readiness based on identified gaps.')
      Y += 8

      options.interventions.slice(0, 6).forEach((intervention, idx) => {
        checkSpace(38)

        // Beautiful intervention card
        const cardBg = idx % 2 === 0 ? 
          { r: 255, g: 250, b: 245 } : // Orange tint
          { r: 250, g: 245, b: 255 }   // Purple tint
        
        pdf.setFillColor(cardBg.r, cardBg.g, cardBg.b)
        pdf.setDrawColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
        pdf.setLineWidth(0.8)
        pdf.roundedRect(M, Y, CW, 35, 3, 3, 'FD')

        // Number badge - gradient style
        gradient(M + 2, Y + 2, 8, 8, BRAND.orange, BRAND.pink)
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${idx + 1}`, M + 6, Y + 7.5, { align: 'center' })

        // Title
        pdf.setTextColor(BRAND.orange.r, BRAND.orange.g, BRAND.orange.b)
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(intervention.title, M + 13, Y + 7)

        // Description
        pdf.setTextColor(60, 60, 60)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        const desc = pdf.splitTextToSize(intervention.description || intervention.what_to_do || '', CW - 16)
        pdf.text(desc.slice(0, 3), M + 13, Y + 12)

        // Metrics row
        Y += 24
        pdf.setFontSize(7)
        
        // Investment
        pdf.setFillColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
        pdf.roundedRect(M + 4, Y, 45, 6, 1, 1, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`💰 ${intervention.investmentRange || intervention.budget_estimate || 'TBD'}`, M + 26.5, Y + 4, { align: 'center' })
        
        // ROI
        pdf.setFillColor(BRAND.green.r, BRAND.green.g, BRAND.green.b)
        pdf.roundedRect(M + 52, Y, 45, 6, 1, 1, 'F')
        pdf.text(`📈 ROI: ${intervention.expectedROI || intervention.expected_roi || 'TBD'}`, M + 74.5, Y + 4, { align: 'center' })
        
        // Timeline
        pdf.setFillColor(BRAND.blue.r, BRAND.blue.g, BRAND.blue.b)
        pdf.roundedRect(M + 100, Y, 45, 6, 1, 1, 'F')
        pdf.text(`⏱️  ${intervention.timeline || intervention.timeframe || '12 weeks'}`, M + 122.5, Y + 4, { align: 'center' })

        Y += 13
      })
    }

    // ==================== FINAL PAGE: NEXT STEPS ====================
    newPage()

    // Header
    pdf.setTextColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Next Steps', M, Y)
    gradient(M, Y + 3, 40, 2, BRAND.teal, BRAND.purple)
    Y += 13

    pdf.setTextColor(80, 80, 80)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    text('Your roadmap to accelerating AI adoption.')
    Y += 5

    const steps = [
      { title: 'Review Findings', desc: 'Share this assessment with your leadership team and key stakeholders' },
      { title: 'Prioritize Actions', desc: 'Select interventions based on business impact, feasibility, and resources' },
      { title: 'Build Roadmap', desc: 'Develop a detailed implementation plan with milestones and success metrics' },
      { title: 'Secure Resources', desc: 'Allocate budget, assign ownership, and get stakeholder buy-in' },
      { title: 'Launch Pilots', desc: 'Start with highest-priority interventions in controlled environments' },
      { title: 'Monitor Progress', desc: 'Track metrics, gather feedback, and iterate based on results' }
    ]

    steps.forEach((step, idx) => {
      checkSpace(18)
      
      // Step card
      pdf.setFillColor(249, 250, 251)
      pdf.setDrawColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
      pdf.setLineWidth(0.3)
      pdf.roundedRect(M, Y, CW, 15, 2, 2, 'FD')

      // Number
      pdf.setFillColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
      pdf.circle(M + 5, Y + 7.5, 3, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${idx + 1}`, M + 5, Y + 8.5, { align: 'center' })

      // Title
      pdf.setTextColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
      pdf.setFontSize(10)
      pdf.text(step.title, M + 11, Y + 5.5)

      // Description
      pdf.setTextColor(70, 70, 70)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      const descLines = pdf.splitTextToSize(step.desc, CW - 15)
      pdf.text(descLines, M + 11, Y + 10)

      Y += 17
    })

    // Contact section
    Y += 8
    pdf.setFillColor(240, 253, 250)
    pdf.setDrawColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(M, Y, CW, 25, 3, 3, 'FD')

    pdf.setTextColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('📞 Need Help?', M + 4, Y + 7)

    pdf.setTextColor(70, 70, 70)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text('For questions or to discuss implementation:', M + 4, Y + 13)
    
    pdf.setTextColor(BRAND.teal.r, BRAND.teal.g, BRAND.teal.b)
    pdf.setFont('helvetica', 'bold')
    pdf.text('LeadingWith.AI', M + 4, Y + 18)
    
    pdf.setFont('helvetica', 'normal')
    pdf.text('Email: info@leadingwithai.com', M + 4, Y + 22)

    // Save with beautiful filename
    const fileName = `AI_Readiness_Assessment_${options.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw new Error('Failed to generate PDF report')
  }
}

/**
 * Capture a DOM element as an image
 */
export async function captureElementToPDF(
  elementId: string,
  pdf: jsPDF,
  x: number,
  y: number,
  width: number
): Promise<number> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.warn(`Element ${elementId} not found`)
      return 0
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff',
      useCORS: true
    })

    const imgData = canvas.toDataURL('image/png')
    const imgHeight = (canvas.height * width) / canvas.width

    pdf.addImage(imgData, 'PNG', x, y, width, imgHeight)
    return imgHeight
  } catch (error) {
    console.error('Element capture error:', error)
    return 0
  }
}

