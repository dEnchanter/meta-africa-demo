"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/auth";
import { Endpoint } from "@/util/constants";
import axios from '@/util/axios'
import useSWR from "swr";
import toast from "react-hot-toast";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProgressCircle } from '@tremor/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { abbreviateBasketballPosition } from "@/helper/abbreviatePositionName";
import { useRouter } from "next/navigation";
import TeamPlayerStatPTS from "@/components/TeamPlayerStatPTS";
import TeamPlayerStatASST from "@/components/TeamPlayerStatASST";
import TeamPlayerStatRBD from "@/components/TeamPlayerStatRBD";
import TeamPlayerStatBlock from "@/components/TeamPlayerStatBlock";
import { Progress } from "@/components/ui/progress";
import { roundFigure } from "@/helper/roundFigure";

interface PageProps {
  params: {
    gameid: string
  }
}

interface MASTableProps {
  statData: any;
  playersData: any;
}

const columns: ColumnDef<PlayerStat>[] = [
  {
    accessorKey: 'player_name',
    header: 'Player Name',
    cell: (info) => (String(info.getValue())),
  },
  {
    accessorKey: 'minutes_played',
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
    accessorKey: 'points',
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

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const router = useRouter();

  const handleClick = (row: any) => {
    const playerId = row.original._id;
    router.push(`/dashboard/players/${playerId}`);
  }
 
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
                className="hover:bg-transparent border-gray-50/20 cursor-pointer"
                onClick={() => handleClick(row)}
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

const page = ({ params }: PageProps) => {

  const { gameid } = params;

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const {
    data: getGameData
  } = useSWR(
    user?.status == 'success' ? `${Endpoint.GAMES_STATS}/${gameid}` : null,
    fetchGameInfo
  );

  const calculateProgress = (homeValue: any, awayValue: any) => {
    const total = homeValue + awayValue;
    return {
      homeProgress: (homeValue / total) * 100,
      awayProgress: (awayValue / total) * 100,
    };
  };

  const assistProgress = calculateProgress(getGameData?.match_result?.team_comparison?.assist?.home, getGameData?.match_result?.team_comparison?.assist?.away);
  const fieldGoalProgress = calculateProgress(getGameData?.match_result?.team_comparison?.field_goal.home, getGameData?.match_result?.team_comparison?.field_goal.away);
  const freeThrowProgress = calculateProgress(getGameData?.match_result?.team_comparison?.free_throw.home, getGameData?.match_result?.team_comparison?.free_throw.away);
  const pointsProgress = calculateProgress(getGameData?.match_result?.team_comparison?.points.home, getGameData?.match_result?.team_comparison?.points.away);
  const reboundProgress = calculateProgress(getGameData?.match_result?.team_comparison?.rebound.home, getGameData?.match_result?.team_comparison?.rebound.away);
  const stealsProgress = calculateProgress(getGameData?.match_result?.team_comparison?.steals.home, getGameData?.match_result?.team_comparison?.steals.away);
  const threePointsProgress = calculateProgress(getGameData?.match_result?.team_comparison?.three_points.home, getGameData?.match_result?.team_comparison?.three_points.away);

  async function fetchGameInfo(url: any) {

    try {
      const response = await axios.get(url)
      const payload = response.data;
      if (payload && payload.status == "success") {
        return payload?.data;
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  // Conditional rendering based on matchResult
  if (getGameData?.match_result) {
    // Render a different page or layout
    return (
      <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide text-white">
        <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
          <CardHeader className="flex flex-col space-y-5">
            <div className='relative lg:flex w-full'>
              <AspectRatio ratio={30 / 9}>
                {
                  !getGameData ? (
                    <>
                      <Skeleton count={1} height={300} baseColor={"#bcbcbc"} />
                    </>
                  ) : (
                    <div className="">
                      <div className="absolute inset-0 z-0 w-full">
                        <Image 
                          src="/aboutus_image.jpg" 
                          layout="fill" 
                          objectFit="cover" 
                          quality={100}
                          alt="Background Image"
                        />
                      </div>

                      <div 
                        aria-hidden="true" 
                        className="pointer-events-none absolute inset-0 z-10 bg-black opacity-90"
                      />
                      
                      <div className="flex items-center absolute z-20 w-full justify-between mt-10">
                        <div className="flex flex-col items-center justify-center w-full h-full p-4">
                          <div className="rounded-full overflow-hidden w-[150px] h-[150px] flex justify-center items-center">
                            <Image 
                              src={getGameData?.match_result?.team_data?.home?.avatar || '/meta-africa-logo.png'}
                              alt="player avatar"
                              width={150}
                              height={150}
                              layout="fixed"
                              quality={100}
                              className="mt-[1.5rem]"
                            />
                          </div>
                          <p className="text-white font-semibold text-lg">
                            {getGameData?.match_result?.team_data?.home?.team_name}
                          </p>
                        </div>

                        <div className="text-white text-center min-w-max space-y-4">
                          <p className="font-semibold text-lg">Match Result</p>
                          <Badge variant="outline" className="text-lg px-2 bg-yellow-500/20 text-yellow-500 border-none font-bold self-center justify-self-center">
                            {getGameData?.match_result?.team_data?.home.score} - {getGameData?.match_result?.team_data?.away.score}
                          </Badge>
                        </div>

                        <div className="flex flex-col items-center justify-center w-full h-full p-4">
                          <div className="rounded-full overflow-hidden w-[150px] h-[150px] flex justify-center items-center">
                            <Image 
                              src={getGameData?.match_result?.team_data?.away?.avatar || '/meta-africa-logo.png'}
                              alt="player avatar"
                              width={150}
                              height={150}
                              layout="fixed"
                              quality={100}
                              className="mt-[1.5rem]"
                            />
                          </div>
                          <p className="text-white font-semibold text-lg">
                            {getGameData?.match_result?.team_data?.away?.team_name}
                          </p>
                        </div>

                      </div>
                    </div>
                  )
                }
              </AspectRatio>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5">
            <div className="text-white font-medium uppercase">Game Leaders</div>
            <div className="text-white flex justify-between items-center space-x-4">
              <TeamPlayerStatPTS
                logoSrc={getGameData?.match_result?.game_leaders?.most_point?.avatar || "/meta-africa-logo.png"} 
                name={getGameData?.match_result?.game_leaders?.most_point?.name} 
                position={getGameData?.match_result?.game_leaders?.most_point?.position} 
                team={getGameData?.match_result?.game_leaders?.most_point?.team_name} 
                statValue={getGameData?.match_result?.game_leaders?.most_point?.point ? getGameData?.match_result?.game_leaders?.most_point?.point : 0}
              />
              <TeamPlayerStatASST
                logoSrc={getGameData?.match_result?.game_leaders?.most_assist?.avatar || "/meta-africa-logo.png"} 
                name={getGameData?.match_result?.game_leaders?.most_assist?.name} 
                position={getGameData?.match_result?.game_leaders?.most_assist?.position} 
                team={getGameData?.match_result?.game_leaders?.most_assist?.team_name} 
                statValue={getGameData?.match_result?.game_leaders?.most_assist?.point ? getGameData?.match_result?.game_leaders?.most_assist?.point : 0} 
              />
              <TeamPlayerStatRBD
                logoSrc={getGameData?.match_result?.game_leaders?.most_rebounds?.avatar || "/meta-africa-logo.png"} 
                name={getGameData?.match_result?.game_leaders?.most_rebounds?.team_name} 
                position={getGameData?.match_result?.game_leaders?.most_rebounds?.position} 
                team={getGameData?.match_result?.game_leaders?.most_rebounds?.team_name} 
                statValue={getGameData?.match_result?.game_leaders?.most_rebounds?.point ? getGameData?.match_result?.game_leaders?.most_rebounds?.point : 0} 
              />
              {/* <TeamPlayerStatBlock
                logoSrc={getGameData?.match_result?.game_leaders?.most_block?.avatar || "/meta-africa-logo.png"} 
                name={getGameData?.match_result?.game_leaders?.most_block?.team_name} 
                position={getGameData?.match_result?.game_leaders?.most_block?.position} 
                team={getGameData?.match_result?.game_leaders?.most_block?.team_name} 
                statValue={getGameData?.match_result?.game_leaders?.most_block?.point ? getGameData?.match_result?.game_leaders?.most_rebounds?.point : 0} 
              /> */}
            </div>

            <div className="mt-5 space-y-5">
              <div className="text-white font-medium uppercase">Team Comparison</div>
              <div></div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={assistProgress.homeProgress} className="w-[40%] h-3 bg-[#FF2626]" />
                <label className="text-white font-light">AST</label>
                <Progress style={{ transform: 'rotate(180deg)' }} value={assistProgress.awayProgress} className="w-[40%] h-3 bg-[#F5C451]" />
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={fieldGoalProgress.homeProgress} className="w-[40%] h-3 bg-[#FF2626]" />
                <label className="text-white font-light">FG%</label>
                <Progress style={{ transform: 'rotate(180deg)' }} value={fieldGoalProgress.awayProgress} className="w-[40%] h-3 bg-[#F5C451]" />
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={freeThrowProgress.homeProgress} className="w-[40%] h-3 bg-[#FF2626]" />
                <label className="text-white font-light">FT%</label>
                <Progress style={{ transform: 'rotate(180deg)' }} value={freeThrowProgress.awayProgress} className="w-[40%] h-3 bg-[#F5C451]" />
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={pointsProgress.homeProgress} className="w-[40%] h-3 bg-[#FF2626]" />
                <label className="text-white font-light">PTS</label>
                <Progress style={{ transform: 'rotate(180deg)' }} value={pointsProgress.awayProgress} className="w-[40%] h-3 bg-[#F5C451]" />
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={reboundProgress.homeProgress} className="w-[40%] h-3 bg-[#FF2626]" />
                <label className="text-white font-light">REB</label>
                <Progress style={{ transform: 'rotate(180deg)' }} value={reboundProgress.awayProgress} className="w-[40%] h-3 bg-[#F5C451]" />
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={stealsProgress.homeProgress} className="w-[40%] h-3 bg-[#FF2626]" />
                <label className="text-white font-light">STL</label>
                <Progress style={{ transform: 'rotate(180deg)' }} value={stealsProgress.awayProgress} className="w-[40%] h-3 bg-[#F5C451]" />
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={threePointsProgress.homeProgress} className="w-[40%] h-3 bg-[#FF2626]" />
                <label className="text-white font-light">3P%</label>
                <Progress style={{ transform: 'rotate(180deg)' }} value={threePointsProgress.awayProgress} className="w-[40%] h-3 bg-[#F5C451]" />
              </div>
            </div>

            <MAS2Table 
              teamData={getGameData?.match_result?.box_score?.home || []} 
              teamData2={getGameData?.match_result?.box_score?.away || []}
              teamData3={getGameData?.match_result?.team_data}
              gameData={getGameData?.match_result?.media || []}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide text-white">
      <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
        <CardHeader className="flex flex-col space-y-5">
          <div className='relative lg:flex w-full'>
            <AspectRatio ratio={30 / 9}>
              {
                !getGameData ? (
                  <>
                    <Skeleton count={1} height={300} baseColor={"#bcbcbc"} />
                  </>
                ) : (
                  <div className="">
                    <div className="absolute inset-0 z-0 w-full">
                      <Image 
                        src="/aboutus_image.jpg" 
                        layout="fill" 
                        objectFit="cover" 
                        quality={100}
                        alt="Background Image"
                      />
                    </div>

                    <div 
                      aria-hidden="true" 
                      className="pointer-events-none absolute inset-0 z-10 bg-black opacity-90"
                    />
                    
                    <div className="flex items-center absolute z-20 w-full justify-between mt-10">
                      <div className="flex flex-col items-center justify-center w-full h-full p-4">
                        <div className="rounded-full overflow-hidden w-[150px] h-[150px] flex justify-center items-center">
                          <Image 
                            src={getGameData?.statistics?.team_data?.home?.avatar || '/meta-africa-logo.png'}
                            alt="player avatar"
                            width={150}
                            height={150}
                            layout="fixed"
                            quality={100}
                            className="mt-[1.5rem]"
                          />
                        </div>
                        <p className="text-white font-semibold text-lg">
                          {getGameData?.statistics?.team_data?.home?.team_name}
                        </p>
                      </div>

                      <div className="text-white text-center min-w-max space-y-4">
                        <p className="font-semibold">Match Details</p>
                        <p className="font-light">{getGameData?.statistics?.match_details?.date}</p>
                        <p className="font-medium text-lg">{getGameData?.statistics?.match_details?.time}</p>
                        <p className="font-semibold">VS</p>
                      </div>

                      <div className="flex flex-col items-center justify-center w-full h-full p-4">
                        <div className="rounded-full overflow-hidden w-[150px] h-[150px] flex justify-center items-center">
                          <Image 
                            src={getGameData?.statistics?.team_data?.away?.avatar || '/meta-africa-logo.png'}
                            alt="player avatar"
                            width={150}
                            height={150}
                            layout="fixed"
                            quality={100}
                            className="mt-[1.5rem]"
                          />
                        </div>
                        <p className="text-white font-semibold text-lg">
                          {getGameData?.statistics?.team_data?.away?.team_name}
                        </p>
                      </div>

                    </div>
                  </div>
                )
              }
            </AspectRatio>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-5">
          <MASTable 
            statData={getGameData?.statistics || []} 
            playersData={getGameData?.players || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}

const MASTable = ({ statData, playersData }: MASTableProps) => {

  const [activeButton, setActiveButton] = useState('statistics');

  const PlayersContent = (
    <CardContent className="flex flex-col space-y-5">
      <StatTable statData={statData || []} />
    </CardContent>
  );

  const StatsContent = (
    <CardContent className="flex flex-col space-y-5">
      <GamesTable playersData={playersData || []} />
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
                    className={`rounded-full text-xs ${activeButton === 'statistics' ? 'dashboard-button-gradient hover:bg-orange-600 text-white hover:text-white px-6 py-2' : 'text-white hover:bg-transparent hover:text-zinc-200 px-6 py-2'}`}
                    size="sm"
                    onClick={() => setActiveButton('statistics')} 
                  >
                      Statistics
                  </Button>
                  <Button 
                    className={`rounded-full text-xs ${activeButton === 'players' ? 'dashboard-button-gradient hover:bg-orange-600 text-white px-5 py-2' : 'text-white hover:bg-transparent hover:text-zinc-200 px-5 py-2'}`} 
                    size="sm"
                    onClick={() => setActiveButton('players')}
                  >
                    Players
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      {activeButton === 'statistics' ? PlayersContent : StatsContent}
    </Card>
  )
}

const MAS2Table = ({ teamData, teamData2, teamData3, gameData }: any) => {

  console.log("team", gameData)

  const [activeButton, setActiveButton] = useState('roster');

  const RosterContent = (
    <CardContent className="flex flex-col space-y-5">
      <DataTable columns={columns} data={teamData || []} />
    </CardContent>
  );

  const ScheduleContent = (
    <CardContent className="flex flex-col space-y-5">
      <DataTable columns={columns} data={teamData2 || []} />
    </CardContent>
  );

  return (
    <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem] max-w-[62rem]">
      <CardHeader>
        <p className="text-white font-medium uppercase mb-3">Box Score</p>
        <CardTitle className="">
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    className={`rounded-full text-xs ${activeButton === 'roster' ? 'dashboard-button-gradient hover:bg-orange-600 text-white hover:text-white px-6 py-2' : 'text-white hover:bg-transparent hover:text-zinc-200 px-6 py-2'}`}
                    size="sm"
                    onClick={() => setActiveButton('roster')} 
                  >
                    {teamData3?.home?.team_name}
                  </Button>
                  <Button 
                    className={`rounded-full text-xs ${activeButton === 'schedule' ? 'dashboard-button-gradient hover:bg-orange-600 text-white px-5 py-2' : 'text-white hover:bg-transparent hover:text-zinc-200 px-5 py-2'}`} 
                    size="sm"
                    onClick={() => setActiveButton('schedule')}
                  >
                    {teamData3?.away?.team_name}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      {activeButton === 'roster' ? RosterContent : ScheduleContent}

      <div className="flex flex-col items-center space-y-5 mt-10">
        {gameData?.pictures && gameData.pictures.length > 0 && (
          <CardTitle className="text-white font-medium text-sm uppercase mb-3">
            Game Highlight
          </CardTitle>
        )}

        <CardContent className="grid grid-cols-4 gap-4"> 
          {gameData?.pictures?.map((picture: any, index: any) => (
            <div key={index} className="">
              <Image 
                src={picture} 
                alt={`Game Picture ${index + 1}`} 
                width={200}
                height={200}
                quality={100}
              />
            </div>
          ))}
        </CardContent>
      </div>
    </Card>
  )
}

const GamesTable = ({ playersData }: any) => {

  return (
    <div className='text-white bg-[rgb(36,36,36)] p-3 rounded-lg grid grid-cols-2 gap-[5rem]'>
      <div className="grid grid-cols-2 gap-10">
        {playersData?.home?.map((player: any, index: any) => (
          <div key={player.name + player.jersey_number} className="flex items-center space-x-3">
            <div>
              <Image
                src="/meta-africa-logo.png"
                alt="country logo"
                height="20"
                width="20"
              />
            </div>
            <div className="rounded-full overflow-hidden w-[50px] h-[50px] flex justify-center items-center">
              <Image 
                src={player.avatar || '/meta-africa-logo.png'}
                alt="player avatar"
                width={100}
                height={100}
                layout="fixed"
                quality={100}
                className="mt-[1.5rem]"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">{player.name}</p>
              <p className="font-light text-xs">{player.team_name}</p>
            </div>
            <div>
              <p>{player.jersey_number}</p>
            </div>
          </div>
        ))
        }
      </div>
      <div className="grid grid-cols-2 gap-10">
        {playersData?.away?.map((player: any, index: any) => (
          <div key={player.name + player.jersey_number} className="flex items-center space-x-3">
            <div>
              <Image
                src="/meta-africa-logo.png"
                alt="country logo"
                height="20"
                width="20"
              />
            </div>
            <div className="rounded-full overflow-hidden w-[50px] h-[50px] flex justify-center items-center">
              <Image 
                src={player.avatar || '/meta-africa-logo.png'}
                alt="player avatar"
                width={100}
                height={100}
                layout="fixed"
                quality={100}
                className="mt-[1.5rem]"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">{player.name}</p>
              <p className="font-light text-xs">{player.team_name}</p>
            </div>
            <div>
              <p>{player.jersey_number}</p>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  )
}

const StatTable = ({ statData }: any) => {

  return (
    <div className="flex flex-col">
      <div className="flex items-center text-white">
        <div>
        
        </div>
        <div>
          
        </div>
      </div>
      <div>
        <div className="text-center text-white font-semibold mb-5">Recent Matches</div>
        <div className="flex justify-between">
          <div>
            {statData?.allHomePrevious?.map((game: any, index: any) => (
              <div key={index} className="text-white flex items-center space-x-5">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full overflow-hidden w-[50px] h-[50px] flex justify-center items-center">
                    <Image 
                      src={game.team.logo || '/meta-africa-logo.png'}
                      alt="player avatar"
                      width={100}
                      height={100}
                      layout="fixed"
                      quality={100}
                      className="mt-[.5rem]"
                    />
                  </div>
                  <span className="font-semibold">{game.team.name}</span>
                </div>
                <div className="font-medium text-xs">VS</div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{game.opponent.name}</span>
                  <div className="rounded-full overflow-hidden w-[50px] h-[50px] flex justify-center items-center">
                    <Image 
                      src={game.opponent.logo || '/meta-africa-logo.png'}
                      alt="player avatar"
                      width={100}
                      height={100}
                      layout="fixed"
                      quality={100}
                      className="mt-[.5rem]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {statData?.allAwayPrevious?.map((game: any, index: any) => (
              <div key={index} className="text-white flex items-center space-x-5">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full overflow-hidden w-[50px] h-[50px] flex justify-center items-center">
                    <Image 
                      src={game.team.logo || '/meta-africa-logo.png'}
                      alt="player avatar"
                      width={100}
                      height={100}
                      layout="fixed"
                      quality={100}
                      className="mt-[.5rem]"
                    />
                  </div>
                  <span className="font-semibold">{game.team.name}</span>
                </div>
                <div className="font-medium text-xs">VS</div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{game.opponent.name}</span>
                  <div className="rounded-full overflow-hidden w-[50px] h-[50px] flex justify-center items-center">
                    <Image 
                      src={game.opponent.logo || '/meta-africa-logo.png'}
                      alt="player avatar"
                      width={100}
                      height={100}
                      layout="fixed"
                      quality={100}
                      className="mt-[.5rem]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page