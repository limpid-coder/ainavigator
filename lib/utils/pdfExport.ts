/**
 * PDF Export Utility
 * Generates PDF reports from assessment data using jsPDF
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFExportOptions {
  companyName: string
  assessment: {
    date: string
    respondents: number
    readinessScore: number
    sentimentAverage: number
    capabilityMaturity: number
  }
  sentimentData?: {
    heatmap: any
    problemCategories?: any[]
    lowestCells: any[]
  }
  capabilityData?: {
    dimensions: any[]
    weakestDimensions: any[]
    benchmarkComparison: any
  }
  interventions?: any[]
  filters?: any
  selectedFlow: 'sentiment' | 'capability' | 'both'
}

/**
 * Generate a professional PDF report
 */
export async function generatePDF(options: PDFExportOptions): Promise<void> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let currentY = margin

    // Helper: Add page if needed
    const checkAddPage = (requiredSpace: number = 40) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        pdf.addPage()
        currentY = margin
        return true
      }
      return false
    }

    // Helper: Add text with wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      checkAddPage(lines.length * fontSize * 0.35)
      pdf.text(lines, margin, currentY)
      currentY += lines.length * fontSize * 0.35 + 3
    }

    // ==================== PAGE 1: COVER ====================
    pdf.setFillColor(20, 184, 166) // Teal
    pdf.rect(0, 0, pageWidth, 80, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(32)
    pdf.setFont('helvetica', 'bold')
    pdf.text('AI Readiness', pageWidth / 2, 35, { align: 'center' })
    pdf.text('Assessment Report', pageWidth / 2, 50, { align: 'center' })

    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'normal')
    pdf.text(options.companyName, pageWidth / 2, 65, { align: 'center' })

    // Date and metadata
    pdf.setTextColor(100, 100, 100)
    pdf.setFontSize(10)
    currentY = 100
    addText(`Assessment Date: ${options.assessment.date}`, 10)
    addText(`Total Respondents: ${options.assessment.respondents}`, 10)
    addText(`Generated: ${new Date().toLocaleDateString()}`, 10)

    // Key Metrics Box
    currentY += 10
    pdf.setDrawColor(200, 200, 200)
    pdf.setFillColor(245, 245, 245)
    pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 60, 3, 3, 'FD')

    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Executive Summary', margin + 5, currentY + 10)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    
    const metrics = [
      `Overall Readiness: ${options.assessment.readinessScore}%`,
      `Sentiment Average: ${options.assessment.sentimentAverage}/5.0`,
      `Capability Maturity: ${options.assessment.capabilityMaturity}/7.0`
    ]
    
    let metricY = currentY + 22
    metrics.forEach(metric => {
      pdf.text(metric, margin + 10, metricY)
      metricY += 10
    })

    currentY += 70

    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('LeadingWith.AI', pageWidth / 2, pageHeight - 10, { align: 'center' })
    pdf.text('Confidential Assessment Report', pageWidth / 2, pageHeight - 6, { align: 'center' })

    // ==================== PAGE 2: SENTIMENT ANALYSIS ====================
    if (options.selectedFlow === 'sentiment' || options.selectedFlow === 'both') {
      pdf.addPage()
      currentY = margin

      pdf.setFontSize(20)
      pdf.setTextColor(20, 184, 166)
      pdf.setFont('helvetica', 'bold')
      addText('Sentiment Analysis', 20, true)
      
      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      addText('How employees feel about AI adoption across 5 sentiment levels and 5 characteristic categories.')

      currentY += 5

      // Sentiment Heatmap Summary
      if (options.sentimentData?.lowestCells && options.sentimentData.lowestCells.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(14)
        addText('Key Findings', 14, true)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        addText('The following areas show the strongest resistance or concern:', 10)

        options.sentimentData.lowestCells.slice(0, 5).forEach((cell, idx) => {
          checkAddPage(15)
          pdf.setFillColor(252, 165, 165) // Light red
          pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 12, 2, 2, 'F')
          
          pdf.setTextColor(50, 50, 50)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`${idx + 1}. ${cell.level} × ${cell.reason}`, margin + 3, currentY + 4)
          pdf.setFont('helvetica', 'normal')
          pdf.text(`Score: ${cell.score?.toFixed(2)} | Rank: #${cell.rank}`, margin + 3, currentY + 9)
          currentY += 15
        })
      }

      // Problem Categories
      if (options.sentimentData?.problemCategories && options.sentimentData.problemCategories.length > 0) {
        checkAddPage(30)
        currentY += 5
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(14)
        addText('AI-Generated Problem Categories', 14, true)

        options.sentimentData.problemCategories.forEach((category, idx) => {
          checkAddPage(25)
          
          pdf.setDrawColor(200, 200, 200)
          pdf.setFillColor(249, 250, 251)
          pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 20, 2, 2, 'FD')

          pdf.setTextColor(234, 88, 12) // Orange
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(11)
          pdf.text(`${category.category_name}`, margin + 3, currentY + 5)

          pdf.setTextColor(70, 70, 70)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(9)
          const desc = pdf.splitTextToSize(category.description || '', pageWidth - 2 * margin - 6)
          pdf.text(desc.slice(0, 2), margin + 3, currentY + 10)

          currentY += 23
        })
      }
    }

    // ==================== PAGE 3: CAPABILITY ANALYSIS ====================
    if (options.selectedFlow === 'capability' || options.selectedFlow === 'both') {
      pdf.addPage()
      currentY = margin

      pdf.setFontSize(20)
      pdf.setTextColor(147, 51, 234) // Purple
      pdf.setFont('helvetica', 'bold')
      addText('Capability Assessment', 20, true)

      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      addText('Organizational readiness across 8 capability dimensions compared to industry benchmarks.')

      currentY += 5

      // Dimensions Table
      if (options.capabilityData?.dimensions && options.capabilityData.dimensions.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        addText('Dimension Scores', 12, true)

        // Table header
        pdf.setFillColor(147, 51, 234)
        pdf.setTextColor(255, 255, 255)
        pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F')
        pdf.setFontSize(9)
        pdf.text('Dimension', margin + 2, currentY + 5)
        pdf.text('Score', margin + 100, currentY + 5)
        pdf.text('Benchmark', margin + 125, currentY + 5)
        pdf.text('Gap', margin + 155, currentY + 5)
        currentY += 10

        // Table rows
        options.capabilityData.dimensions.forEach((dim, idx) => {
          checkAddPage(8)
          if (idx % 2 === 0) {
            pdf.setFillColor(249, 250, 251)
          } else {
            pdf.setFillColor(255, 255, 255)
          }
          pdf.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F')

          pdf.setTextColor(50, 50, 50)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(9)
          pdf.text(dim.name || '', margin + 2, currentY + 5)
          pdf.text((dim.average || 0).toFixed(1), margin + 100, currentY + 5)
          pdf.text((dim.benchmark || 0).toFixed(1), margin + 125, currentY + 5)
          
          const gap = (dim.average || 0) - (dim.benchmark || 0)
          if (gap >= 0) {
            pdf.setTextColor(34, 197, 94)
          } else {
            pdf.setTextColor(239, 68, 68)
          }
          pdf.text(gap.toFixed(1), margin + 155, currentY + 5)

          currentY += 8
        })
      }

      // Weakest Dimensions
      if (options.capabilityData?.weakestDimensions && options.capabilityData.weakestDimensions.length > 0) {
        currentY += 10
        checkAddPage(30)
        pdf.setTextColor(80, 80, 80)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        addText('Priority Areas for Improvement', 12, true)

        options.capabilityData.weakestDimensions.slice(0, 3).forEach((dim, idx) => {
          checkAddPage(12)
          pdf.setFillColor(254, 243, 199) // Light yellow
          pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 10, 2, 2, 'F')

          pdf.setTextColor(50, 50, 50)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10)
          pdf.text(`${idx + 1}. ${dim.name}`, margin + 3, currentY + 4)
          pdf.setFont('helvetica', 'normal')
          pdf.text(`Score: ${dim.average?.toFixed(1)} (Benchmark: ${dim.benchmark?.toFixed(1)})`, margin + 3, currentY + 8)

          currentY += 12
        })
      }
    }

    // ==================== PAGE 4: INTERVENTIONS ====================
    if (options.interventions && options.interventions.length > 0) {
      pdf.addPage()
      currentY = margin

      pdf.setFontSize(20)
      pdf.setTextColor(20, 184, 166)
      pdf.setFont('helvetica', 'bold')
      addText('Recommended Interventions', 20, true)

      pdf.setTextColor(80, 80, 80)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      addText('Prioritized actions to improve AI readiness based on identified gaps.')

      currentY += 5

      options.interventions.slice(0, 5).forEach((intervention, idx) => {
        checkAddPage(35)

        // Intervention box
        pdf.setDrawColor(20, 184, 166)
        pdf.setLineWidth(0.5)
        pdf.setFillColor(240, 253, 250)
        pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, 30, 3, 3, 'FD')

        pdf.setTextColor(20, 184, 166)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        pdf.text(`${idx + 1}. ${intervention.title}`, margin + 3, currentY + 6)

        pdf.setTextColor(60, 60, 60)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        const desc = pdf.splitTextToSize(intervention.description || '', pageWidth - 2 * margin - 6)
        pdf.text(desc.slice(0, 3), margin + 3, currentY + 12)

        // Metrics
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Investment: ${intervention.investmentRange || 'TBD'}`, margin + 3, currentY + 26)
        pdf.text(`ROI: ${intervention.expectedROI || 'TBD'}`, margin + 70, currentY + 26)
        pdf.text(`Timeline: ${intervention.timeline || '12 weeks'}`, margin + 130, currentY + 26)

        currentY += 33
      })
    }

    // ==================== FINAL PAGE: NEXT STEPS ====================
    pdf.addPage()
    currentY = margin

    pdf.setFontSize(20)
    pdf.setTextColor(20, 184, 166)
    pdf.setFont('helvetica', 'bold')
    addText('Next Steps', 20, true)

    pdf.setTextColor(80, 80, 80)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)

    const nextSteps = [
      '1. Review this assessment with your leadership team',
      '2. Prioritize interventions based on business impact and feasibility',
      '3. Develop a detailed implementation roadmap',
      '4. Secure necessary resources and stakeholder buy-in',
      '5. Launch pilot programs for highest-priority interventions',
      '6. Monitor progress and adjust strategy as needed'
    ]

    nextSteps.forEach(step => {
      addText(step, 11)
    })

    currentY += 10
    pdf.setFont('helvetica', 'bold')
    addText('Contact Information', 12, true)
    pdf.setFont('helvetica', 'normal')
    addText('For questions or to discuss implementation, contact:', 10)
    addText('LeadingWith.AI', 10)
    addText('Email: info@leadingwithai.com', 10)

    // Save PDF
    const fileName = `AI_Readiness_Assessment_${options.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)

  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw new Error('Failed to generate PDF report')
  }
}

/**
 * Capture a DOM element as an image and add to PDF
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
      backgroundColor: '#ffffff'
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

