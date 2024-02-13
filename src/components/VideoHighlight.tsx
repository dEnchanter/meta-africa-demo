import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { SocialIcon } from "react-social-icons"
import Link from "next/link"

const VideoHighlight = () => {
  return (
    <MaxWidthWrapper className="relative flex flex-col mt-10 p-10">
        {/* Background Image */}
      <div className="absolute inset-0 -z-30 w-full">
        <Image 
          src="/galleryBackground.jpg" 
          layout="fill" 
          objectFit="cover" 
          quality={100}
          alt="Background Image"
        />
      </div>


      {/* Black Overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 bg-black opacity-20"
      />

      <div className="flex flex-col justify-around items-center mb-5 z-20">
        <h1 className="text-white uppercase font-semibold text-2xl mb-2">Video Highlights</h1>
        <p className="max-w-md text-white text-sm mb-2">
          Catch up with our game highlights and also player highlights
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center lg:place-items-start gap-5">
        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center cursor-pointer z-40">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img1.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>
        
        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img2.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>

        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img3.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>

        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img4.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>

        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img5.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>

        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img6.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>

        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img1.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>

        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img4.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>

        <div className="relative w-[350px] h-[260px]">
          <div className="absolute inset-0 flex justify-center items-center">
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='red'
              bgColor='white'
              className="w-10 h-10"
            />
          </div>
          <Image 
            src={"/gallery/gallery_img2.jpg"}
            alt='gallery_images'
            width={350}
            height={300}
            className="object-cover" 
          />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default VideoHighlight