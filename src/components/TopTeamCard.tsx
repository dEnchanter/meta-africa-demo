'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Skeleton from "react-loading-skeleton";
import axios from '@/util/axios'
import useSWR from "swr";
import toast from 'react-hot-toast'
import { Endpoint } from "@/util/constants";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation";

const TopTeamCard = () => {

  const router = useRouter();

  const teamLosses = 0

  const { data: getAllTopTeams, isLoading } = useSWR(Endpoint.TOP_TEAMS, fetcher);
  
  async function fetcher(url: any) {
 
    try {
      const response = await axios.get(url)
      const payload = response.data;
      if (payload && payload.status == "success") {
        return payload?.data
      }
    } catch (error) {
      console.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  const handleButtonClick = () => {
    router.push('/dashboard/teams');
  }

  const handleClick = (team: any) => {
    router.push(`/dashboard/teams/${team?._id}`);
  }

  return (
    <Card className="bg-[rgb(36,36,36)] border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-white text-md">Top Teams</p>
          <Button className="bg-[#d63f3f] hover:bg-[#d63f3f]/80 rounded-full" size={'sm'} onClick={handleButtonClick}>View All Teams</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
      
        {isLoading ? (
          <>
            <Skeleton count={2} height={40} baseColor={"#bcbcbc"} />
          </>
          ): (
            getAllTopTeams?.slice(0,5).map((team: any, index: number, array: any[]) => (
              <div key={index} className="flex flex-col space-y-2 cursor-pointer" onClick={() => handleClick(team)}>
                <div className="text-white flex items-center justify-between text-center">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full">
                      <Image
                        src={team.logo_url ? team.logo_url : '/meta-africa-logo.png'}
                        width={30}
                        height={30}
                        alt="meta-africa-logo"
                        objectFit="contain"
                        quality={100}
                        style={{ borderRadius: '20%' }}
                        className=""
                      />
                    </div>
                    <p className="font-medium">{team.name}</p>
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">W</span>
                      <span>
                        {team?.wins || '0'}
                      </span>
                    </div>
                    <div>
                      -
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">L</span>
                      <span>
                        {team?.losses || '0'}
                      </span>
                    </div>
                  </div>
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

export default TopTeamCard