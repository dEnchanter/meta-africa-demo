import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { StarIcon } from "lucide-react"

const Testimonials = () => {
  return (
    <MaxWidthWrapper className="relative flex flex-col mt-10 p-10 h-[25rem]">
      <div className="absolute bottom-20 left-[50rem] z-10 w-full">
        <Image 
          src="/meta-africa-logo.png" 
          width={200}
          height={200}
          quality={100}
          alt="Background Image"
        />
      </div>

      {/* Black Overlay */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 z-10 bg-black opacity-95"
      />

      <div className="grid grid-cols-2 z-30 text-white justify-items-center items-center">
        <div>
          <Image 
            src={'/top-players/top-player3.png'}
            alt="player3"
            width={200}
            height={200}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <h1 className="text-2xl font-semibold tracking-wide uppercase">Testimonials</h1>
          <p className="text-md font-light italic">
            "Joining Meta africa was a game-changer for me. The platform allowed me to showcase my skills to recruiters and coaches across Africa.
            Thanks to Meta Africa, i landed a scolarship and am now living my dream of playing college basketball."
          </p>
          <div className="flex flex-col space-y-1">
            <p className="font-semibold uppercase">Sarah Johnson</p>
            <p className="font-light text-sm italic">Basketball Player</p>
            <div className="flex space-x-2">
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <StarIcon className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default Testimonials