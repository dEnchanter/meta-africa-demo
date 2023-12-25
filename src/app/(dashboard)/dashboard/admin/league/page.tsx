'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from '@/util/axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { UploadButton } from '@/util/uploadthing'
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

interface LeagueFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetchLeagues: () => void;
  operation: 'add' | 'edit';
  leagueInfo?: League | null;
  leagueFormOperation: string
}

interface SeasonFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leagueInfo: League | null;
  refetchLeagues: () => void;
}

interface FetchLeagueParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  country: z.string().min(2, { message: "Country must be at least 2 characters." }),
})

const seasonSchema = z.object({
  season_start: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
  season_end: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
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
  const [isAddLeagueOpen, setIsAddLeagueOpen] = useState(false);
  const [isAddSeasonOpen, setIsAddSeasonOpen] = useState(false);
  const [deleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leagueFormOperation, setLeagueFormOperation] = useState<'add' | 'edit'>('add');
 
  const [deleteDialogCoachInfo, setDeleteDialogCoachInfo] = useState<League | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editLeagueInfo, setEditLeagueInfo] = useState<League | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [logoUrl, setLogoUrl] = useState('')

  const openLeagueForm = (operation: 'add' | 'edit', leagueInfo?: League) => {
    setLeagueFormOperation(operation);
    setEditLeagueInfo(leagueInfo || null);
    setIsAddLeagueOpen(true);
  };

  const closeLeagueForm = () => {
    setIsAddLeagueOpen(false);
  };

  const openSeasonForm = () => {
    setIsAddSeasonOpen(true);
  };

  const closeSeasonForm = () => {
    setIsAddSeasonOpen(false);
  };

  const openDeleteDialog = (leagueInfo: League) => {
    setDeleteDialogCoachInfo(leagueInfo);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogCoachInfo(null);
    setDeleteDialogOpen(false);
  };

  const {
    data: getAllLeaguesData,
    mutate: refetchLeagues
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters] : null,
    () => fetchLeagues(Endpoint, { pageIndex, pageSize, filters }),
  );

  async function fetchLeagues(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchLeagueParams
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
      const response = await axios.get(Endpoint.GET_LEAGUES, {
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
          leagues: payload.data.leagues,
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

  const columns: ColumnDef<League>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "League Name",
      cell: (info) => (
        <div className="flex items-center">
          {String(info.getValue())}
        </div>
      ),
    },
    {
      accessorKey: "country", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Country",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "season", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Season",
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
            onClick={() => openLeagueForm('edit', info.row.original)}
          />
          {/* Delete icon */}
          <BookmarkX
            className="text-red-600 cursor-pointer w-5 h-5"
            onClick={() => openDeleteDialog(info.row.original)} 
          />

          {isEditDialogOpen && (
            <LeagueForm
              isOpen={isAddLeagueOpen}
              onClose={closeLeagueForm}
              leagueInfo={editLeagueInfo}
              refetchLeagues={refetchLeagues}
              operation='edit'
              leagueFormOperation={leagueFormOperation}
            />
          )}

          {/* Delete Confirmation Dialog */}
          {isDeleteDialogOpen && (
            <DeleteConfirmationDialog
              isOpen={isDeleteDialogOpen}
              onClose={closeDeleteDialog}
              leagueInfo={deleteDialogCoachInfo}
              refetchLeagues={refetchLeagues}
            />
          )}

        </div>
      ),
    },
  ]

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10 mb-5'>
        <p className='text-zinc-200 font-semibold text-xl'>All Leagues</p>
        <div className='flex space-x-3'>
          <Button className='bg-orange-500 hover:bg-orange-600' onClick={() => openSeasonForm()}>Add Season</Button>
          <Button className='bg-orange-500 hover:bg-orange-600' onClick={() => openLeagueForm('add')}>Add New League</Button>
        </div>
        
      </div>
      <div>
        <Card className="bg-[rgb(36,36,36)] border-0">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5 mb-[3rem]">
            <DataTable columns={columns} data={getAllLeaguesData?.leagues || []} />
          </CardContent>
        </Card>
      </div>
      {isAddLeagueOpen && (
        <LeagueForm 
          isOpen={isAddLeagueOpen} 
          onClose={closeLeagueForm} 
          refetchLeagues={refetchLeagues} 
          operation="add" // or "edit"
          leagueInfo={editLeagueInfo}
          leagueFormOperation={leagueFormOperation}
        />
      )}

      {isAddSeasonOpen && (
        <SeasonForm 
          isOpen={isAddSeasonOpen} 
          onClose={closeSeasonForm} 
        />
      )}
    </MaxWidthWrapper>
  )
}

