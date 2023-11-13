import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"

const Mission = () => {
  return (
    <MaxWidthWrapper className="grid grid-cols-1 lg:grid-cols-2 p-2 mt-5">
      <div className="hidden lg:flex items-center justify-center">
        <Image
          src={'/aboutus_image.jpg'}
          alt="aboutus_image"
          width="400"
          height="400"
          quality={100}
          className='shadow-2xl rounded-full bg-blend-darken'
        />
      </div>
      <div className="max-w-xl">
        <h1 className="text-red-500 uppercase font-semibold text-xl mb-2 text-center lg:text-left">Our Mission</h1>
        <p className="text-md font-light mb-4">
          Our mission is clear: to bring you the best of African basketball. We meticulously assess and evaluate player performances across leagues, 
          tournaments and combines in each region of this vast continent.<br />
          What sets us apart is our commitment to accuracy, fairness and excellence. Our team comprises experienced scouts, analysts and basketball
          enthusiasts who understand the game inside out. We combine cutting edge technology with a deep love for the sport to meticulously
          assess and evaluate player performances.<br />
          We're not just a platform; we're a community of basketball aficionados united by our shared passion for the game. We take
          pride in being part of the journey that helps players fulfill their dreams and recruiters discover the next big sensation.
        </p>
      </div>
    </MaxWidthWrapper>
  )
}

export default Mission