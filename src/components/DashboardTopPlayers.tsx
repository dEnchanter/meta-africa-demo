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
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  const handleButtonClick = () => {
    router.push('/dashboard/mas100');
  }

  const viewProfile = (id: any) => {
    const profilePath = `/dashboard/mas100/${id}`;
    router.push(profilePath);
  }

  const columns: ColumnDef<Player>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Player Name",
      cell: (info) => (
        <div className="flex items-center">
          <img 
            src={info.row.original.avatar}
            alt="Avatar"
            onError={(e) => e.currentTarget.src = '/meta-africa-logo.png'}
            style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }}
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
    {
      id: 'viewProfile',
      header: 'Actions',
      cell: (info) => 
      <div
        className="text-yellow-500 text-sm cursor-pointer hover:text-yellow-600"
        onClick={() => viewProfile(info.row.original._id)}
      >
        View Profile
      </div>,
    },
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
        <DataTable columns={columns} data={getAllPlayersData || []} />
      </CardContent>
    </Card>
  )
}

export default DashboardTopPlayers