const LeagueForm = ({ isOpen, onClose, refetchLeagues, operation, leagueInfo, leagueFormOperation }: LeagueFormDialogProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [logoUrl, setLogoUrl] = useState('')

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: leagueInfo?.name || "",
      country: leagueInfo?.country || "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
    };

    let endpoint = '';

    if (leagueFormOperation === 'add') {
      endpoint = Endpoint.ADD_LEAGUES;
    } else if (leagueFormOperation === 'edit' && leagueInfo) {
      // Construct the edit endpoint with the user ID
      endpoint = `${Endpoint.UPDATE_LEAGUES}/${leagueInfo?._id}`;
    } else {
      // Handle the case where operation is 'edit' but user ID is missing
      console.error("User ID is missing for edit operation");
      return;
    }

    try {
      setIsLoading(true)

      const response = await (leagueFormOperation === 'edit' ? axios.put : axios.post)(endpoint, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
        })

        refetchLeagues();
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
              className="grid grid-cols-2 gap-x-5 gap-y-3 mt-5 bg-[rgb(36,36,36)] border border-gray-800 p-10 w-[35rem] h-[30rem] overflow-y-auto scrollbar-hide"
            >
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>League form</div>
              
              <div className='flex flex-col space-y-5 col-span-2'>
                
                <div className="">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter name"
                            className="w-full bg-[rgb(20,20,20)] text-white" 
                            {...field}
                          />
                        </FormControl>
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                      </FormItem>
                    )}
                  />
                </div>

              </div>

              <div className='flex flex-col space-y-5 col-span-2'>
                
                <div className="">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter country"
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

              <div className='flex flex-col space-y-5'>   

                <div className='w-[9rem]'>
                  <UploadButton
                    className="mt-4 ut-button:bg-orange-600 ut-button:ut-readying:bg-orange-500/50"
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      // Do something with the response
                      // console.log("Files: ", res);
                      if (res.length > 0) {
                        setLogoUrl(res[0].url);
                      }
                      toast.success("Upload Completed");
                    }}
                    onUploadError={(error: Error) => {
                      // Do something with the error.
                      toast.error(`ERROR! ${error.message}`);
                    }}
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

const SeasonForm = ({ isOpen, onClose }: SeasonFormDialogProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
  
    // 1. Define your form.
    const form = useForm<z.infer<typeof seasonSchema>>({
      resolver: zodResolver(seasonSchema),
      defaultValues: {
        season_start: "",
        season_end: "",
      },
    })
  
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof seasonSchema>) {
  
      const submissionData = {
        ...values,
      };
  
      try {
        setIsLoading(true)
  
        const response = await axios.post(Endpoint.ADD_SEASON, submissionData);
        const payload = response?.data;
  
        if (payload && payload.status == "success") {
          toast.success(payload.message, {
            duration: 5000,
          })
  
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
                className="grid grid-cols-2 gap-x-5 gap-y-3 mt-2 bg-[rgb(36,36,36)] border border-gray-800 p-5 w-[35rem] h-[30rem] overflow-y-auto scrollbar-hide"
              >
                <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase'>Season form</div>

                <div className='flex flex-col col-span-2 space-y-10'>

                  <div className="">
                    <FormField
                      control={form.control}
                      name="season_start"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Beginning of Season</FormLabel>
                          <FormControl className='mt-[0.4rem]'>
                            <ReactDatePicker
                              // {...field}
                              selected={startDate}
                              onChange={(date: Date) => {
                                setStartDate(date);
                                const formattedDate = date.toISOString().split('T')[0];
                                form.setValue('season_start', formattedDate);
                              }}
                              maxDate={new Date()}
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="MMMM d, yyyy"
                              placeholderText="Select a date"
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

                  <div className="">
                    <FormField
                      control={form.control}
                      name="season_end"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">End of Season</FormLabel>
                          <FormControl className='mt-[0.4rem]'>
                            <ReactDatePicker
                              // {...field}
                              selected={endDate}
                              onChange={(date: Date) => {
                                setEndDate(date);
                                const formattedDate = date.toISOString().split('T')[0];
                                form.setValue('season_end', formattedDate);
                              }}
                              maxDate={new Date()}
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="MMMM d, yyyy"
                              placeholderText="Select a date"
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
  
                <Button 
                  className="bg-orange-500 col-span-2 h-[3.5rem] hover:bg-orange-600" 
                  type="submit"
                  isLoading={isLoading} 
                >
                    ADD
                </Button>
                
              </form>
            </Form>
          </Dialog.Panel>
        </div>
       
      </Dialog>
    )
}

const DeleteConfirmationDialog = ({ isOpen, onClose, leagueInfo, refetchLeagues }: DeleteConfirmationDialogProps) => {

  // const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
  //   console.log("delaware")
  //   event.stopPropagation();
  //   console.log("delete")

  //   if (!leagueInfo) {
  //     toast.error("Coach information is missing for delete operation");
  //     return;
  //   }

  //   const endpoint = `${Endpoint.DELETE_COACHES}/${leagueInfo?._id}`;

  //   try {

  //     const response = await axios.delete(endpoint);
  //     const payload = response?.data;

  //     if (payload && payload.status == "success") {
  //       toast.success(payload.message, {
  //         duration: 5000,
  //     })

  //     refetchLeagues();
        
  //     } else if (payload && payload.status == "error") {
  //       toast.error(payload.message)
  //     }
  //   } catch(error: any) {
  //     toast.error("Something went wrong")
  //   } finally {
  //     onClose()
  //   }
  // }

  // const handleCancel: () => void = () => {
  //   onClose();
  // };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel>
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to delete this coach record: {leagueInfo?.name}</p>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                // onClick={(event) => handleConfirm(event)}
              >
                Delete
              </Button>
              <Button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                // onClick={handleCancel}
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