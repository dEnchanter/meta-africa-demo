'use client'

import { useUser } from "@/hooks/auth";
import { Endpoint } from "@/util/constants";
import axios from '@/util/axios'
import toast from "react-hot-toast";
import useSWR from "swr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio"
import TeamPlayerStat from "@/components/TeamPlayerStat";
import { abbreviateBasketballPosition } from "@/helper/abbreviatePositionName";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import RatingComponent from "@/components/RatingComponent";
import { calculateStarRating } from "@/helper/calculateStarRating";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { calculateRank } from "@/helper/calculateRank";
import { roundFigure } from "@/helper/roundFigure";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SocialIcon } from "react-social-icons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PageProps {
  params: {
    playerid: string
  }
}

const columns: ColumnDef<PlayerStat>[] = [
  {
    id: 'sn',
    header: 'S/N',
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: 'minute_played',
    header: 'MIN',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'two_points_made',
    header: '2PM',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'two_points_attempted',
    header: '2PA',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'two_points',
    header: '2P%',
    cell: (info) => roundFigure(info.getValue())
  },
  {
    accessorKey: 'three_points_made',
    header: '3PM',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'three_points_attempted',
    header: '3PA',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'three_points',
    header: '3P%',
    cell: (info) => roundFigure(info.getValue())
  },
  {
    accessorKey: 'free_throw_made',
    header: 'FTM',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'free_throw_attempted',
    header: 'FTA',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'free_throw',
    header: 'FT%',
    cell: (info) => roundFigure(info.getValue())
  },
  {
    accessorKey: 'field_goal_made',
    header: 'FGM',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'field_goal_attempted',
    header: 'FGA',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'field_goal',
    header: 'FG%',
    cell: (info) => roundFigure(info.getValue())
  },
  {
    accessorKey: 'total_points_made',
    header: 'Points',
    cell: (info) => roundFigure(info.getValue())
  },
  {
    accessorKey: "offensive_rebounds", // Use one of the keys to ensure proper data mapping
    header: "Oreb",
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: "defensive_rebounds", // Use one of the keys to ensure proper data mapping
    header: "Dreb",
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'assists',
    header: 'Assists',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'blocks',
    header: 'Blocks',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'fouls',
    header: 'Fouls',
    cell: (info) => (String(info.getValue()))
  },
  {
    accessorKey: 'efficiency',
    header: '+/-',
    cell: (info) => (String(info.getValue()))
  },
]
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface FetchPlayersParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

