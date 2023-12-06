import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { Badge } from "@/components/ui/badge"
import { PlayCircleIcon } from 'lucide-react'

const upcomingMatches = [
  {
    "team1": "Atlanta Hawks",
    "team2": "Dallas Mavericks",
    "score_team1": 67,
    "score_team2": 38,
    "date": "18 December 2022"
  },
  {
    "team1": "Brooklyn Nets",
    "team2": "Boston Celtics",
    "score_team1": 67,
    "score_team2": 30,
    "date": "20 December 2022"
  },
  {
    "team1": "Cleveland Cavaliers",
    "team2": "Chicago Bulls",
    "score_team1": 51,
    "score_team2": 20,
    "date": "20 December 2022"
  },
  {
    "team1": "Denver Nuggets",
    "team2": "Golden State Warriors",
    "score_team1": 67,
    "score_team2": 30,
    "date": "20 December 2022"
  }
]

const UpcomingMatches = () => {
  return (
    <div className="space-y-2 text-white">
      {upcomingMatches.map((match, index) => (
        <div key={index} className="bg-[rgb(36,36,36)] p-3 rounded-lg grid grid-cols-[auto_auto_auto_auto_auto] gap-x-4 items-center">
          
          {/* Logo and Team 1 Name */}
          <div className="flex items-center space-x-2">
            <Image
              src="/meta-africa-logo.png"
              alt='logo'
              width={30}
              height={30}
            />
            <p className="font-semibold truncate">{match.team1}</p>
          </div>

          {/* Score */}
          <Badge variant="outline" className="px-2 bg-yellow-500/20 text-yellow-500 border-none font-bold self-center justify-self-center">
            VS
          </Badge>

          {/* Team 2 Name */}
          <div className="flex items-center space-x-2">
            <p className="font-semibold truncate">{match.team2}</p>
            <Image
              src="/meta-africa-logo.png"
              alt='logo'
              width={30}
              height={30}
            />
          </div>

          {/* Date */}
          <div className="text-sm font-semibold truncate">
            {match.date}
          </div>

          {/* Watch Video Button */}
          <Button className="bg-yellow-600 hover:bg-yellow-500 rounded-full text-black">
            <p className="text-xs">View Details</p>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default UpcomingMatches