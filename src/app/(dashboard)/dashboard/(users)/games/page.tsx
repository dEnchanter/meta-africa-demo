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
import { useUser } from "@/hooks/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FetchGameParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

const Page = () => {
  const pageIndex = 0;
  const pageSize = 10;

  const {
    user,
    isValidating: userIsValidating,
    error: fetchingUserError,
  } = useUser({
    redirectTo: "/login",
  });

  const [pageCount, setPageCount] = useState("--");
  const [filters, setFilters] = useState([]);

  const {
    data: getAllGamesData,
    // mutate: refetchGames
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters] : null,
    () => fetchGames(Endpoint, { pageIndex, pageSize, filters }),
  );

  const recentMatches: MatchData[] = (getAllGamesData?.matches ?? []).filter((match: MatchData) => {
    // Check if the match has a finalResult field and quarterResult isn't an empty array
    return match.finalResult !== undefined && match.quarterResult.length > 0;
  });

  const upcomingMatches: MatchData[] = (getAllGamesData?.matches ?? []).filter((match: MatchData) => {
    // Exclude the match if it has a finalResult field
    return !match.finalResult;
  });

  async function fetchGames(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchGameParams
  ) {

    let userFilter = filters?.reduce((acc: any, aFilter: any) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    // Provide a default value for pageIndex if it's undefined
    const currentPageIndex = pageIndex ?? 0;
    const currentPageSize = pageSize ?? 3;

    try {
      const response = await axios.get(Endpoint.GET_ALL_GAMES, {
        params: {
          page: currentPageIndex + 1,
          limit: currentPageSize || 10,
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        // setPageCount(Math.ceil(payload.totalPages / currentPageSize).toString());

        return {
          data: payload.data,
          matches: payload.data.matches,
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

  return (
    <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl text-white font-semibold p-2">MAS Tournament Basketball</h1>
      <TournamentTable 
        recentMatches={recentMatches || []}
        upcomingMatches={upcomingMatches || []}
      />
    </div>
  )
}

const TournamentTable = ({ recentMatches, upcomingMatches}: any) => {

  const [activeButton, setActiveButton] = useState('recentMatches');

  const RecentMatchesContent = (
    <CardContent className="flex flex-col space-y-5">
      <GamesTable1 recentMatches={recentMatches|| []} />
    </CardContent>
  );

  const UpcomingMatchesContent = (
    <CardContent className="flex flex-col space-y-5">
      <GamesTable2 upcomingMatches={upcomingMatches || []} />
    </CardContent>
  );

  return (
    <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
      <CardHeader>
        <CardTitle className="">
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                {/* placeholder */}
              </div>

              <div className="">
                {/* <Input 
                  className="bg-transparent border-2 border-zinc-100/10 rounded-full text-white" 
                  placeholder="Search games"
                /> */}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                className={`rounded-full text-xs ${activeButton === 'recentMatches' ? 'dashboard-button-gradient hover:bg-orange-600 text-white hover:text-white' : 'text-white hover:bg-transparent hover:text-zinc-200'}`}
                size="sm"
                onClick={() => setActiveButton('recentMatches')} 
              >
                  Recent Matches
              </Button>
              <Button 
                className={`rounded-full text-xs ${activeButton === 'upcomingMatches' ? 'dashboard-button-gradient hover:bg-orange-600 text-white' : 'text-white hover:bg-transparent hover:text-zinc-200'}`} 
                size="sm"
                onClick={() => setActiveButton('upcomingMatches')}
              >
                Upcoming Matches
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      {activeButton === 'recentMatches' ? RecentMatchesContent : UpcomingMatchesContent}
    </Card>
  )
}

const GamesTable1 = ({ recentMatches}: { recentMatches: MatchData[] }) => {

  const router = useRouter();

  return (
    <CardContent className="flex flex-col space-y-5">
      <div className='text-white bg-[rgb(36,36,36)] p-3 rounded-lg space-y-8'>
        {recentMatches?.map((match: MatchData, index: number) => (
          <div key={index} className='flex items-center justify-between space-x-10 mb-4'>
            <div className='flex items-center space-x-5 grow'>
              <div className='flex items-center space-x-2'>
                <Image
                  src={match.team.logo || '/meta-africa-logo.png'}
                  alt='logo'
                  width={30}
                  height={30}
                  onError={(e) => {
                    // If there is an error loading the image, set the source to the fallback image
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite callback loop
                    target.src = '/meta-africa-logo.png';
                  }}
                />
                <p className='font-medium'>{match?.team?.name}</p>
              </div>
              <Badge variant="outline" className='px-2 bg-yellow-500/20 text-yellow-500 border-none font-bold'>
                {match?.finalResult?.team1Score} - {match?.finalResult?.team2Score}
              </Badge>
              <div className='flex items-center space-x-2'>
                <p className='font-medium'>{match?.opponent?.name}</p>
                <Image
                  src={match.opponent.logo || '/meta-africa-logo.png'}
                  alt='logo'
                  width={30}
                  height={30}
                  onError={(e) => {
                    // If there is an error loading the image, set the source to the fallback image
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite callback loop
                    target.src = '/meta-africa-logo.png';
                  }}
                />
              </div>
            </div>

            <div className='text-sm font-medium'>{match.date}</div>

            <div className='text-sm font-medium'>{match.time}</div>

            <div className='text-sm font-medium'>{match.stadium}</div>

            <div>
              <Button 
                className='flex items-center bg-yellow-600 hover:bg-yellow-500 rounded-full text-black'
                onClick={() => router.push(`/dashboard/games/${match?.game_id}`)}
              >
                <p className='text-xs'>View Details</p>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  )
}

const GamesTable2 = ({ upcomingMatches }: { upcomingMatches: MatchData[] }) => {

  const router = useRouter();
  
  return (
    <CardContent className="flex flex-col space-y-5">
      <div className='text-white bg-[rgb(36,36,36)] p-3 rounded-lg space-y-8'>
        {upcomingMatches?.map((match: MatchData, index: number) => (
          <div key={index} className='flex items-center justify-between space-x-10 mb-4'>
            <div className='flex items-center space-x-5 grow'>
              <div className='flex items-center space-x-2'>
                <Image
                  src={match.team.logo || '/meta-africa-logo.png'}
                  alt='logo'
                  width={30}
                  height={30}
                  onError={(e) => {
                    // If there is an error loading the image, set the source to the fallback image
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite callback loop
                    target.src = '/meta-africa-logo.png';
                  }}
                />
                <p className='font-medium'>{match?.team?.name}</p>
              </div>
              <Badge variant="outline" className="px-2 bg-yellow-500/20 text-yellow-500 border-none font-bold self-center justify-self-center">
                VS
              </Badge>
              <div className='flex items-center space-x-2'>
                <p className='font-medium'>{match?.opponent?.name}</p>
                <Image
                  src={match.opponent.logo || '/meta-africa-logo.png'}
                  alt='logo'
                  width={30}
                  height={30}
                  onError={(e) => {
                    // If there is an error loading the image, set the source to the fallback image
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite callback loop
                    target.src = '/meta-africa-logo.png';
                  }}
                />
              </div>
            </div>

            <div className='text-sm font-medium'>{match.date}</div>

            <div className='text-sm font-medium'>{match.time}</div>

            <div className='text-sm font-medium'>{match.stadium}</div>

            <div>
              <Button 
                className='flex items-center bg-yellow-600 hover:bg-yellow-500 rounded-full text-black'
                onClick={() => router.push(`/dashboard/games/${match?.game_id}`)}
              >
                <p className='text-xs'>View Details</p>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  )
}

export default Page