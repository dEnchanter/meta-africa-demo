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

interface FetchPlayersParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

const PositionBadge: React.FC<PositionBadgeProps> = ({ position }) => (
  <span className="border px-2 py-1 rounded text-sm">
    {abbreviateBasketballPosition(position)}
  </span>
);

const playersData = [
  {
    logoSrc: "/meta-africa-logo.png",
    name: "Amara Toure",
    position: "SG",
    team: "LIONS BASKET",
    statType: "AST",
    statValue: "8.4"
  },
  {
    logoSrc: "/meta-africa-logo.png",
    name: "Cheikh Diop",
    position: "SF",
    team: "DAKAR WARRIORS",
    statType: "RBD",
    statValue: "10.2"
  },
  {
    logoSrc: "/meta-africa-logo.png",
    name: "Seydou Njie",
    position: "C",
    team: "CAPITAL KINGS",
    statType: "PTS",
    statValue: "19.7"
  }
];

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
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const MASTable = () => {

  const pageIndex = 0;
  const pageSize = 10;

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const [pageCount, setPageCount] = useState("--");
  const [filters, setFilters] = useState([]);

  const {
    data: getAllPlayersData,
    mutate: refetchPlayers
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters] : null,
    () => fetchPlayers(Endpoint, { pageIndex, pageSize, filters }),
  );

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
    const currentPageIndex = pageIndex ?? 0;
    const currentPageSize = pageSize ?? 3;

    try {
      const response = await axios.get(Endpoint.GET_ALL_PLAYERS, {
        params: {
          page: currentPageIndex + 1,
          limit: currentPageSize || 10,
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        setPageCount(Math.ceil(payload.totalPages / currentPageSize).toString());

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
    <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
      <CardHeader>
        <CardTitle className="">
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" className="rounded-full text-xs text-white hover:bg-transparent hover:text-zinc-200" size="sm">Roster</Button>
                  <Button className="rounded-full text-xs bg-orange-600 hover:bg-orange-500" size="sm">Schedule</Button>
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
      <CardContent className="flex flex-col space-y-5">
        <DataTable columns={columns} data={getAllPlayersData?.players || []} />
      </CardContent>
    </Card>
  )
}

const Page = ({ params }: PageProps) => {
  const { teamid } = params

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const {
    data: getTeamData,
    mutate: refetchTeam
  } = useSWR(
    user?.status == 'success' ? Endpoint : null,
    () => fetchTeam(Endpoint),
  );

  async function fetchTeam(
    Endpoint: any,  
  ) {

    try {
      const response = await axios.get(`${Endpoint.GET_TEAM_BY_ROSTER}/${teamid}`)
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
          <div className="text-white flex space-x-1 items-center">
            <div>
              <Image
                src='/meta-africa-logo.png'
                alt="logo"
                width={25}
                height={25}
              />
            </div>
            <h1 className="text-2xl font-semibold">{getTeamData?.match?.team?.name}</h1>
          </div>
          <div className="text-white flex justify-between items-center">
            {playersData.map((player, index) => (
              <TeamPlayerStat
                key={index}
                logoSrc={player.logoSrc} 
                name={player.name} 
                position={player.position} 
                team={player.team} 
                statType={player.statType as 'PTS' | 'AST' | 'RBD'} 
                statValue={player.statValue} 
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col space-y-5">
          <MASTable />
        </CardContent>
      </Card>
    </div>
  )
}

export default Page