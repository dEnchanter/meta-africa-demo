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
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { calculateStarRating } from "@/helper/calculateStarRating";
import RatingComponent from "@/components/RatingComponent";
import { abbreviateBasketballPosition } from "@/helper/abbreviatePositionName";
import { useUser } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import MasFilter from "@/components/MasFilter";
import Image from "next/image";
import MasFilter2 from "@/components/MasFilter2";

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

interface Filter {
  key: string;
  value: string;
}

interface FetchPlayersParams {
  pageIndex?: number;
  pageSize?: number;
  currentPage?: number;
  filters?: Filter[];
  // ... other parameters
}

type ParamsType = {
  currentPage?: number;
  page?: number;
  limit?: number;
  [key: string]: any;  // This line allows for additional string keys
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

const MASTable = () => {

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
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const router = useRouter();

  const {
    data: getAllPlayersData,
    // mutate: refetchPlayers
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters, currentPage] : null,
    () => fetchPlayers(Endpoint, { pageIndex, pageSize, filters, currentPage }),
  );

  async function fetchPlayers(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchPlayersParams
  ) {

    // Provide a default value for pageIndex if it's undefined
    const currentPageIndex = currentPage ?? 0;
    // const currentPageSize = pageSize ?? 3;

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
      const response = await axios.get(Endpoint.MAS_100_PLAYERS, {
        params
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        setCurrentPage(payload?.data?.currentPage)
        setTotalPages(payload?.data?.totalPages)

        return {
          data: payload.data,
          // currentPage: payload.data.currentPage,
          // totalPages: payload.data.totalPages,
        };
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const viewProfile = (id: any) => {
    const profilePath = `/dashboard/mas100/${id}`;
    router.push(profilePath);
  }

  useEffect(() => {
    // Load the initial state from local storage or an API call
    const savedSelection = localStorage.getItem('selectedPlayers');
    if (savedSelection) {
      setSelectedPlayers(JSON.parse(savedSelection));
    }
  }, []);

  // Update filters when search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      setFilters([{ key: 'name', value: searchTerm }]);
    } else {
      setFilters([]);
    }
  }, [searchTerm]);

  const handleCheckboxChange = async (playerId: string | undefined) => {
    // console.log("row", rowData)

    if (typeof playerId === 'undefined') {
      // Handle the undefined case or simply return
      return;
    }

    setSelectedPlayers((prevSelected) => {
      const newSelected = prevSelected.includes(playerId)
        ? prevSelected.filter(id => id !== playerId)
        : [...prevSelected, playerId];

      // Save to local storage or send to an API
      localStorage.setItem('selectedPlayers', JSON.stringify(newSelected));
      return newSelected;
    });

    const requestBody = {
      player_id: playerId,
    };

    try {
      const response = await axios.post(Endpoint.SHOW_INTEREST, requestBody);
      const payload = response?.data;
  
      if (payload.status == 'success') {
        toast.success(payload.message)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const columns: ColumnDef<Player>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => (currentPage - 1) * pageSize + info.row.index + 1,
    },
    {
      accessorKey: "name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Player Name",
      cell: (info) => (
        <div className="flex items-center">
          <Image
            src={info.row.original.avatar || '/meta-africa-logo.png'} // Use the avatar URL from the data
            width={30}
            height={30}
            alt="meta-africa-logo"
            objectFit="contain"
            quality={100}
            style={{ borderRadius: '50%' }}
            className="mr-2"
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
        const scoutGrade = parseInt(info.row.original.scout_grade ?? "0");
  
        // Calculate the star rating
        const rating = calculateStarRating(scoutGrade);
  
        // Return the rating, perhaps wrapped in a visual component that displays stars
        return <RatingComponent rating={rating} />;
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
    {
      id: 'select',
      header: 'Interest',
      cell: (info) => {
        const id = info.row.original._id;
        if (typeof id !== 'string') {
          return <div>Invalid ID</div>;
        }
        return (
          <div className="flex h-6 items-center">
            <Checkbox
              className="h-5 w-5 text-green-600 border-2 border-gray-400 rounded-md 
              checked:bg-green-600 checked:border-transparent focus:outline-none"
              checked={selectedPlayers.includes(id)}
              onCheckedChange={() => handleCheckboxChange(id)}
            />
          </div>
        );
      }
    },
  ]

  return (
    <div className="mb-[10rem]">
      <Card className="bg-[rgb(36,36,36)] border-0 mb-[3rem]">
        <CardHeader>
          <CardTitle className="">
            <div className="flex flex-col space-y-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  {/* <SlidersHorizontal /> */}
                </div>

                <div className="flex items-center relative space-x-2">
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
                  </Popover>
                  <Input 
                    className="bg-transparent border-2 border-zinc-100/10 rounded-full text-white" 
                    placeholder="Search MAS 100"
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
          <DataTable columns={columns} data={getAllPlayersData?.data?.mas100 || []} />
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
      <h1 className="text-2xl text-white font-semibold p-2">MAS 100</h1>
      <MASTable />
    </div>
  )
}

export default Page