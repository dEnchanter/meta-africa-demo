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
import { ChevronDown, PlayCircleIcon, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import LeagueCard from "@/components/LeagueCard";
import RatingComponent from "@/components/RatingComponent";
import { useUser } from "@/hooks/auth";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import { calculateStarRating } from "@/helper/calculateStarRating";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MasFilter from "@/components/MasFilter";

interface FetchPlayersParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  currentPage?: number;
  // ... other parameters
}
interface Filter {
  key: string;
  value: string;
}

type ParamsType = {
  currentPage?: number;
  page?: number;
  limit?: number;
  [key: string]: any;  // This line allows for additional string keys
};

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
  const [filters, setFilters] = useState<Filter[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

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

  async function fetchPlayers(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchPlayersParams
  ) {

    // Provide a default value for pageIndex if it's undefined
    const currentPageIndex = currentPage ?? 0;

    let params: ParamsType = {
      page: currentPageIndex,
      limit: pageSize,
      ...rest
    }

    if (filters) {
      filters.forEach(filter => {
        if (filter.value) {
          params[filter.key] = filter.value;
        }
      });
    }

    try {
      const response = await axios.get(Endpoint.GET_ALL_PLAYERS, {
        params
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
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  // Update filters when search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      setFilters([{ key: 'name', value: searchTerm }]);
    } else {
      setFilters([]);
    }
  }, [searchTerm]);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

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

                <div className="flex items-center relative space-x-2">
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <SlidersHorizontal className="h-8 w-8 text-zinc-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Advanced Filter</p>
                          </TooltipContent>
                        </Tooltip>  
                      </TooltipProvider>
                    </PopoverTrigger>
                    <MasFilter 
                      filters={filters}
                      setFilters={setFilters}
                      closePopover={togglePopover}
                    />
                  </Popover>
                  <Input 
                    className="bg-transparent border-2 border-zinc-100/10 rounded-full text-white" 
                    placeholder="Search players"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute right-2 text-gray-500 cursor-pointer"
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