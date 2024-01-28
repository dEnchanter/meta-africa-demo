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

const TeamPlayerStatRBD = ({ logoSrc, name, position, team, statValue }: PlayerCardProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="rounded-full overflow-hidden w-[100px] h-[100px] flex justify-center items-center">
        <Image 
          src={logoSrc}
          alt="player avatar"
          width={100}
          height={100}
          layout="fixed"
          quality={100}
          className="mt-10"
        />
      </div>
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="font-extralight text-sm">{position}</p>
        <p className="font-extralight text-sm">{team}</p>
      </div>
      <div className="text-xl font-semibold">{`${statValue} RBD`}</div>
    </div>
  )
}

export default TeamPlayerStatRBD