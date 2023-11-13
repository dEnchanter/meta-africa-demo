import Banner2 from '@/components/Banner2'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ShopBanner from '@/components/ShopBanner'
import Sponsors from '@/components/Sponsors'
import React from 'react'

const page = () => {
  return (
    <div className="relative h-screen lg:h-[140vh]">
      <Header />

      <main className='relative'>
          <ShopBanner />
          <Sponsors />
          <Banner2 />
       
          <Footer />

      </main>

    </div>
  )
}

export default page