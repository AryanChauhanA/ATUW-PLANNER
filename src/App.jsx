function App() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      
      {/* Ambient Light Orbs for the glass to refract */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] opacity-40"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-[120px] opacity-40"></div>

      {/* Premium 3D Glass Card */}
      <div className="relative z-10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 max-w-md w-full text-center border border-white/10">
        
        {/* Glossy Edge Highlight (Simulates 3D Light) */}
        <div className="absolute inset-0 rounded-3xl border-t border-l border-white/20 pointer-events-none"></div>
        
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-purple-200 mb-3 tracking-wide">
          Premium UI Active
        </h1>
        <p className="text-slate-300 font-light leading-relaxed">
          Zero performance cost. This is the power of layered CSS shadows and background blur.
        </p>
        
        <button className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-all duration-300 backdrop-blur-md">
          Initialize System
        </button>
      </div>

    </div>
  )
}

export default App