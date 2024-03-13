'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import axios from '@/util/axios'
import useSWR from "swr";
import toast from 'react-hot-toast'
import { Endpoint } from "@/util/constants";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { abbreviateBasketballPosition } from "@/helper/abbreviatePositionName";
import { calculateStarRating } from "@/helper/calculateStarRating";
import RatingComponent from "./RatingComponent";
import Image from "next/image";

type PositionBadgeProps = {
  position: string;
};

const PositionBadge: React.FC<PositionBadgeProps> = ({ position }) => (
  <span className="border px-2 py-1 rounded text-sm">
    {abbreviateBasketballPosition(position)}
  </span>
);

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
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
    const id = row.original._id;
    router.push(`/dashboard/mas100/${id}`);
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
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const DashboardTopPlayers = () => {

  const router = useRouter();
  const { data: getAllPlayersData } = useSWR(Endpoint, fetcher);
  
  async function fetcher(Endpoint: any) {
 
    try {
      const response = await axios.get(Endpoint.MAS_100_PLAYERS)
      const payload = response.data;
      if (payload && payload.status == "success") {
        return payload.data
      }
    } catch (error) {
      console.error(error);
      // toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  const handleButtonClick = () => {
    router.push('/dashboard/mas100');
  }

  // const viewProfile = (id: any) => {
  //   const profilePath = `/dashboard/mas100/${id}`;
  //   router.push(profilePath);
  // }

  const columns: ColumnDef<Player>[] = [
    {
      id: 'sn',
      header: 'Rank',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Player Name",
      cell: (info) => (
        <div className="flex items-center">
          <Image
            src={info.row.original.avatar || '/meta-africa-logo.png'}
            alt='Avatar'
            width="30"
            height="30"
            objectFit="contain"
            quality={100}
            className="mr-2"
            style={{ borderRadius: '50%' }}
          />
          <div>
            <div>{String(info.getValue())}</div>
            <div className="text-sm text-zinc-400">{info.row.original.team_name}</div>
          </div>
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
      accessorKey: 'regional_rank',
      header: 'Rating',
      cell: (info) => {
        const scoutGrade = parseInt(info.row.original.scout_grade ?? "0");
  
        // Calculate the star rating
        const rating = calculateStarRating(scoutGrade);
  
        // Return the rating, perhaps wrapped in a visual component that displays stars
        return <RatingComponent rating={rating} />;
      },
    },
    // {
    //   id: 'viewProfile',
    //   header: 'Actions',
    //   cell: (info) => 
    //   <div
    //     className="text-yellow-500 text-sm cursor-pointer hover:text-yellow-600"
    //     onClick={() => viewProfile(info.row.original._id)}
    //   >
    //     View Profile
    //   </div>,
    // },
  ]

  return (
    <Card className="bg-[rgb(36,36,36)] border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-white text-md">Top Players</p>
          <Button className="bg-[#d63f3f] hover:bg-[#d63f3f]/80 rounded-full" size={'sm'} onClick={handleButtonClick}>View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <DataTable columns={columns} data={getAllPlayersData?.mas100 || []} />
      </CardContent>
    </Card>
  )
}

export default DashboardTopPlayers