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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useUser } from "@/hooks/auth";
import { useState } from "react";
import Pagination from "@/components/Pagination";
interface FetchLeagueParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  currentPage?: number;
  // ... other parameters
}

const LeagueTable = () => {

  const pageIndex = 0;
  const pageSize = 10;

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState([]);

  const {
    data: getAllLeaguesData,
    mutate: refetchLeagues
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters, currentPage] : null,
    () => fetchLeagues(Endpoint, { pageIndex, pageSize, filters, currentPage }),
  );

  async function fetchLeagues(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchLeagueParams
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
      const response = await axios.get(Endpoint.GET_LEAGUES, {
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
          leagues: payload.data.leagues,
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
        <CardContent className="flex flex-col space-y-5 items-center justify-center">
          <div className="grid grid-cols-4 items-center gap-x-4">
            {getAllLeaguesData?.leagues?.map((league: League, index: any) => (
              <div key={index} className='flex flex-col space-y-1 justify-center items-center'>
                <div className='place-self-center'>
                  <Image
                    src={league.avatar || '/meta-africa-logo.png'}
                    alt='logo'
                    className="rounded-full"
                    width={70}
                    height={70}
                    onError={(e) => {
                      // If there is an error loading the image, set the source to the fallback image
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite callback loop
                      target.src = '/meta-africa-logo.png';
                    }}
                  />
                </div>
                <div className='flex items-center space-x-2'>
                  <p className='text-white text-sm font-semibold'>{league.name}</p>
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
      <h1 className="text-2xl text-white font-semibold p-2">All Leagues</h1>
      <LeagueTable />
    </div>
  )
}

export default Page