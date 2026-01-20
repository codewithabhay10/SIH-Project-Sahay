import Header from "@/components/header"
import Hero from "@/components/hero"
import VideoSection from "@/components/video-section"
import Stats from "@/components/stats"
import Features from "@/components/features"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"
import ReportsSection from "@/components/reports-section"
import RaiseIssueHome from "@/components/raise-issue-home"
import HomepageTour from "@/components/homepage-tour"

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F5E6D3" }}>
      <Header />
      <Hero />
      <VideoSection />
      <Stats />
      <Features />
      <FAQ />
      <Footer />
      <HomepageTour />
    </main>
  )
}
