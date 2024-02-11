import About2 from "@/components/About2"
import AboutBanner from "@/components/AboutBanner"
import AboutFooter from "@/components/AboutFooter"
import Banner2 from "@/components/Banner2"
import CoreFeatures from "@/components/CoreFeatures"
import Footer from "@/components/Footer"
import Gallery from "@/components/Gallery"
import Header from "@/components/Header"
import Mission from "@/components/Mission"
import NewsLetter from "@/components/NewsLetter"
import Sponsors from "@/components/Sponsors"
import Testimonials from "@/components/Testimonials"
import VideoHighlight from "@/components/VideoHighlight"

const page = () => {
  return (
    <div className="relative h-screen lg:h-[140vh]">
      <Header />

      <main className='relative'>
          <AboutBanner />
          <Sponsors />
          <About2 />
          <Mission />
          <CoreFeatures />
          <AboutFooter />
          <Gallery />
          {/* <Testimonials /> */}
          <Banner2 />
          <VideoHighlight />
          <NewsLetter />
          <Footer />

      </main>

    </div>
  )
}

export default page