'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileUp, 
  Check, 
  X, 
  AlertCircle, 
  ArrowRight,
  Database,
  Brain,
  Home,
  FileSpreadsheet,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Papa from 'papaparse'

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
  const [sessionId, setSessionId] = useState<string | null>(null)

  const detectFileType = (headers: string[]): 'sentiment' | 'capability' | null => {
    const sentimentHeaders = ['sentiment_level', 'sentiment_reason', 'region', 'department']
    const capabilityHeaders = ['strategyVision_C1', 'data_C1', 'technology_C1', 'open_feedback']
    
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
    return new Promise((resolve, reject) => {
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
          if (results.errors.length > 0) {
            uploadedFile.status = 'error'
            uploadedFile.error = results.errors[0].message
            resolve(uploadedFile)
            return
          }

          const headers = results.meta.fields || []
          const fileType = detectFileType(headers)
          
          if (!fileType) {
            uploadedFile.status = 'error'
            uploadedFile.error = 'Could not determine file type. Please ensure your CSV has the correct headers.'
            resolve(uploadedFile)
            return
          }

          uploadedFile.type = fileType
          uploadedFile.status = 'success'
          uploadedFile.data = results.data
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
    
    const newFiles = await Promise.all(
      acceptedFiles.map(file => processFile(file))
    )
    
    setFiles(prev => [...prev, ...newFiles])
    setIsProcessing(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: true
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const hasSentimentData = files.some(f => f.type === 'sentiment' && f.status === 'success')
  const hasCapabilityData = files.some(f => f.type === 'capability' && f.status === 'success')
  const canProceed = hasSentimentData || hasCapabilityData

  const handleProceed = async () => {
    if (!canProceed) return
    
    setIsProcessing(true)
    
    // In a real app, this would upload to Supabase
    // For now, we'll store in session storage and navigate
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
    
    // Store in session storage for demo
    sessionStorage.setItem('aiNavigatorSession', JSON.stringify(sessionData))
    
    // Navigate to dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-white">AI Navigator</span>
            </Link>
            <Link href="/">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Upload Your Data
            </span>
          </h1>
          <p className="text-center text-gray-400 mb-12">
            Upload your sentiment and capability assessment CSV files to begin analysis
          </p>

          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`glass rounded-xl p-12 border-2 border-dashed transition-all cursor-pointer ${
              isDragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: isDragActive ? 1.1 : 1,
                  rotate: isDragActive ? 180 : 0
                }}
                transition={{ duration: 0.3 }}
                className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4"
              >
                <FileUp className="w-12 h-12 text-blue-400" />
              </motion.div>
              
              {isDragActive ? (
                <p className="text-xl text-blue-400 font-semibold mb-2">
                  Drop your files here
                </p>
              ) : (
                <>
                  <p className="text-xl font-semibold mb-2">
                    Drag & drop CSV files here
                  </p>
                  <p className="text-gray-400 mb-4">or click to browse</p>
                </>
              )}
              
              <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
                <span className="px-3 py-1 rounded-full bg-white/5">Sentiment Data</span>
                <span className="px-3 py-1 rounded-full bg-white/5">Capability Data</span>
                <span className="px-3 py-1 rounded-full bg-white/5">.CSV format</span>
              </div>
            </div>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 space-y-4"
              >
                <h3 className="text-lg font-semibold">Uploaded Files</h3>
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          file.status === 'success' 
                            ? 'bg-green-500/20 text-green-400'
                            : file.status === 'error'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {file.status === 'processing' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <FileSpreadsheet className="w-5 h-5" />
                          )}
                        </div>
                        
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-400">
                            {file.type ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                file.type === 'sentiment' 
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-cyan-500/20 text-cyan-400'
                              }`}>
                                {file.type === 'sentiment' ? 'Sentiment' : 'Capability'} Data
                                {file.data && ` • ${file.data.length} rows`}
                              </span>
                            ) : (
                              <span className="text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {file.status === 'success' && (
                          <Check className="w-5 h-5 text-green-400" />
                        )}
                        {file.status === 'error' && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-sm text-red-400">{file.error}</span>
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Summary */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 grid md:grid-cols-2 gap-4"
            >
              <div className={`glass rounded-lg p-4 border ${
                hasSentimentData ? 'border-green-500/50' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    hasSentimentData ? 'bg-green-500/20' : 'bg-white/5'
                  }`}>
                    <Database className={`w-5 h-5 ${
                      hasSentimentData ? 'text-green-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">Sentiment Data</p>
                    <p className="text-sm text-gray-400">
                      {hasSentimentData ? 'Ready for analysis' : 'Not uploaded'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`glass rounded-lg p-4 border ${
                hasCapabilityData ? 'border-green-500/50' : 'border-white/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    hasCapabilityData ? 'bg-green-500/20' : 'bg-white/5'
                  }`}>
                    <Database className={`w-5 h-5 ${
                      hasCapabilityData ? 'text-green-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">Capability Data</p>
                    <p className="text-sm text-gray-400">
                      {hasCapabilityData ? 'Ready for analysis' : 'Not uploaded'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            {canProceed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProceed}
                disabled={isProcessing}
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Analysis
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            )}
            
            <Link href="/demo">
              <button className="px-8 py-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg font-semibold text-white hover:bg-white/10 transition-all duration-300">
                Use Demo Data Instead
              </button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              Need help? Check our{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                data format guide
              </a>
              {' '}or{' '}
              <Link href="/demo" className="text-blue-400 hover:text-blue-300 transition-colors">
                use demo data
              </Link>
              {' '}to explore the platform
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
