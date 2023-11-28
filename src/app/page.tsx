import About from "@/components/About"
import Banner from "@/components/Banner"
import Banner2 from "@/components/Banner2"
import CoreFeatures from "@/components/CoreFeatures"
import Footer from "@/components/Footer"
import Gallery from "@/components/Gallery"
import Header from "@/components/Header"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import NewsLetter from "@/components/NewsLetter"
import Sponsors from "@/components/Sponsors"
import TopPlayers from "@/components/TopPlayers"
import VideoHighlight from "@/components/VideoHighlight"

const page = () => {
  return (
    <div className="relative h-screen lg:h-[140vh]">
      <Header />

      <main className='relative overflow-x-hidden'>
          <Banner />
          <Sponsors />
          <About />
          <CoreFeatures />
          <Gallery />
          <TopPlayers />
          <Banner2 />
          <VideoHighlight />
          <NewsLetter />
          <Footer />

      </main>
    </div>
  )
}

export default page