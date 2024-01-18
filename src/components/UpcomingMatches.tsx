'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from './ui/button'
import axios from '@/util/axios'
import { Badge } from "@/components/ui/badge"
import { useUser } from '@/hooks/auth';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { Endpoint } from '@/util/constants';

interface FetchGameParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

const UpcomingMatches = () => {

  const pageIndex = 0;
  const pageSize = 10;

  const {
    user,
    // isValidating: userIsValidating,
    // error: fetchingUserError,
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

  const matches: MatchData[] = (getAllGamesData?.matches ?? []).filter((match: MatchData) => {
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
      }
    } catch (error) {
      console.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  return (
    <div className="space-y-2 text-white">
      {matches?.map((match, index) => (
        <div key={index} className="bg-[rgb(36,36,36)] p-3 rounded-lg grid grid-cols-[auto_auto_auto_auto_auto] gap-x-4 items-center">
          
          {/* Logo and Team 1 Name */}
          <div className="flex items-center space-x-2">
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
            <p className="font-medium truncate">{match?.team?.name}</p>
          </div>

          {/* Score */}
          <Badge variant="outline" className="px-2 bg-yellow-500/20 text-yellow-500 border-none font-bold self-center justify-self-center">
            VS
          </Badge>

          {/* Team 2 Name */}
          <div className="flex items-center space-x-2">
            <p className="font-medium truncate">{match?.opponent?.name}</p>
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

          {/* Date */}
          <div className="text-sm font-medium truncate">
            {match.date}
          </div>

          {/* Watch Video Button */}
          <Button className="bg-yellow-600 hover:bg-yellow-500 rounded-full text-black">
            <p className="text-xs">View Details</p>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default UpcomingMatches