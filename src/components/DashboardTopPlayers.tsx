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
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
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

type PositionBadgeProps = {
  position: string;
};

export const columns: ColumnDef<Player>[] = [
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
    accessorKey: 'regional_rank', // Just need one key to access the full row data
    header: 'Rating',
    cell: (info) => {
      // Extract the relevant ranks from the row data
      const regional_rank = parseInt(info.row.original.regional_rank ?? "0");
      const position_rank = parseInt(info.row.original.position_rank ?? "0");
      const country_rank = parseInt(info.row.original.country_rank ?? "0");
  
      // Calculate the star rating
      const rating = calculateStarRating({ regional_rank, position_rank, country_rank });
      // Return the rating, perhaps wrapped in a visual component that displays stars
      return <RatingComponent rating={rating} />;
    },
  },
  {
    id: 'viewProfile',
    header: 'Actions',
    cell: (info) => 
    <Link
      className="text-yellow-600 text-sm"
      href="#"
     //onClick={() => viewProfile(info.row.original)}
    >
      View Profile
    </Link>,
  },
]

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

const DashboardTopPlayers = () => {

  const { data: getAllPlayersData } = useSWR(Endpoint, fetcher);

  // const router = useRouter();
  
  async function fetcher(Endpoint: any) {
 
    try {
      const response = await axios.get(Endpoint.GET_ALL_PLAYERS)
      const payload = response.data;
      if (payload && payload.status == "success") {
        return payload.data
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  return (
    <Card className="bg-[rgb(36,36,36)] border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-white text-md">Top Players</p>
          <Button className="bg-[#d63f3f] rounded-full" size={'sm'}>View All</Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <DataTable columns={columns} data={getAllPlayersData?.players || []} />
      </CardContent>
    </Card>
  )
}

export default DashboardTopPlayers