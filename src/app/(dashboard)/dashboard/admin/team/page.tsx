'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from '@/util/axios'
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import Pagination from '@/components/Pagination';
import useSWR from 'swr'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface TeamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetchTeams: () => void;
  operation: 'add' | 'edit';
  teamInfo?: Team | null;
  teamFormOperation: string
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamInfo: Team | null;
  refetchTeams: () => void;
}

interface FetchTeamParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  currentPage?: number;
  // ... other parameters
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  founded_year: z.string().min(2, { message: "Founded year must be at least 2 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  home_stadium: z.string().min(2, { message: "Home Stadium must be at least 2 characters." }),
  team_gender: z.string().min(2, { message: "Team Gender must be present." }),
  league_id: z.string().min(2, { message: "League must be present." })
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
                {data.length === 0 ? "Loading..." : "Loading..."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const Page = () => {

  const pageIndex = 1;
  const pageSize = 10;

  const {
    user,
    isValidating: userIsValidating,
    error: fetchingUserError,
  } = useUser({
    redirectTo: "/login",
  });

  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState([]);

  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [teamFormOperation, setTeamFormOperation] = useState<'add' | 'edit'>('add');
 
  const [deleteDialogCoachInfo, setDeleteDialogCoachInfo] = useState<Team | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editTeamInfo, setEditTeamInfo] = useState<Team | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [logoUrl, setLogoUrl] = useState('')

  const openTeamForm = (operation: 'add' | 'edit', teamInfo?: Team) => {
    setTeamFormOperation(operation);
    setEditTeamInfo(teamInfo || null);
    setIsAddTeamOpen(true);
  };

  const closeTeamForm = () => {
    setIsAddTeamOpen(false);
  };

  const openDeleteDialog = (teamInfo: Team) => {
    setDeleteDialogCoachInfo(teamInfo);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogCoachInfo(null);
    setDeleteDialogOpen(false);
  };

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

    let userFilter = filters?.reduce((acc: any, aFilter: any) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    // Provide a default value for pageIndex if it's undefined
    const currentPageIndex = currentPage ?? 0;
    const currentPageSize = pageSize ?? 3;

    try {
      const response = await axios.get(Endpoint.GET_ALL_TEAM, {
        params: {
          page: currentPageIndex,
          limit: currentPageSize || 10,
          ...userFilter,
        },
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
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

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
      accessorKey: "team_gender",
      header: "Team Gender",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "league_name",
      header: "League",
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
            onClick={() => openTeamForm('edit', info.row.original)}
          />
          {/* Delete icon */}
          <BookmarkX
            className="text-red-600 cursor-pointer w-5 h-5"
            onClick={() => openDeleteDialog(info.row.original)} 
          />

          {isEditDialogOpen && (
            <TeamForm
              isOpen={isAddTeamOpen}
              onClose={closeTeamForm}
              teamInfo={editTeamInfo}
              refetchTeams={refetchTeams}
              operation='edit'
              teamFormOperation={teamFormOperation}
            />
          )}

        </div>
      ),
    },
  ]

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10 mb-5'>
        <p className='text-zinc-200 font-semibold text-xl'>All Teams</p>
        <Button className='dashboard-button-gradient hover:bg-orange-600' onClick={() => openTeamForm('add')}>Add New Team</Button>
      </div>
      <div>
        <Card className="bg-[rgb(36,36,36)] border-0">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5 mb-[3rem]">
            <DataTable columns={columns} data={getAllTeamsData?.teams || []} />
          </CardContent>
        </Card>
        <div className='-mt-4'>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
      {isAddTeamOpen && (
        <TeamForm 
          isOpen={isAddTeamOpen} 
          onClose={closeTeamForm} 
          refetchTeams={refetchTeams} 
          operation="add" // or "edit"
          teamInfo={editTeamInfo}
          teamFormOperation={teamFormOperation}
        />
      )}

       {/* Delete Confirmation Dialog */}
       {isDeleteDialogOpen && (
          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={closeDeleteDialog}
            teamInfo={deleteDialogCoachInfo}
            refetchTeams={refetchTeams}
          />
        )}
    </MaxWidthWrapper>
  )
}

const TeamForm = ({ isOpen, onClose, refetchTeams, operation, teamInfo, teamFormOperation }: TeamFormDialogProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedLegaue, setSelectedLeague] = useState<{ value: string, label: string } | null>(null);
  const [logoUrl, setLogoUrl] = useState('')

  const {
    data: getAllLeaguesData
  } = useSWR(
    Endpoint,
    fetchLeague
  );

  async function fetchLeague(Endpoint: any) {
 
    try {
      const response = await axios.get(Endpoint.GET_LEAGUES)
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

  const selectOptions = getAllLeaguesData?.leagues?.map((league: League) => ({
    value: league.id,
    label: league.name
  }));

  const handleSelectChange = (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      setSelectedLeague(selectedOption);
      form.setValue('league_id', selectedOption.value);
    } else {
      setSelectedLeague(null);
      form.setValue('league_id', '');
    }
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: teamInfo?.name || "",
      founded_year: teamInfo?.founded_year !== undefined ? teamInfo?.founded_year.toString() : "",
      city: teamInfo?.city || "",
      home_stadium: teamInfo?.home_stadium || "",
      team_gender: teamInfo?.team_gender || "",
      league_id: teamInfo?.league_id || "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
      logo_url: teamInfo?.logo_url || logoUrl, // Add the logo URL to the submission data
    };

    let endpoint = '';

    if (teamFormOperation === 'add') {
      endpoint = Endpoint.ADD_TEAM;
    } else if (teamFormOperation === 'edit' && teamInfo) {
      // Construct the edit endpoint with the user ID
      endpoint = `${Endpoint.EDIT_TEAM}/${teamInfo?._id}`;
    } else {
      // Handle the case where operation is 'edit' but user ID is missing
      console.error("User ID is missing for edit operation");
      return;
    }

    try {
      setIsLoading(true)

      const response = await (teamFormOperation === 'edit' ? axios.put : axios.post)(endpoint, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
        })

        refetchTeams();
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

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="grid grid-cols-2 gap-x-5 mt-5 bg-[rgb(36,36,36)] border border-gray-800 p-10 w-[35rem] h-[30rem] overflow-y-auto scrollbar-hide"
            >
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Team form</div>
              <div className='flex flex-col space-y-5'>
                
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

                <div className="">
                  <FormField
                    control={form.control}
                    name="founded_year"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Founded Year</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter year founded"
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
                    name="league_id"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">League</FormLabel>
                        <FormControl>
                          <Select
                            options={selectOptions} 
                            value={selectOptions?.find((option: { value: string }) => option.value === teamInfo?.league_id)}
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

              <div className='flex flex-col space-y-5'>

                <div>
                  <FormField
                    control={form.control}
                    name="home_stadium"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Home Stadium</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter stadium"
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
                    name="city"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter city"
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
                    name="team_gender"
                    render={({ field, fieldState: { error } }) => {
                      // Find the option that matches the current value
                      const selectedOption = genderOptions.find(option => option.value === field.value);
                
                      return (
                        <FormItem className="w-full mt-1">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team Gender</FormLabel>
                          <FormControl>
                            <Select
                              options={genderOptions}
                              value={selectedOption}
                              onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                              className='bg-[rgb(20,20,20)] text-white'
                              styles={customStyles}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )
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

const DeleteConfirmationDialog = ({ isOpen, onClose, teamInfo, refetchTeams }: DeleteConfirmationDialogProps) => {

  const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();

    if (!teamInfo) {
      toast.error("Team information is missing for delete operation");
      return;
    }

    const endpoint = `${Endpoint.DELETE_TEAM}/${teamInfo?._id}`;

    try {

      const response = await axios.delete(endpoint);
      const payload = response?.data;

      if (payload && payload.status == "suceess") {
        toast.success(payload.message, {
          duration: 5000,
      })

      refetchTeams();
        
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch(error: any) {
      toast.error("Something went wrong")
    } finally {
      onClose()
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
            <p>Are you sure you want to delete this team record: {teamInfo?.name}</p>
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