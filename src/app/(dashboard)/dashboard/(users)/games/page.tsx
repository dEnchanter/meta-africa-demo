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
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, PlayCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const recentMatches = [
  {
    "team1": "Atlanta Hawks",
    "team2": "Dallas Mavericks",
    "score_team1": 67,
    "score_team2": 38,
    "stadium": "san siro",
    "date": "18 December 2022"
  },
  {
    "team1": "Brooklyn Nets",
    "team2": "Boston Celtics",
    "score_team1": 67,
    "score_team2": 30,
    "stadium": "san siro",
    "date": "20 December 2022"
  },
  {
    "team1": "Cleveland Cavaliers",
    "team2": "Chicago Bulls",
    "score_team1": 51,
    "score_team2": 20,
    "stadium": "san siro",
    "date": "20 December 2022"
  },
  {
    "team1": "Denver Nuggets",
    "team2": "Golden State Warriors",
    "score_team1": 67,
    "score_team2": 30,
    "stadium": "san siro",
    "date": "20 December 2022"
  },
  {
    "team1": "Atlanta Hawks",
    "team2": "Dallas Mavericks",
    "score_team1": 67,
    "score_team2": 38,
    "stadium": "san siro",
    "date": "18 December 2022"
  },
  {
    "team1": "Brooklyn Nets",
    "team2": "Boston Celtics",
    "score_team1": 67,
    "score_team2": 30,
    "stadium": "san siro",
    "date": "20 December 2022"
  },
  {
    "team1": "Cleveland Cavaliers",
    "team2": "Chicago Bulls",
    "score_team1": 51,
    "score_team2": 20,
    "stadium": "san siro",
    "date": "20 December 2022"
  },
  {
    "team1": "Denver Nuggets",
    "team2": "Golden State Warriors",
    "score_team1": 67,
    "score_team2": 30,
    "stadium": "san siro",
    "date": "20 December 2022"
  }
]

const TournamentTable = () => {

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
                  placeholder="Search games"
                />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" className="rounded-full text-xs text-white hover:bg-transparent hover:text-zinc-200" size="sm">Recent Matches</Button>
              <Button className="rounded-full text-xs bg-orange-600 hover:bg-orange-500" size="sm">Upcoming Matches</Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <div className='text-white bg-[rgb(36,36,36)] p-3 rounded-lg space-y-8'>
          {recentMatches.map((match, index) => (
            <div key={index} className='flex items-center justify-between space-x-10 mb-4'>
              <div className='flex items-center space-x-5 grow'>
                <div className='flex items-center space-x-2'>
                  <Image
                    src="/meta-africa-logo.png"
                    alt='logo'
                    width={30}
                    height={30}
                  />
                  <p className='font-semibold'>{match.team1}</p>
                </div>
                <Badge variant="outline" className='px-2 bg-yellow-500/20 text-yellow-500 border-none font-bold'>
                  {match.score_team1} - {match.score_team2}
                </Badge>
                <div className='flex items-center space-x-2'>
                  <p className='font-semibold'>{match.team2}</p>
                  <Image
                    src="/meta-africa-logo.png"
                    alt='logo'
                    width={30}
                    height={30}
                  />
                </div>
              </div>

              <div className='text-sm font-semibold'>{match.date}</div>

              <div className='text-sm font-semibold'>{match.stadium}</div>

              <div>
                <Button className='flex items-center bg-yellow-600 hover:bg-yellow-500 rounded-full text-black'>
                  <p className='text-xs'>View Details</p>
                </Button>
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
      <h1 className="text-2xl text-white font-semibold p-2">MAS Tournament Basketball</h1>
      <TournamentTable />
    </div>
  )
}

export default Page