'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from '@/util/axios'
import 'react-datepicker/dist/react-datepicker.css';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ReactDatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
// import { UploadButton } from '@/util/uploadthing'
import { useUser } from '@/hooks/auth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ColumnDef,
  //Pagination,
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
import RatingComponent from '@/components/RatingComponent'
import Link from 'next/link'
import { BookmarkX, DeleteIcon, Edit2Icon, FileEdit } from 'lucide-react'
import { Dialog } from '@headlessui/react';
import { NewThemePaginator } from '@/components/Pagination'
import useSWR from 'swr'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface GameFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetchGames: () => void;
  operation: 'add' | 'edit';
  gameInfo?: Game | null;
  gameFormOperation: string
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameInfo: Game | null;
  refetchGames: () => void;
}

interface FetchGameParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

const formSchema = z.object({
  team_id: z.string().min(2, { message: "Select Team1." }),
  opponent: z.string().min(2, { message: "Select Team2." }),
  stadium: z.string().min(1, { message: "Stadium must be present." }),
  date: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
  time: z.string().min(1, { message: "atleast 1 character." }),
})

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

const Page = () => {

  const pageIndex = 0;
  const pageSize = 10;

  const {
    user,
    isValidating: userIsValidating,
    error: fetchingUserError,
  } = useUser({
    redirectTo: "/login",
  });

  const [pageCount, setPageCount] = useState("--");
  const [filters, setFilters] = useState([]);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [gameFormOperation, setGameFormOperation] = useState<'add' | 'edit'>('add');
 
  const [deleteDialogCoachInfo, setDeleteDialogCoachInfo] = useState<Game | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editGameInfo, setEditGameInfo] = useState<Game | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [logoUrl, setLogoUrl] = useState('')

  const openGameForm = (operation: 'add' | 'edit', gameInfo?: Game) => {
    setGameFormOperation(operation);
    setEditGameInfo(gameInfo || null);
    setIsAddGameOpen(true);
  };

  const closeGameForm = () => {
    setIsAddGameOpen(false);
  };

  const openDeleteDialog = (gameInfo: Game) => {
    setDeleteDialogCoachInfo(gameInfo);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogCoachInfo(null);
    setDeleteDialogOpen(false);
  };

  const {
    data: getAllGamesData,
    mutate: refetchGames
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters] : null,
    () => fetchGames(Endpoint, { pageIndex, pageSize, filters }),
  );

  async function fetchGames(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchGameParams
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
      const response = await axios.get(Endpoint.GET_ALL_GAMES, {
        params: {
          page: currentPageIndex + 1,
          limit: currentPageSize || 10,
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        // setPageCount(Math.ceil(payload.totalPages / currentPageSize).toString());

        return {
          data: payload.data,
          matches: payload.data.matches,
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

  const columns: ColumnDef<Game>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "team.name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Team 1",
      cell: (info) => (
        <div className="flex items-center">
          <img 
            src={info.row.original.team.logo}
            alt="Avatar"
            onError={(e) => e.currentTarget.src = '/meta-africa-logo.png'}
            style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} // Adjust styling as needed
          />
          {String(info.getValue())}
        </div>
      ),
    },
    {
      accessorKey: "opponent.name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Team 2",
      cell: (info) => (
        <div className="flex items-center">
          <img 
            src={info.row.original.opponent.logo}
            alt="Avatar"
            onError={(e) => e.currentTarget.src = '/meta-africa-logo.png'}
            style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} // Adjust styling as needed
          />
          {String(info.getValue())}
        </div>
      ),
    },
    {
      accessorKey: "stadium", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Stadium",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "date", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Date",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "time", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Time",
      cell: (info) => (String(info.getValue())),
    },
    {
      id: 'viewProfile',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          {/* Edit icon */}
          <FileEdit
            className="text-yellow-600 cursor-pointer w-5 h-5"
            onClick={() => openGameForm('edit', info.row.original)}
          />
          {/* Delete icon */}
          <BookmarkX
            className="text-red-600 cursor-pointer w-5 h-5"
            onClick={() => openDeleteDialog(info.row.original)} 
          />

          {isEditDialogOpen && (
            <GameForm
              isOpen={isAddGameOpen}
              onClose={closeGameForm}
              gameInfo={editGameInfo}
              refetchGames={refetchGames}
              operation='edit'
              gameFormOperation={gameFormOperation}
            />
          )}

          {/* Delete Confirmation Dialog */}
          {isDeleteDialogOpen && (
            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={closeDeleteDialog}
              gameInfo={deleteDialogCoachInfo}
              refetchGames={refetchGames}
            />
          )}

        </div>
      ),
    },
  ]

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10 mb-5'>
        <p className='text-zinc-200 font-semibold text-xl'>All Games</p>
        <Button className='bg-orange-500 hover:bg-orange-600' onClick={() => openGameForm('add')}>Add New Game</Button>
      </div>
      <div>
        <Card className="bg-[rgb(36,36,36)] border-0">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5 mb-[3rem]">
            <DataTable columns={columns} data={getAllGamesData?.matches || []} />
          </CardContent>
        </Card>
      </div>
      {isAddGameOpen && (
        <GameForm 
          isOpen={isAddGameOpen} 
          onClose={closeGameForm} 
          refetchGames={refetchGames} 
          operation="add" // or "edit"
          gameInfo={editGameInfo}
          gameFormOperation={gameFormOperation}
        />
      )}
    </MaxWidthWrapper>
  )
}

