'use client'

import { useUser } from "@/hooks/auth";
import { Endpoint } from "@/util/constants";
import axios from '@/util/axios'
import toast from "react-hot-toast";
import useSWR from "swr";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
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
// import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
// import RatingComponent from "@/components/RatingComponent";
// import { calculateStarRating } from "@/helper/calculateStarRating";
// import Link from "next/link";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TeamPlayerStatPTS from "@/components/TeamPlayerStatPTS";
import TeamPlayerStatASST from "@/components/TeamPlayerStatASST";
import TeamPlayerStatRBD from "@/components/TeamPlayerStatRBD";

interface PageProps {
  params: {
    teamid: string
  }
}

type PositionBadgeProps = {
  position: string;
};

const columns: ColumnDef<Player>[] = [
  {
    id: 'sn',
    header: 'S/N',
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
    header: "Player Name",
    cell: (info) => (
      <div className="flex items-center">
        <img 
          src={info.row.original.avatar} // Use the avatar URL from the data
          alt="Avatar"
          onError={(e) => e.currentTarget.src = '/meta-africa-logo.png'}
          style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} // Adjust styling as needed
        />
        {String(info.getValue())}
      </div>
    ),
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: (info) => <PositionBadge position={info.getValue() as string} />,
  },
  {
    accessorKey: "height", // Use one of the keys to ensure proper data mapping
    header: "Ht/Wt",
    cell: (info) => {
      const height = info.row.original.height; // Access height from the row data
      const weight = info.row.original.weight; // Access weight from the row data
      return `${height} / ${weight}`; // Format: height / weight
    },
  },
  {
    accessorKey: "wingspan", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
    header: "Wing Span",
    cell: (info) => (
      <div className="flex items-center">
        {String(info.getValue())}
      </div>
    ),
  }
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface TeamData {
  players?: Player[];
}

interface MASTableProps {
  teamData: TeamData;
  teamGameData: GameData;
}

interface GameData {
  number_of_games: number;
  matches: Match[];
  currentPage: number;
  totalPages: number;
}

interface GamesTableProps {
  teamGameData: GameData;
}

