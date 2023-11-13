import ContactBanner from "@/components/ContactBanner"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import NewsLetter2 from "@/components/NewsLetter2"

const page = () => {
  return (
    <div className="relative h-screen lg:h-[140vh]">
      <Header />

      <main className='relative'>
          <ContactBanner />
          <NewsLetter2 />
          <Footer />

      </main>

    </div>
  )
}

export default page