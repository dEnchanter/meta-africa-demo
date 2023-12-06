import Image from 'next/image'
import React from 'react'

interface LeagueCardProps {
  leagueName: string;
}

const LeagueCard = ({ leagueName }: LeagueCardProps) => {
  return (
    <div className='flex flex-col space-y-2 justify-center w-[8rem]'>
      <div className='place-self-center'>
        <Image
          src='/meta-africa-logo.png'
          alt="logo"
          width={70}
          height={70}
        />
      </div>
      <div className='flex items-center space-x-2 mx-auto'>
        <p className='text-white text-sm font-semibold'>{leagueName}</p>
        <div>
          <Image
            src='/meta-africa-logo.png'
            alt="logo"
            width={25}
            height={25}
          />
        </div>
      </div>
    </div>
  )
}

export default LeagueCard