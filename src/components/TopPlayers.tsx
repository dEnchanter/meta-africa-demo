import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { StarIcon } from "lucide-react"
import PlayerCard from "./PlayerCard"
import Button from "./ui/button"

const TopPlayers = () => {

  return (
    <MaxWidthWrapper className="relative flex flex-col mt-10 p-10">
        <div className="flex flex-col lg:flex-row justify-around items-center mb-5 z-10">
          <h1 className="text-orange-500 uppercase font-bold text-3xl mb-5">Our Top Players</h1>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-4 place-items-center lg:place-items-start gap-10">
          <PlayerCard 
            imageUrl="/top-players/top-player1.png"
            playerName="Cody Fischer"
            playerPosition="Position (PG)"
            playerDetails="6.3ht 198wt"
          />
          <PlayerCard 
            imageUrl="/top-players/top-player2.png"
            playerName="Cortney Henry"
            playerPosition="Position (PG)"
            playerDetails="6.3ht 198wt"
          />
          <PlayerCard 
            imageUrl="/top-players/top-player3.png"
            playerName="Cortney Henry"
            playerPosition="Position (PG)"
            playerDetails="6.3ht 198wt"
          />
          <PlayerCard 
            imageUrl="/top-players/top-player4.png"
            playerName="Theresa Webb"
            playerPosition="Position (PF)"
            playerDetails="6.3ht 198wt"
          />
          <PlayerCard 
            imageUrl="/top-players/top-player3.png"
            playerName="Theresa Webb"
            playerPosition="Position (PF)"
            playerDetails="6.3ht 198wt"
          />
          <PlayerCard 
            imageUrl="/top-players/top-player4.png"
            playerName="Theresa Webb"
            playerPosition="Position (PG)"
            playerDetails="6.3ht 198wt"
          />
          <PlayerCard 
            imageUrl="/top-players/top-player1.png"
            playerName="Theresa Webb"
            playerPosition="Position (PF)"
            playerDetails="6.3ht 198wt"
          />
          <PlayerCard 
            imageUrl="/top-players/top-player2.png"
            playerName="Theresa Webb"
            playerPosition="Position (PG)"
            playerDetails="6.3ht 198wt"
          />
        </div>

        <div className="flex flex-col lg:flex-row justify-around items-center mt-10 z-10">
          <Button variant={'ghost'} className="border border-orange-500 text-orange-500">VIEW DASHBOARD</Button>
        </div>
    </MaxWidthWrapper>
  )
}

export default TopPlayers