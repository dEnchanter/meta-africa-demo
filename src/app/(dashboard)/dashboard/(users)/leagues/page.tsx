'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from '@/util/axios'
import useSWR from "swr";
import toast from 'react-hot-toast'
import { Endpoint } from "@/util/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, PlayCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import LeagueCard from "@/components/LeagueCard";

const leagues = [
  {
    "leagueName": "League of Nigeria"
  },
  {
    "leagueName": "League of Egypt"
  },
  {
    "leagueName": "League of South Africa"
  },
  {
    "leagueName": "League of Kenya"
  },
  {
    "leagueName": "League of Morocco"
  },
  {
    "leagueName": "League of Ghana"
  },
  {
    "leagueName": "League of Algeria"
  },
  {
    "leagueName": "League of Tunisia"
  },
  {
    "leagueName": "League of Ethiopia"
  },
  {
    "leagueName": "League of Uganda"
  },
  {
    "leagueName": "League of Cameroon"
  },
  {
    "leagueName": "League of Senegal"
  },
  {
    "leagueName": "League of Mali"
  },
  {
    "leagueName": "League of Zimbabwe"
  },
  {
    "leagueName": "League of Angola"
  },
  {
    "leagueName": "League of Ivory Coast"
  }
]


const LeagueTable = () => {

  // const { data: getAllPlayersData } = useSWR(Endpoint, fetcher);

  // const router = useRouter();
  
  // async function fetcher(Endpoint: any) {
 
  //   try {
  //     const response = await axios.get(Endpoint.GET_ALL_PLAYERS)
  //     const payload = response.data;
  //     if (payload && payload.status == "success") {
  //       return payload.data
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong");

  //     // TODO Implement more specific error messages
  //     // throw new Error("Something went wrong");
  //   }
  // }

  return (
    <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
      <CardHeader>
        <CardTitle className="">
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-2 border-zinc-100/10 px-2 py-1 rounded-full text-white text-xs flex items-center">
                      <p className="text-zinc-100">Gender</p> 
                      <ChevronDown className="h-4 w-4 mt-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Male</DropdownMenuItem>
                      <DropdownMenuItem>Female</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-2 border-zinc-100/10 px-2 py-1 rounded-full text-white text-xs flex items-center">
                      <p className="text-zinc-100">Region</p> 
                      <ChevronDown className="h-4 w-4 mt-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>West Africa</DropdownMenuItem>
                      <DropdownMenuItem>South Africa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-2 border-zinc-100/10 px-2 py-1 rounded-full text-white text-xs flex items-center">
                      <p className="text-zinc-100">Country</p> 
                      <ChevronDown className="h-4 w-4 mt-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Mali</DropdownMenuItem>
                      <DropdownMenuItem>Nigeria</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="">
                <Input 
                  className="bg-transparent border-2 border-zinc-100/10 rounded-full text-white" 
                  placeholder="Search Leagues"
                />
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <div className="grid grid-cols-4 gap-x-4 gap-y-[4rem]">
          {leagues.map((league, index) => (
            <div key={index} className='flex flex-col space-y-1 justify-center items-center'>
              <div className='place-self-center'>
                <Image
                  src='/meta-africa-logo.png'
                  alt="logo"
                  width={70}
                  height={70}
                />
              </div>
              <div className='flex items-center space-x-2'>
                <p className='text-white text-sm font-semibold'>{league.leagueName}</p>
                <div>
                  <Image
                    src='/meta-africa-logo.png'
                    alt="logo"
                    width={25}
                    height={25}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const Page = () => {
  return (
    <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl text-white font-semibold p-2">All Leagues</h1>
      <LeagueTable />
    </div>
  )
}

export default Page