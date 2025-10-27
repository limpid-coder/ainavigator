export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#5380b3] to-[#a74f8b] animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#5380b3] to-[#a74f8b] blur-xl opacity-50 animate-pulse" />
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#5380b3] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#7a6ca8] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#a74f8b] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-white/60 text-sm font-semibold">Loading...</p>
        </div>
      </div>
    </div>
  )
}




