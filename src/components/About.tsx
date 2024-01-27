import Image from "next/image"
import { Button } from "./ui/button"
import MaxWidthWrapper from "./MaxWidthWrapper"

const About = () => {
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
        <h1 className="text-[#FF2626] uppercase font-semibold text-xl mb-2 text-center lg:text-left">About us</h1>
        <h1 className="uppercase text-2xl font-semibold mb-2">We're Dedicated to revolutionizing the way
        you discover <span className="text-[#F4C118]">Basketball</span> talent in  
        <span className="text-[#FF2626]"> Africa. </span></h1>
        <p className="text-md font-light mb-4">
          Meta Africa is devoted to creating a platform and related programs aimed at bridging the information gap 
          between local talents across Africa and international sporting leagues. Through technologies, multimedia
          and sports events. Meta Africa Sports seeks to put the spotlight on promising talents across the continent.
          We are driven by a shared belief that sports have the power to bring people together and create positive
          change in our communities.<br />
          Our mission is clear: To bring you the best of African basketball. We meticulously assess and evaluate player
          performances across leagues, tournaments and combines in each region of this vast continent 
        </p>
        <Button className="uppercase text-gradient2 border border-[#E26F2E] bg-transparent">Read more</Button>
      </div>
    </MaxWidthWrapper>
  )
}

export default About