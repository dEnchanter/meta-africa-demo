'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import axios from '@/util/axios'
import useSWR from "swr";
import toast from 'react-hot-toast'
import { Endpoint } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator"
import Skeleton from "react-loading-skeleton";
import { roundFigure } from "@/helper/roundFigure";
import { useRouter } from "next/navigation";

const AssistCard = () => {

  const router = useRouter();

  const { data: getAllTopAssistsPlayer, isLoading } = useSWR(Endpoint.TOP_ASSISTS, fetcher);
  
  async function fetcher(url: any) {
 
    try {
      const response = await axios.get(url)
      const payload = response.data;
      if (payload && payload.status == "success") {
        return payload.data
      }
    } catch (error) {
      console.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  const handleButtonClick = () => {
    router.push('/dashboard/players');
  }

  return (
    <Card className="bg-[rgb(36,36,36)] border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-white text-md">Assists</p>
          <Button className="bg-[#d63f3f] hover:bg-[#d63f3f]/80 rounded-full" size={'sm'} onClick={handleButtonClick}>View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">

        {isLoading ? (
            <>
              <Skeleton count={2} height={40} baseColor={"#bcbcbc"} />
            </>
          ): (
            getAllTopAssistsPlayer?.slice(0,5).map((player: any, index: number, array: any[]) => (
              <div key={index} className="flex flex-col space-y-2">
                <div className="text-white flex items-center justify-between text-center">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full">
                      <Image
                        src={player?.avatar || '/meta-africa-logo.png'}
                        width={30}
                        height={30}
                        alt="meta-africa-logo"
                        className="cursor-pointer object-contain rounded-md"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="grow">{player?.name}</p>
                      <p className="text-sm text-zinc-400">{player?.team_name}</p>
                    </div>
                    </div>
                    <div>{roundFigure(player?.avg_assists)}</div>
                </div>
  
                {index !== array.length - 1 && <Separator className="bg-gray-50/20 w-full" />}
              </div>
            ))
          )
        } 
        
      </CardContent>
    </Card>
  )
}

export default AssistCard