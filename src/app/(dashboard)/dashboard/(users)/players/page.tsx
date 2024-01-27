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
// import { Badge } from "@/components/ui/badge";
// import LeagueCard from "@/components/LeagueCard";
import RatingComponent from "@/components/RatingComponent";
import { useUser } from "@/hooks/auth";
import { useState } from "react";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { calculateStarRating } from "@/helper/calculateStarRating";

interface FetchPlayersParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  currentPage?: number;
  // ... other parameters
}

const PlayerTable = () => {

  const pageIndex = 1;
  const pageSize = 10;

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState([]);

  const router = useRouter();

  const handleViewProfileClick = (playerId: any) => {
    const profilePath = `/dashboard/players/${playerId}`;
    router.push(profilePath);
  };

  const {
    data: getAllPlayersData,
    // mutate: refetchPlayers
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters, currentPage] : null,
    () => fetchPlayers(Endpoint, { pageIndex, pageSize, filters, currentPage }),
  );

  console.log("get", getAllPlayersData)

  async function fetchPlayers(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchPlayersParams
  ) {

    let userFilter = filters?.reduce((acc: any, aFilter: any) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    // Provide a default value for pageIndex if it's undefined
    const currentPageIndex = currentPage ?? 0;
    const currentPageSize = pageSize ?? 3;

    try {
      const response = await axios.get(Endpoint.GET_ALL_PLAYERS, {
        params: {
          page: currentPageIndex,
          limit: currentPageSize || 10,
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        setCurrentPage(payload?.data?.currentPage)
        setTotalPages(payload?.data?.totalPages)

        return {
          data: payload.data,
          players: payload.data.players,
          currentPage: payload.data.currentPage,
          totalPages: payload.data.totalPages,
        };
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  return (
    <div className="mb-[10rem]">
      <Card className="bg-[rgb(36,36,36)] border-0 mb-[2rem]">
        <CardHeader>
          <CardTitle className="">
            <div className="flex flex-col space-y-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  {/* placeholder */}
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
              getAllPlayersData?.players?.map((player: Player, index: any) => {

              const scoutGrade = player?.scout_grade ? Number(player.scout_grade) : 0;
              const rating = calculateStarRating(scoutGrade);
              
              return (
                <Card key={index} className="bg-[rgb(44,44,44)] border-0">
                  <CardHeader className="">
                    <div className="flex items-center justify-between">
                      <div>
                        <Image
                          src={player.avatar || '/meta-africa-logo.png'}
                          alt='logo'
                          width={50}
                          height={50}
                          className="rounded-full"
                          onError={(e) => {
                            // If there is an error loading the image, set the source to the fallback image
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite callback loop
                            target.src = '/meta-africa-logo.png';
                          }}
                        />
                      </div>
                      <div>
                        <Button 
                          className="text-red-400 bg-zinc-300 hover:bg-zinc-200 rounded-full"
                          onClick={() => handleViewProfileClick(player._id)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>

                    <div className="text-xl font-semibold text-zinc-200">{player.name}</div>
                      <div className="flex items-center justify-between space-x-3">
                        <div className="flex items-center space-x-1">
                          <Image
                            src="/meta-africa-logo.png"
                            alt="logo"
                            width={20}
                            height={20}
                          />
                          <h1 className="text-zinc-300 text-sm italic flex-1">{player?.team_data?.name || 'Default Team Name'}</h1>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Image
                            src="/meta-africa-logo.png"
                            alt="logo"
                            width={20}
                            height={20}
                          />
                          <h1 className="text-zinc-300 text-sm italic truncate">{player.assigned_country}</h1>
                        </div>
                        <div>
                          <RatingComponent className="w-4 h-4" rating={rating} />
                        </div>
                      </div>
                    
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                      <p className="text-center">{player.height}</p>
                      <p>Height</p>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                      <p className="text-center">{player.weight}</p>
                      <p>Weight</p>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                      <p className="text-center">{player.position}</p>
                      <p>Position</p>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-gray-800 rounded-full p-2 w-[4rem] text-zinc-200 text-xs">
                      <p className="text-center">{player.wingspan}</p>
                      <p>Wingspan</p>
                    </div>
                  </CardContent>
                </Card>
              )})
            }
          </div>

        </CardContent>
      </Card>
      <div className=''>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl text-white font-semibold p-2">ALL PLAYERS</h1>
      <PlayerTable />
    </div>
  )
}

export default Page