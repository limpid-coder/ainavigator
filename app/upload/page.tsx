'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Check, 
  X, 
  FileSpreadsheet,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Papa from 'papaparse'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface UploadedFile {
  name: string
  size: number
  type: 'sentiment' | 'capability' | null
  status: 'pending' | 'processing' | 'success' | 'error'
  error?: string
  data?: any[]
}

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const detectFileType = (headers: string[]): 'sentiment' | 'capability' | null => {
    const sentimentHeaders = ['sentiment_level', 'sentiment_reason']
    const capabilityHeaders = ['strategyVision_C1', 'data_C1', 'technology_C1']
    
    const hasSentimentHeaders = sentimentHeaders.some(h => 
      headers.some(header => header.toLowerCase().includes(h.toLowerCase()))
    )
    const hasCapabilityHeaders = capabilityHeaders.some(h => 
      headers.some(header => header.toLowerCase().includes(h.toLowerCase()))
    )
    
    if (hasSentimentHeaders) return 'sentiment'
    if (hasCapabilityHeaders) return 'capability'
    return null
  }

  const processFile = async (file: File): Promise<UploadedFile> => {
    return new Promise((resolve) => {
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: null,
        status: 'processing',
        data: []
      }

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const headers = results.meta.fields || []
          const fileType = detectFileType(headers)
          
          if (!fileType) {
            uploadedFile.status = 'error'
            uploadedFile.error = 'Unknown file format'
          } else {
            uploadedFile.type = fileType
            uploadedFile.status = 'success'
            uploadedFile.data = results.data
          }
          resolve(uploadedFile)
        },
        error: (error) => {
          uploadedFile.status = 'error'
          uploadedFile.error = error.message
          resolve(uploadedFile)
        }
      })
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true)
    const newFiles = await Promise.all(acceptedFiles.map(processFile))
    setFiles(prev => [...prev, ...newFiles])
    setIsProcessing(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: true
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const canProceed = files.some(f => f.status === 'success')

  const handleProceed = async () => {
    if (!canProceed) return
    
    const sessionData = {
      id: `session-${Date.now()}`,
      sentimentData: files
        .filter(f => f.type === 'sentiment' && f.status === 'success')
        .flatMap(f => f.data || []),
      capabilityData: files
        .filter(f => f.type === 'capability' && f.status === 'success')
        .flatMap(f => f.data || []),
      uploadedAt: new Date().toISOString()
    }
    
    sessionStorage.setItem('aiNavigatorSession', JSON.stringify(sessionData))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-white/5">
        <div className="container">
          <div className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-primary" />
              <span className="font-semibold">AI Navigator</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="heading-2 mb-4">Upload Your Data</h1>
            <p className="body-large">
              Import your assessment CSV files to begin analysis
            </p>
          </div>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`
              relative p-16 rounded-xl border-2 border-dashed transition-all cursor-pointer
              ${isDragActive 
                ? 'border-teal-500 bg-teal-500/5' 
                : 'border-white/20 hover:border-white/30 bg-white/[0.02]'}
            `}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: isDragActive ? 1.1 : 1,
                }}
                className="inline-flex p-4 rounded-full glass mb-6"
              >
                <Upload className="w-8 h-8 text-teal-400" />
              </motion.div>
              
              {isDragActive ? (
                <p className="text-xl mb-2">Drop your files here</p>
              ) : (
                <>
                  <p className="text-xl mb-2">
                    Drag & drop CSV files here
                  </p>
                  <p className="body-small">or click to browse</p>
                </>
              )}
            </div>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 space-y-3"
              >
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card variant="glass" size="sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-teal-400" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.type && (
                                <span className={`
                                  inline-flex px-2 py-0.5 rounded-full
                                  ${file.type === 'sentiment' 
                                    ? 'bg-purple-500/20 text-purple-400' 
                                    : 'bg-cyan-500/20 text-cyan-400'}
                                `}>
                                  {file.type}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {file.status === 'success' && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                          {file.status === 'error' && (
                            <span className="text-xs text-red-400">{file.error}</span>
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            {canProceed && (
              <Button
                size="lg"
                onClick={handleProceed}
                isLoading={isProcessing}
              >
                Proceed to Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
            
            <Link href="/demo">
              <Button variant="secondary" size="lg">
                Use Demo Data Instead
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12 text-center">
            <p className="body-small">
              Need help?{' '}
              <Link href="/demo" className="text-teal-400 hover:text-teal-300">
                Try the demo
              </Link>
              {' '}to explore the platform
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}