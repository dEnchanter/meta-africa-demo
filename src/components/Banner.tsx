import Image from "next/image"
// import { Button } from "./ui/button"
import { PlayCircle } from "lucide-react"
import MaxWidthWrapper from "./MaxWidthWrapper"
import Link from "next/link"

const Banner = () => {
  
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col space-y-2 py-[8rem] lg:py-16 md:space-y-4 h-[80vh] lg:h-[95vh] lg:justify-center lg:pb-12 w-full">
        <div className="absolute top-0 left-0 -z-10 h-[80vh] lg:h-[100vh] w-full">
          <Image
            src={'/basketball_banner.jpg'}
            alt="basketball-banner"
            layout="fill"
            objectFit="cover"
            className=""
          />
        </div>

        <div 
          aria-hidden="true" 
          className='pointer-events-none absolute inset-x-0 
          -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-60'
        >
          <div 
            className='relative aspect-[1155/700] w-full
            bg-gradient-to-br from-black to-gray-800 opacity-60'
          />
        </div>

        <div className="hidden lg:inline-flex z-10 absolute lg:right-0 lg:top-[3.5rem]">
          <Image
            src={'/overview4.png'}
            alt="Basketball players"
            width="650"
            height="650"
          />
        </div>

        <div className="hidden absolute -z-10 lg:flex flex-1 h-[95vh] space-x-2 right-[12rem] -top-5">
          <div className="bg-orange-500 w-20 h-full -skew-x-12"></div>
          <div className="bg-yellow-500 w-20 h-full -skew-x-12"></div>
        </div>

        <h1 className="uppercase text-white text-3xl font-bold">
          Exploring the courts of <span className="text-[#FF2626]">africa</span><br /> for the <span className="text-[#F4C118]">brightest stars</span>
        </h1>
        
        <p className="max-w-sm text-white font-normal text-sm md:text-sm">
          Join us in this exciting journey as we open the door to Africa's basketball
          treasure love. Whether you're a seasoned recruiter or a passionate
          coach, our platform is your gateway to discovering, evaluating and
          elevating players like never before.
        </p>

        <div className="uppercase flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Link href="/signup" className="bannerButton dashboard-button-gradient flex justify-center items-center">Go to Dashboard</Link>
          <Link href={"https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"} className="bannerButton bg-transparent border text-white flex justify-center items-center">Watch Videos <PlayCircle className="h-5 w-5 ml-2" /></Link>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default Banner