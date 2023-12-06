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
import RatingComponent from "@/components/RatingComponent";

const MASPlayers = [
  {
    "playerName": "Kwame N'Diaye",
    "team": "Lagos Lions",
    "country": "Nigeria",
    "height": "6'8",
    "weight": "210 lbs",
    "position": "PF",
    "wingspan": "7'2"
  },
  {
    "playerName": "Amare Bello",
    "team": "Cairo Pharaohs",
    "country": "Egypt",
    "height": "6'3",
    "weight": "190 lbs",
    "position": "SG",
    "wingspan": "6'7"
  },
  {
    "playerName": "Tendai Mutombo",
    "team": "Harare Hawks",
    "country": "Zimbabwe",
    "height": "6'10",
    "weight": "230 lbs",
    "position": "C",
    "wingspan": "7'5"
  },
  {
    "playerName": "Samuel Abiodun",
    "team": "Accra Aces",
    "country": "Ghana",
    "height": "6'6",
    "weight": "220 lbs",
    "position": "SF",
    "wingspan": "7'0"
  },
  {
    "playerName": "Aziz Keita",
    "team": "Dakar Royals",
    "country": "Senegal",
    "height": "6'1",
    "weight": "180 lbs",
    "position": "PG",
    "wingspan": "6'4"
  },
  {
    "playerName": "Elijah Mwamba",
    "team": "Nairobi Giants",
    "country": "Kenya",
    "height": "6'7",
    "weight": "215 lbs",
    "position": "PF",
    "wingspan": "7'1"
  },
  {
    "playerName": "Fiston Muyumba",
    "team": "Kinshasa Kings",
    "country": "DR Congo",
    "height": "7'0",
    "weight": "240 lbs",
    "position": "C",
    "wingspan": "7'6"
  },
  {
    "playerName": "Youssef Okafor",
    "team": "Casablanca Cats",
    "country": "Morocco",
    "height": "6'4",
    "weight": "200 lbs",
    "position": "SG",
    "wingspan": "6'8"
  },
  {
    "playerName": "Lucas Sithole",
    "team": "Johannesburg Jags",
    "country": "South Africa",
    "height": "6'5",
    "weight": "210 lbs",
    "position": "SF",
    "wingspan": "6'9"
  }
]

const MASTable = () => {

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
                  placeholder="Search MAS100"
                />
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col space-y-5">

        <div className="grid grid-cols-3 gap-x-4 gap-y-[4rem]">
          
          {
            MASPlayers.map((player, index) => (
              <Card key={index} className="bg-[rgb(44,44,44)] border-0">
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <div>
                      <Image
                        src="/meta-africa-logo.png"
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div>
                      <Button className="text-red-400 bg-zinc-300 rounded-full">View Profile</Button>
                    </div>
                  </div>

                  <div className="text-xl font-semibold text-zinc-200">{player.playerName}</div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Image
                          src="/meta-africa-logo.png"
                          alt="logo"
                          width={20}
                          height={20}
                        />
                        <h1 className="text-zinc-300 text-sm italic">{player.team}</h1>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Image
                          src="/meta-africa-logo.png"
                          alt="logo"
                          width={20}
                          height={20}
                        />
                        <h1 className="text-zinc-300 text-sm italic">{player.country}</h1>
                      </div>
                      <div><RatingComponent className="w-4 h-4" rating={4} /></div>
                    </div>
                  
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                    <p>{player.height}</p>
                    <p>Height</p>
                  </div>

                  <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                    <p>{player.weight}</p>
                    <p>Weight</p>
                  </div>

                  <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                    <p>{player.position}</p>
                    <p>Position</p>
                  </div>

                  <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                    <p>{player.wingspan}</p>
                    <p>Wingspan</p>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </div>

      </CardContent>

    </Card>
  )
}

const Page = () => {
  return (
    <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl text-white font-semibold p-2">MAS 100</h1>
      <MASTable />
    </div>
  )
}

export default Page