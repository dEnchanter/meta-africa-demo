import React from 'react';
import Image from 'next/image';
import { StarIcon } from "lucide-react"

function PlayerCard({
  imageUrl = "/top-players/top-player1.png",
  altText = "player_images",
  playerName = "Theresa Webb",
  playerDetails = "6.3ht 198wt",
  playerPosition = "Position (PG)",
  rating = 0.9999,
  starCount = 5
}) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={imageUrl}
        alt={altText}
        width={200}
        height={200}
      />
      <p className="uppercase font-medium">{playerName}</p>
      <p className="uppercase font-mono">{playerDetails}</p>
      <p className="text-sm font-medium">{playerPosition}</p>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-0.5">
          {Array.from({ length: starCount }).map((_, index) => (
            <StarIcon key={index} fill="#facc15" className="w-4 h-4 text-yellow-400" />
          ))}
        </div>
        <div>
          <p className="text-sm font-mono">{rating}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
