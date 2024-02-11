import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { MessageCircleIcon, PhoneCallIcon } from "lucide-react"
import Link from "next/link"
import { SocialIcon } from 'react-social-icons'

const Footer = () => {
  return (
    <MaxWidthWrapper className="relative flex flex-col mt-10 p-10 h-[25rem]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full">
        <Image 
          src="/aboutus_image.jpg" 
          layout="fill" 
          objectFit="cover" 
          quality={100}
          alt="Background Image"
        />
      </div>

      {/* Black Overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 bg-black opacity-90"
      />

      {/* Content */}
      <div className="relative z-20 grid grid-cols-2 lg:grid-cols-3 text-white h-full gap-10">

        <div className="flex flex-col justify-around">
          <div>
            <Image
              src="/meta-africa-logo.png"
              width={50}
              height={50}
              alt="meta-africa-logo"
              className="cursor-pointer object-contain"
            />
          </div>
          <p className="font-extralight text-sm">
            Meta Africa Sports is devoted to creating a platform and related programs aimed at bridging the information
            gap between local talents across Africa and international sporting leagues. Through technologies, multimedia
            and sports events.
          </p>
          <div className="flex space-x-4">
            <SocialIcon 
              url="https://www.facebook.com/MetaAfricaSports?mibextid=LQQJ4d" 
              fgColor='gray'
              bgColor='transparent'
            />
            <SocialIcon
              url="https://www.instagram.com/metaafricasports?igsh=ZDE1MWVjZGVmZQ=="
              fgColor='gray'
              bgColor='transparent'
            />
            <SocialIcon
              url="https://youtube.com/@metaafricasports?si=yFt0dOhjUdWtxNE8"
              fgColor='gray'
              bgColor='transparent'
            />
            <SocialIcon 
              url="https://www.tiktok.com/@metaafricasports?_t=8jS264PuFsB&_r=1"
              fgColor='gray'
              bgColor='transparent'
            />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-10 uppercase my-10">
          <h2 className="text-lg text-yellow-500 font-semibold">Quick Links</h2>
          <p className="text-sm font-extralight hover:underline transition-all ease-in duration-100"><Link href={'#'}>Home</Link></p>
          <p className="text-sm font-extralight hover:underline transition-all ease-in duration-100"><Link href={'/about-us'}>About us</Link></p>
          <p className="text-sm font-extralight hover:underline transition-all ease-in duration-100"><Link href={'/contact-us'}>Contact us</Link></p>
        </div>

        <div className="hidden lg:flex flex-col my-10 justify-start items-start">
          <div>
            <h2 className="text-yellow-500 my-1">Email Address</h2>
            <div className="flex space-x-2">
              <MessageCircleIcon className="text-orange-400" />
              <p className="font-extralight">Moustapha.diaoune@metaafricasports.com</p>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default Footer
