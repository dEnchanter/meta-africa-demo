import Image from 'next/image'
import React from 'react'

// Define a type for the component props
type PlayerCardProps = {
  logoSrc: string;
  name: string;
  position: string;
  team: string;
  statType: 'PTS' | 'AST' | 'RBD';
  statValue: string;
};

const TeamPlayerStat = ({ logoSrc, name, position, team, statType, statValue }: PlayerCardProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div>
        <Image
          src={logoSrc}
          alt="logo"
          width={55}
          height={55}
        />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="font-extralight text-sm">{position}</p>
        <p className="font-extralight text-sm">{team}</p>
      </div>
      <div className="text-2xl font-semibold">{`${statValue} ${statType}`}</div>
    </div>
  )
}

export default TeamPlayerStat