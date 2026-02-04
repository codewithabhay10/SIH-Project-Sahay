import Link from 'next/link'
import VideoSection from './components/video-section'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">स</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-600">सहाय</h1>
              <p className="text-sm text-gray-500">Sahay Portal</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-orange-600">Sahay</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A unified portal for citizens, organizations, and administrators to manage funds, 
            track projects, and apply for welfare schemes securely.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-8 py-3 bg-orange-600 text-white rounded-lg text-lg font-semibold hover:bg-orange-700 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg text-lg font-semibold hover:bg-orange-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Fund Management</h4>
            <p className="text-gray-600">Track and manage government funds with complete transparency and accountability.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Project Tracking</h4>
            <p className="text-gray-600">Monitor project progress with real-time updates and milestone tracking.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Beneficiary Support</h4>
            <p className="text-gray-600">Direct support for beneficiaries with easy application and verification process.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 Sahay Portal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
