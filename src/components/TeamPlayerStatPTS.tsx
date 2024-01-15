import Image from 'next/image'
import React from 'react'

// Define a type for the component props
type PlayerCardProps = {
  logoSrc: string;
  name: string;
  position: string;
  team: string;
  statValue: string;
};

const TeamPlayerStatPTS = ({ logoSrc, name, position, team, statValue }: PlayerCardProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className='rounded-full h-55 w-55'>
        <Image
          src={logoSrc}
          alt="logo"
          width={55}
          height={55}
          className='rounded-full'
        />
      </div>
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="font-extralight text-sm">{position}</p>
        <p className="font-extralight text-sm">{team}</p>
      </div>
      <div className="text-xl font-semibold">{`${statValue} PTS`}</div>
    </div>
  )
}

export default TeamPlayerStatPTS