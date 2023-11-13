import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Image from 'next/image'

const ShopBanner = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col lg:h-[95vh] lg:justify-center lg:items-center lg:pb-12 w-full">
        <div className="absolute top-0 left-0 -z-10 h-[95vh] w-full">
          <Image
            src={'/gallery/gallery_img3.jpg'}
            alt="basketball-banner"
            layout="fill"
            objectFit="cover"
            className=""
          />
        </div>

        {/* Black Overlay */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-0 z-10 bg-black/95 h-[95vh] opacity-95"
        />

        <div className="z-20 flex flex-col space-y-4">
          <h1 className="uppercase font-semibold text-3xl text-orange-600 text-center italic">...Coming Soon...</h1>
          {/* <p className="flex flex-col justify-center items-center space-y-1 uppercase font-semibold text-4xl text-white max-w-4xl tracking-wide text-justify">
            <span>We're Dedicated to revolutionizing the way </span>
            <span>you Discover Basketball Talent in Africa</span>
          </p> */}
        </div>

      </div>
    </MaxWidthWrapper>
  )
}

export default ShopBanner