const GameForm = ({ isOpen, onClose, refetchGames, operation, gameInfo, gameFormOperation }: GameFormDialogProps) => {
  
  // console.log("game", gameInfo)

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTeam, setSelectedTeam] = useState<{ value: string, label: string } | null>(null);

  const {
    data: getAllTeamsData
  } = useSWR(
    Endpoint,
    fetchTeams
  );

  async function fetchTeams(Endpoint: any) {
 
    try {
      const response = await axios.get(Endpoint.GET_ALL_TEAM)
      const payload = response.data;
      if (payload && payload.status == "suceess") {
        return payload.data
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  const selectOptions = getAllTeamsData?.teams?.map((team: Team) => ({
    value: team._id,
    label: team.name
  }));

  const handleSelectChange = (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      setSelectedTeam(selectedOption);
      form.setValue('team_id', selectedOption.value);
    } else {
      setSelectedTeam(null);
      form.setValue('team_id', '');
    }
  };

  const handleSelectChange2 = (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      setSelectedTeam(selectedOption);
      form.setValue('opponent', selectedOption.value);
    } else {
      setSelectedTeam(null);
      form.setValue('opponent', '');
    }
  };

  const customStyles: StylesConfig<{ value: string, label: string }, false> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'bg-[rgb(20,20,20)]',
      color: 'white',
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: 'black',
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isFocused ? 'grey' : isSelected ? 'darkgrey' : 'black',
      color: 'white',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: 'white',
    }),
    // Add more custom styles if needed
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team_id: gameInfo?.team?.id || "",
      opponent: gameInfo?.opponent.id || "",
      stadium: gameInfo?.stadium || "",
      date: gameInfo?.date || "",
      time: gameInfo?.time || "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
    };

    let endpoint = '';

    if (gameFormOperation === 'add') {
      endpoint = Endpoint.ADD_GAMES;
    } else if (gameFormOperation === 'edit' && gameInfo) {
      // Construct the edit endpoint with the user ID
      endpoint = `${Endpoint.UPDATE_GAMES}/${gameInfo?.team.name}`;
    } else {
      // Handle the case where operation is 'edit' but user ID is missing
      console.error("User ID is missing for edit operation");
      return;
    }

    try {
      setIsLoading(true)

      const response = await (gameFormOperation === 'edit' ? axios.put : axios.post)(endpoint, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
        })

        refetchGames();
        form.reset();
        
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch(error: any) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="grid grid-cols-2 gap-x-5 mt-5 bg-[rgb(36,36,36)] border border-gray-800 p-10 w-[35rem] h-[30rem] overflow-y-auto scrollbar-hide"
            >
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Game form</div>
              <div className='flex flex-col space-y-5'>
                
                <div className="">
                  <FormField
                    control={form.control}
                    name="team_id"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 1</FormLabel>
                        <FormControl>
                          <Select
                            options={selectOptions} 
                            value={selectOptions?.find((option: { value: string }) => option.value === gameInfo?.team.name)}
                            onChange={handleSelectChange}
                            className='bg-[rgb(20,20,20)] text-white'
                            styles={customStyles}
                            // {...field}
                          />
                        </FormControl>
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="stadium"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Stadium</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Stadium"
                            className='bg-[rgb(20,20,20)] text-white' 
                            {...field}
                          />
                        </FormControl>
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Date</FormLabel>
                        <FormControl className='mt-[0.2rem]'>
                          <ReactDatePicker
                            // {...field}
                            selected={startDate}
                            onChange={(date: Date) => {
                              setStartDate(date);
                              const formattedDate = date.toISOString().split('T')[0];
                              form.setValue('date', formattedDate);
                            }}
                            //maxDate={new Date()}
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Select Game Date"
                            className={`${
                              error ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none flex h-10 w-full rounded-md border border-input bg-[rgb(20,20,20)] px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none text-white`}
                          />
                        </FormControl>
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                      </FormItem>
                    )}
                  />
                </div>

              </div>

              <div className='flex flex-col space-y-5'>

                <div className="">
                  <FormField
                    control={form.control}
                    name="opponent"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 2</FormLabel>
                        <FormControl>
                          <Select
                            options={selectOptions} 
                            value={selectOptions?.find((option: { value: string }) => option.value === gameInfo?.opponent.name)}
                            onChange={handleSelectChange2}
                            className='bg-[rgb(20,20,20)] text-white'
                            styles={customStyles}
                            // {...field}
                          />
                        </FormControl>
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Time</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter game time"
                            className='bg-[rgb(20,20,20)] text-white' 
                            {...field}
                          />
                        </FormControl>
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                      </FormItem>
                    )}
                  />
                </div>

              </div>

              <Button 
                className="bg-orange-500 col-span-2 mt-10 h-[3.5rem] hover:bg-orange-600" 
                type="submit"
                isLoading={isLoading} 
              >
                  SAVE
              </Button>
              
            </form>
          </Form>
        </Dialog.Panel>
      </div>
     
    </Dialog>
  )
}

const DeleteConfirmationDialog = ({ isOpen, onClose, gameInfo, refetchGames }: DeleteConfirmationDialogProps) => {

  const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    // console.log("delete")

    if (!gameInfo) {
      toast.error("Coach information is missing for delete operation");
      return;
    }

    const endpoint = `${Endpoint.DELETE_COACHES}/${gameInfo?.team.name}`;

    try {

      const response = await axios.delete(endpoint);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
      })

      refetchGames();
        
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch(error: any) {
      toast.error("Something went wrong")
    } finally {
      // onClose()
    }
  }

  const handleCancel: () => void = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel>
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to delete this coach record: {gameInfo?.team.name}</p>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={(event) => handleConfirm(event)}
              >
                Delete
              </Button>
              <Button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
     
    </Dialog>
  )
}

export default Page