type PlayerStatData = {
  result: PlayerStat;
  team: {
    name: string;
    avatar: string;
  };
  opponent: {
    name: string;
    avatar: string;
  };
};

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
 
  return (
    <div className="rounded-md text-white max-w-[63rem]">
      <Table className="hover:bg-transparent">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow 
              key={headerGroup.id}
              className="hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="bg-black/30">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-transparent border-gray-50/20 "
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {Array.isArray(data) && data.length === 0 ? "No record found" : "Loading..."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const Page = ({ params }: PageProps) => {

  const { playerid } = params

  // const [isBiographyDialogOpen, setIsBiographyDialogOpen] = useState(false);

  // const handleBiographyButtonClick = () => {
  //   setIsBiographyDialogOpen(true);
  // };

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const {
    data: getPlayerData,
    // mutate: refetchPlayer
  } = useSWR(
    user?.status == 'success' ? `${Endpoint.GET_PLAYER_INFO}/${playerid}` : null,
    fetchPlayerInfo
  );

  const {
    data: getPlayerStats,
    // mutate: refetchPlayerStats
  } = useSWR(
    user?.status == 'success' ? `${Endpoint.GET_PLAYER_STATS}/${playerid}` : null,
    fetchPlayerStat
  );

  const dataForTable = getPlayerStats?.map((item: PlayerStatData)  => item?.result) || [];
  const rating = calculateStarRating(getPlayerData?.player?.scout_grade)

  async function fetchPlayerInfo(url: any) {

    try {
      const response = await axios.get(url)
      const payload = response.data;
      if (payload && payload.status == "success") {

        return payload?.data
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  async function fetchPlayerStat(url: any) {

    try {
      const response = await axios.get(url)
      const payload = response.data;
      if (payload && payload.status == "success") {
        return payload?.data
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  return (
    <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide text-white">
      <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
        <CardHeader className="flex flex-col space-y-10">
          <div className="flex justify-between items-center text-white">
            <div className="rounded-full overflow-hidden w-[100px] h-[100px] flex justify-center items-center">
              <Image 
                src={getPlayerData?.player?.avatar || '/meta-africa-logo.png'}
                alt="player avatar"
                width={100}
                height={100}
                layout="fixed"
                quality={100}
                className="mt-5"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-3xl font-semibold text-orange-500">{getPlayerData?.player?.jersey_number}</p>
              <div className="flex items-center space-x-1">
                <p className="font-semibold">{getPlayerData?.player?.name}</p>
                <div>
                  <Image 
                    src={'/meta-africa-logo.png'}
                    alt="logo"
                    width={25}
                    height={25}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xl font-medium">Scout Grade</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-xl text-orange-500">{getPlayerData?.player?.scout_grade || 0}</p>
                <p className="text-orange-500">
                  <RatingComponent rating={rating} />
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xl font-medium">Rank</p>
              <p className="text-orange-500 text-xl">{calculateRank(getPlayerData?.player?.scout_grade)}</p>
            </div>

            <div>
              <Button 
                className="bg-orange-500 text-white hover:bg-orange-600" 
                // onClick={handleBiographyButtonClick}
              >
                Read Biography
              </Button>
            </div>
          </div> 

          <div className="flex justify-around items-center text-white bg-black/30 p-4">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xl font-semibold">{getPlayerData?.player?.position}</p>
              <p className="text-orange-500 font-medium">{getPlayerData?.team?.name}</p>
            </div>
            <Separator orientation="vertical" className="bg-zinc-200 h-10" />
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xl font-semibold">Height</p>
              <p className="text-orange-500 font-medium">{getPlayerData?.player?.height}</p>
            </div>
            <Separator orientation="vertical" className="bg-zinc-200 h-10" />
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xl font-semibold">Weight</p>
              <p className="text-orange-500 font-medium">{getPlayerData?.player?.weight} pounds</p>
            </div>
            <Separator orientation="vertical" className="bg-zinc-200 h-10" />
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xl font-semibold">Date of Birth</p>
              <p className="text-orange-500 font-medium">{getPlayerData?.player?.date_of_birth}</p>
            </div>
            <Separator orientation="vertical" className="bg-zinc-200 h-10" />
            <div className="flex flex-col items-center space-y-2">
              <p className="text-xl font-semibold">Country</p>
              <p className="text-orange-500 font-medium">{getPlayerData?.player?.assigned_country}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4 text-white">
            <p className="text-2xl font-medium text-white tracking-wide">Statistics</p>
            <div className="flex justify-between items-center">
              <div className="bg-black/30 rounded-full flex items-center justify-center w-[10rem] h-[10rem]">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-500">{roundFigure(getPlayerData?.player?.avg_total_points)}</p>
                  <p className="text-md font-medium">PTS</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-full flex items-center justify-center w-[10rem] h-[10rem]">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-500">{roundFigure(getPlayerData?.player?.avg_rebounds)}</p>
                  <p className="text-md font-medium">REB</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-full flex items-center justify-center w-[10rem] h-[10rem]">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-500">{roundFigure(getPlayerData?.player?.avg_assists)}</p>
                  <p className="text-md font-medium">AST</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-full flex items-center justify-center w-[10rem] h-[10rem]">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-500">{roundFigure(getPlayerData?.player?.avg_blocks)}</p>
                  <p className="text-md font-medium">BLK</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-full flex items-center justify-center w-[10rem] h-[10rem]">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-orange-500">{roundFigure(getPlayerData?.player?.total_games_played)}</p>
                  <p className="text-sm font-medium">GP</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-5">
          <DataTable columns={columns} data={dataForTable} />
        </CardContent>
        <CardFooter className="mt-5 flex flex-col space-y-5 p-3">
          {(getPlayerData?.pictures?.length || getPlayerData?.videos?.length) ? (
            <>
              <div className="">
                <p className="text-2xl font-medium text-white tracking-wide text-left">Galleries and Videos</p>
              </div>
              
              <div className="">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full max-w-sm"
                >
                  <CarouselContent>
                    {getPlayerData?.pictures?.map((picture: any, index: any) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <Card>
                            <Image 
                              src={picture} 
                              alt={`Picture ${index + 1}`} 
                              width={500}
                              height={500} 
                            />
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                    {getPlayerData?.videos?.map((video: any, index: any) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <div className="relative w-[200px] h-[10px]">
                                <div className="absolute inset-0 flex justify-center items-center">
                                  <SocialIcon
                                    url={video}
                                    fgColor='white'
                                    bgColor='red'
                                    className="w-5 h-5"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </>
          ) : null}
        </CardFooter>

        {/* {isBiographyDialogOpen && (
          <DialogDemo />
        )} */}
      </Card>
    </div>
  )
}

// function DialogDemo() {
//   return (
//     <div>
//       <Dialog>
//         <DialogContent className="sm:max-w-[425px]">
//           <div className="grid gap-4 py-4">
//             Hello
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
    
//   )
// }

export default Page