'use client';

import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";

const Banner2 = () => {

  const router = useRouter();

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

      {/* Black Overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 bg-black opacity-70"
      />

      <div className="flex flex-col justify-center items-center mb-5 z-10">
        <h1 className="text-white uppercase font-medium text-3xl mb-2">
          Explore <span className="text-[#FF2626]">Talented</span> Individual across <span className="text-[#E26F2E]">africa</span>
        </h1>
        <p className="max-w-3xl text-white text-sm mb-5">
          Join us in this exciting journey as we open the door to Africa's basketball treasure trove.
          Whether you're a seasoned recruiter or a passionate coach, our platform is your gateway to discovering
          evaluating and elevating players like never before.
        </p>
        <Button onClick={() => router.push('/signup')} className="bg-white hover:bg-gray-200">
          <span className="text-gradient2">GO TO DASHBOARD</span>
        </Button>
      </div>
    </MaxWidthWrapper>
  )
}

export default Banner2