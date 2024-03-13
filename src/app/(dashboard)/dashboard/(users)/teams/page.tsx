'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from '@/util/axios'
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
import useSWR from "swr";
import toast from 'react-hot-toast'
import { Endpoint } from "@/util/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useUser } from "@/hooks/auth";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface Filter {
  key: string;
  value: string;
}

type ParamsType = {
  currentPage?: number;
  page?: number;
  limit?: number;
  [key: string]: any;  // This line allows for additional string keys
};

interface FetchTeamParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  currentPage?: number;
  // ... other parameters
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
    const id = row.original._id;
    router.push(`/dashboard/teams/${id}`);
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

const TeamTable = () => {

  const pageIndex = 1;
  const pageSize = 10;

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const {
    data: getAllTeamsData,
    mutate: refetchTeams
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters, currentPage] : null,
    () => fetchTeams(Endpoint, { pageIndex, pageSize, filters, currentPage }),
  );

  async function fetchTeams(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchTeamParams
  ) {

    // Provide a default value for pageIndex if it's undefined
    const currentPageIndex = currentPage ?? 0;

    let params: ParamsType = {
      page: currentPageIndex,
      limit: pageSize,
      ...rest
    }

    if (filters) {
      filters.forEach(filter => {
        if (filter.value) {
          params[filter.key] = filter.value;
        }
      });
    }

    try {
      const response = await axios.get(Endpoint.GET_ALL_TEAM, {
        params
      })
      const payload = response.data;
      if (payload && payload.status == "suceess") {

        setCurrentPage(payload?.data?.currentPage)
        setTotalPages(payload?.data?.totalPages)

        return {
          data: payload.data,
          teams: payload.data.teams,
          currentPage: payload.data.currentPage,
          totalPages: payload.data.totalPages,
        };
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

   // Update filters when search term changes
   useEffect(() => {
    if (searchTerm !== '') {
      setFilters([{ key: 'name', value: searchTerm }]);
    } else {
      setFilters([]);
    }
  }, [searchTerm]);

  const columns: ColumnDef<Team>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => (currentPage - 1) * pageSize + info.row.index + 1,
    },
    {
      accessorKey: "name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Team Name",
      cell: (info) => (
        <div className="flex items-center">
          <img 
            src={info.row.original.logo_url} // Use the avatar URL from the data
            alt="Avatar"
            onError={(e) => e.currentTarget.src = '/meta-africa-logo.png'}
            style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} // Adjust styling as needed
          />
          {String(info.getValue())}
        </div>
      ),
    },
    {
      accessorKey: "city", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "City",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "home_stadium", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Stadium",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "founded_year", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Year Founded",
      cell: (info) => (String(info.getValue())),
    },
    {
      id: 'viewProfile',
      header: 'Actions',
      cell: (info) => 
      <Link
        className="text-yellow-600 text-sm"
        href={`/dashboard/teams/${info.row.original._id}`}
      >
        View Details
      </Link>,
    },
  ]

  return (
    <div className="mb-[10rem]">
      <Card className="bg-[rgb(36,36,36)] border-0 mb-[3rem]">
        <CardHeader>
          <CardTitle className="">
            <div className="flex flex-col space-y-7">
              <div className="flex items-end justify-between">
                <div className="flex items-center space-x-5">
                  {/* <SlidersHorizontal /> */}
                </div>
                <div className="flex items-center relative space-x-2">
                  {/* <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <SlidersHorizontal className="h-8 w-8 text-zinc-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Advanced Filter</p>
                          </TooltipContent>
                        </Tooltip>  
                      </TooltipProvider>
                    </PopoverTrigger>
                    <MasFilter 
                      filters={filters}
                      setFilters={setFilters}
                      closePopover={togglePopover}
                    />
                  </Popover> */}
                  <Input 
                    className="bg-transparent border-2 border-zinc-100/10 rounded-full text-white" 
                    placeholder="Search Team"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute right-2 text-gray-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-5">
          <DataTable columns={columns} data={getAllTeamsData?.teams || []} />
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
      <h1 className="text-2xl text-white font-semibold p-2">ALL TEAMS</h1>
      <TeamTable />
    </div>
  )
}

export default Page