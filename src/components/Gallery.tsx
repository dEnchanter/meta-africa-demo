import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react"

const Gallery = () => {
  return (
    <MaxWidthWrapper className="relative flex flex-col mt-10 p-10">
        {/* Background Image */}
      <div className="absolute inset-0 -z-30 w-full">
        <Image 
          src="/basketball_banner.jpg" 
          layout="fill" 
          objectFit="cover" 
          quality={100}
          alt="Background Image"
        />
      </div>
{/* 
      <div 
          aria-hidden="true" 
          className='pointer-events-none absolute inset-x-0 z-10 transform-gpu overflow-hidden blur-3xl'
        >
          <div 
            className='relative aspect-[1000/470] w-full 
            bg-gradient-to-br from-black/50 to-black/50 opacity-60'
          />
      </div> */}

      {/* Black Overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 bg-black opacity-40"
      />

      <div className="flex flex-col lg:flex-row justify-around items-center mb-5 z-20">
        <h1 className="text-white uppercase font-semibold text-3xl mb-2">Our Galleries</h1>
        <p className="max-w-md text-white text-xs">
          At Meta Africa we take the guesswork out of talent evaluation. Our precision ranking system
          is your compass to navigating the world of African basketball with confidence and clarity.
        </p>
        <div className="hidden lg:flex space-x-2">
          <ArrowLeftCircle className="text-white" />
          <ArrowRightCircle className="text-white" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center lg:place-items-start gap-2 z-10">
        <Image 
          src={"/gallery/gallery_img11.jpeg"}
          alt='gallery_images'
          width={400}
          height={400}
        />
        <Image 
          src={"/gallery/gallery_img22.jpeg"}
          alt='gallery_images'
          width={400}
          height={400}
        />
        <Image 
          src={"/gallery/gallery_img33.jpeg"}
          alt='gallery_images'
          width={400}
          height={400}
        />
        <Image 
          src={"/gallery/gallery_img44.jpeg"}
          alt='gallery_images'
          width={400}
          height={400}
        />
        <Image 
          src={"/gallery/gallery_img55.jpeg"}
          alt='gallery_images'
          width={400}
          height={400}
        />
        <Image 
          src={"/gallery/gallery_img66.jpeg"}
          alt='gallery_images'
          width={400}
          height={400}
        />
      </div>
    </MaxWidthWrapper>
  )
}

export default Gallery