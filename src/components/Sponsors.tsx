import Image from "next/image"
import Link from "next/link"

const Sponsors = () => {
  return (
    <div className="flex flex-col bg-black w-full p-4 z-50">
      <div className="text-white uppercase text-xl mx-auto">Sponsored by top networks</div>
      <div className="flex flex-row items-center justify-around p-3">
        <Link href="https://thesinifoundation.org/">
          <Image 
            src={'/sponsors/sini_foundation.png'}
            alt="sponsors"
            width="100"
            height="100"
            className="hidden lg:inline-flex"
          />
        </Link>
        
        {/* <Image 
          src={'/sponsors/workation.png'}
          alt="sponsors"
          width="100"
          height="100"
          className="hidden lg:inline-flex"
        />
        <Image 
          src={'/sponsors/espn.jpg'}
          alt="sponsors"
          width="100"
          height="100"
        />
        <Image 
          src={'/sponsors/easportsfc.png'}
          alt="sponsors"
          width="100"
          height="100"
        />
        <Image 
          src={'/sponsors/easport.png'}
          alt="sponsors"
          width="100"
          height="100"
          className="hidden lg:inline-flex"
        />
        <Image 
          src={'/sponsors/nike.jpg'}
          alt="sponsors"
          width="100"
          height="100" 
        /> */}
      </div>
      
    </div>
  )
}

export default Sponsors