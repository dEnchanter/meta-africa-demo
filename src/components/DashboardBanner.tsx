import Image from 'next/image'
import React from 'react'

const DashboardBanner = () => {
  return (
    <div className="relative flex h-[15rem] bg-[linear-gradient(to_right,_#d63f3f_70%,_white_30%)] from-red-500 to-white rounded-xl p-2">
          <div className="my-auto p-2"><p className="text-white uppercase text-3xl tracking-wide font-semibold max-w-[20rem]">Scout Players Anywhere around the world</p></div>
            <div className="absolute right-[3rem] bottom-0 z-20">
              <Image
                src={"/overview1.png"}
                alt=""
                width={350}
                height={350}
              />
            </div>
            <div className="absolute right-[3rem] bottom-0 z-10">
              <Image
                src={"/overview2.png"}
                alt=""
                width={360}
                height={360}
              />
            </div>
          
        </div>
  )
}

export default DashboardBanner