const PositionBadge: React.FC<PositionBadgeProps> = ({ position }) => (
  <span className="border px-2 py-1 rounded text-sm">
    {abbreviateBasketballPosition(position)}
  </span>
);

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
    <div className="rounded-md text-white">
      <Table className="hover:bg-transparent">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow 
              key={headerGroup.id}
              className="hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
  const { teamid } = params

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const teamRosterKey = user?.status === 'success' ? `${Endpoint.GET_ROSTER_BY_TEAM}/${teamid}` : null;
  const teamGameScheduleKey = user?.status === 'success' ? `${Endpoint.GAME_SCHEDULE_PER_TEAM}/${teamid}` : null;

  const {
    data: getTeamData,
    // mutate: refetchTeam
  } = useSWR(teamRosterKey, fetchRosterByTeam);

  const {
    data: getTeamGameData,
    // mutate: refetchTeamGame
  } = useSWR(teamGameScheduleKey, fetchGameScheduleByTeam);

  const {
    data: getTeamStats,
    // mutate: refetchPlayerStats
  } = useSWR(
    user?.status == 'success' ? `${Endpoint.GET_TEAM}/${teamid}` : null,
    fetchTeamStat
  );

  // console.log("team", getTeamStats)

  async function fetchRosterByTeam(
    Endpoint: any,  
  ) {

    // Ensure that the teamRosterKey is not null before making the request
    if (!teamRosterKey) {
      toast.error("Team roster key is not available.");
      return;  // Exit the function early if the key is not valid
    }

    try {
      const response = await axios.get(teamRosterKey)
      const payload = response.data;
      if (payload && payload.status == "success") {

        return payload?.data
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  async function fetchGameScheduleByTeam(
    Endpoint: any,  
  ) {

    // Ensure that the teamRosterKey is not null before making the request
    if (!teamGameScheduleKey) {
      toast.error("Team roster key is not available.");
      return;  // Exit the function early if the key is not valid
    }

    try {
      const response = await axios.get(teamGameScheduleKey)
      const payload = response.data;
      if (payload && payload.status == "success") {

        return payload?.data
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  async function fetchTeamStat(url: any) {

    try {
      const response = await axios.get(url)
      const payload = response.data;
      if (payload && payload.status == "suceess") {
        return payload?.data
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
        <CardHeader className="flex flex-col space-y-5">
          <div className='hidden lg:flex w-full'>
            <AspectRatio ratio={30 / 9}>
                <Image 
                   // src={getTeamData?.match?.team?.logo_url || '/basketball-login.jpg'}
                   src={'/basketball_banner.jpg'}
                   alt='logo image'
                   layout="fill"
                   objectFit="cover"
                   className="z-50" 
                />
            </AspectRatio>
          </div>
          <div className="text-white flex space-x-[0.15rem] items-center">
            <div>
              <Image
                src={getTeamStats?.logo_url || '/meta-africa-logo.png'}
                alt='logo'
                width={40}
                height={40}
                className="rounded-full"
                onError={(e) => {
                  // If there is an error loading the image, set the source to the fallback image
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite callback loop
                  target.src = '/meta-africa-logo.png';
                }}
              />
            </div>
            <h1 className="text-xl font-semibold uppercase">{getTeamStats?.name}</h1>
          </div>
          <div className="text-white flex justify-between items-center">
            <TeamPlayerStatPTS
              logoSrc={getTeamStats?.top_points.avatar} 
              name={getTeamStats?.top_points.name} 
              position={getTeamStats?.top_points.position} 
              team={getTeamStats?.name} 
              statValue={getTeamStats?.top_points.point} 
            />
            <TeamPlayerStatASST
              logoSrc={getTeamStats?.top_assist.avatar} 
              name={getTeamStats?.top_assist.name} 
              position={getTeamStats?.top_assist.position} 
              team={getTeamStats?.name} 
              statValue={getTeamStats?.top_assist.point} 
            />
            <TeamPlayerStatRBD
              logoSrc={getTeamStats?.top_rebounds.avatar} 
              name={getTeamStats?.top_rebounds.name} 
              position={getTeamStats?.top_rebounds.position} 
              team={getTeamStats?.name} 
              statValue={getTeamStats?.top_rebounds.point} 
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-5">
          <MASTable 
            teamData={getTeamData || []} 
            teamGameData={getTeamGameData || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}

const MASTable = ({ teamData, teamGameData }: MASTableProps) => {

  const [activeButton, setActiveButton] = useState('roster');

  const RosterContent = (
    <CardContent className="flex flex-col space-y-5">
      <DataTable columns={columns} data={teamData?.players || []} />
    </CardContent>
  );

  const ScheduleContent = (
    <CardContent className="flex flex-col space-y-5">
      <GamesTable teamGameData={teamGameData || []} />
    </CardContent>
  );

  return (
    <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
      <CardHeader>
        <CardTitle className="">
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    className={`rounded-full text-xs ${activeButton === 'roster' ? 'bg-orange-600 hover:bg-orange-600 text-white hover:text-white' : 'text-white hover:bg-transparent hover:text-zinc-200'}`}
                    size="sm"
                    onClick={() => setActiveButton('roster')} 
                  >
                      Roster
                  </Button>
                  <Button 
                    className={`rounded-full text-xs ${activeButton === 'schedule' ? 'bg-orange-600 hover:bg-orange-600 text-white' : 'text-white hover:bg-transparent hover:text-zinc-200'}`} 
                    size="sm"
                    onClick={() => setActiveButton('schedule')}
                  >
                    Schedule
                  </Button>
                </div>
              </div>

              <div className="">
                <Input 
                  className="bg-transparent border-2 border-zinc-100/10 rounded-full text-white" 
                  placeholder="Search players"
                />
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      {activeButton === 'roster' ? RosterContent : ScheduleContent}
    </Card>
  )
}

const GamesTable = ({ teamGameData }: GamesTableProps) => {

  return (
    <div className='text-white bg-[rgb(36,36,36)] p-3 rounded-lg space-y-8'>
      {teamGameData && teamGameData?.matches?.map((match, index) => (
        <div key={index} className='flex items-center justify-between space-x-10 mb-4'>
          <div className='flex items-center space-x-5'>
            <div className='flex items-center space-x-2'>
              <Image
                src="/meta-africa-logo.png"
                // src={`${match.team.logo}`}
                alt='logo'
                width={30}
                height={30}
              />
              <p className='font-medium'>{match.team.name}</p>
            </div>
            <Badge variant="outline" className='px-2 bg-yellow-500/20 text-yellow-500 border-none font-bold'>
              VS
            </Badge>
            <div className='flex items-center space-x-2'>
              <p className='font-medium'>{match.opponent.name}</p>
              <Image
                src="/meta-africa-logo.png"
                // src={`${match.team.logo}`}
                alt='logo'
                width={30}
                height={30}
              />
            </div>
          </div>

          <div className='text-sm font-medium'>{match.date}</div>

          <div className='text-sm font-medium'>{match.time}</div>

          <div className='text-sm font-medium'>{match.stadium}</div>

        </div>
      ))}
    </div>
  )
}

export default Page