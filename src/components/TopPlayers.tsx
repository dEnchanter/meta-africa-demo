'use client'

import Image from "next/image"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { StarIcon } from "lucide-react"
import PlayerCard from "./PlayerCard"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Endpoint } from "@/util/constants"
import axios from '@/util/axios'
import toast from "react-hot-toast"

const TopPlayers = () => {

  const router = useRouter();

  const {
    data: getImages,
  } = useSWR(
    Endpoint.TOP_PLAYER_IMAGES,
    fetchTopPlayerImages,
  );

  console.log("get", getImages)

  async function fetchTopPlayerImages(url: any) {

    try {
      const response = await axios.get(url)
      const payload = response.data;
      if (payload && payload.status == "success") {
        return payload?.data.topPlayers;
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <MaxWidthWrapper className="relative flex flex-col mt-10 p-10">
        <div className="flex flex-col lg:flex-row justify-around items-center mb-5 z-10">
          <h1 className="uppercase font-bold text-center text-3xl mb-5">
            <span className="text-gradient2">
              Our Top Players
            </span>
          </h1>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-4 place-items-center lg:place-items-start gap-10">
            {getImages?.map((player: any, index: number) => (
              <PlayerCard 
                key={index}
                imageUrl={player.avatar}
                playerName={player.name}
                playerPosition={player.position}
                playerDetails={`${player.height}ht ${player.weight}wt`}
              />
            ))}
        </div>

        <div className="flex flex-col lg:flex-row justify-around items-center mt-10 z-10">
          <Button onClick={() => router.push('/signup')} variant={'ghost'} className="border border-[#E26F2E]">
            <span className="text-gradient2">VIEW DASHBOARD</span>
          </Button>
        </div>
    </MaxWidthWrapper>
  )
}

export default TopPlayers