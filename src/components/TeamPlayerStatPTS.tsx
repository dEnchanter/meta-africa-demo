import { roundFigure } from '@/helper/roundFigure';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

// Define a type for the component props
type PlayerCardProps = {
  id: string;
  logoSrc: string;
  name: string;
  position: string;
  team: string;
  statValue: string;
};

const TeamPlayerStatPTS = ({ id, logoSrc, name, position, team, statValue }: PlayerCardProps) => {

  const router = useRouter();

  return (
    <div onClick={() => router.push(`/dashboard/players/${id}`)} className="flex items-center space-x-2 cursor-pointer">
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
      <div className="text-xl font-semibold">{`${roundFigure(statValue)} PTS`}</div>
    </div>
  )
}

export default TeamPlayerStatPTS