import Header from "@/components/header"
import Hero from "@/components/hero"
import VideoSection from "@/components/video-section"
import Stats from "@/components/stats"
import Features from "@/components/features"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"
import HomepageTour from "@/components/homepage-tour"

export default function Home() {
  return (
    <main 
      className="min-h-screen relative"
      style={{ 
        backgroundImage: "url('https://framerusercontent.com/images/8RXP9ras3Ou98vMlCD4tGy3nJDE.png?width=1280&height=831')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: "#F5E6D3"
      }}
    >
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
