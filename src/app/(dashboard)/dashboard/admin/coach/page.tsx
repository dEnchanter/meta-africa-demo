'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '@/util/axios'
import useSWR from "swr";
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast'
import ReactDatePicker from 'react-datepicker'
import { UploadButton } from '@/util/uploadthing'
import { useUser } from '@/hooks/auth'
import {
  Card,
  CardContent,
  CardHeader,
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
import { BookmarkX, DeleteIcon, Edit2Icon, FileEdit } from 'lucide-react'
import { Dialog } from '@headlessui/react';

interface Team {
  _id: string;
  name: string;
  // other fields...
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface CoachFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetchCoaches: () => void;
  operation: 'add' | 'edit';
  coachInfo?: Coach | null;
  coachFormOperation: string
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  coachInfo: Coach | null;
  refetchCoaches: () => void;
}

interface FetchCoachParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  team_id: z.string().min(2, { message: "Team must be present." }),
  date_of_birth: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
  gender: z.string().min(2, { message: "Gender must be male or female." }),
  nationality: z.string().min(2, { message: "Nationality must be at least 2 characters." }),
  experience_years: z.string().min(1, { message: "Years must be at least 1 characters." }),
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
                {data.length === 0 ? "No data" : "Loading..."}
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
  const [isAddCoachOpen, setIsAddCoachOpen] = useState(false);
  const [coachFormOperation, setCoachFormOperation] = useState<'add' | 'edit'>('add');
 
  const [deleteDialogCoachInfo, setDeleteDialogCoachInfo] = useState<Coach | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editCoachInfo, setEditCoachInfo] = useState<Coach | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const openCoachForm = (operation: 'add' | 'edit', coachInfo?: Coach) => {
    setCoachFormOperation(operation);
    setEditCoachInfo(coachInfo || null);
    setIsAddCoachOpen(true);
  };

  const closeCoachForm = () => {
    setIsAddCoachOpen(false);
  };

  const openDeleteDialog = (coachInfo: Coach) => {
    setDeleteDialogCoachInfo(coachInfo || null);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const {
    data: getAllCoachesData,
    mutate: refetchCoaches
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters] : null,
    () => fetchCoaches(Endpoint, { pageIndex, pageSize, filters }),
  );

  async function fetchCoaches(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchCoachParams
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
      const response = await axios.get(Endpoint.GET_ALL_COACHES, {
        params: {
          page: currentPageIndex + 1,
          limit: currentPageSize || 10,
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "suceess") {

        setPageCount(Math.ceil(payload.totalPages / currentPageSize).toString());

        return {
          data: payload.date,
          coaches: payload.date.coaches,
          currentPage: payload.date.currentPage,
          totalPages: payload.date.totalPages,
        };
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  const columns: ColumnDef<Coach>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Coach Name",
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
      accessorKey: "nationality", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Nationality",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "experience_years", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
      header: "Years of Exp",
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
            onClick={() => openCoachForm('edit', info.row.original)}
          />
          {/* Delete icon */}
          <BookmarkX
            className="text-red-600 cursor-pointer w-5 h-5"
            onClick={() => openDeleteDialog(info.row.original)} 
          />

          {isEditDialogOpen && (
            <CoachForm
              isOpen={isAddCoachOpen}
              onClose={closeCoachForm}
              coachInfo={editCoachInfo}
              refetchCoaches={refetchCoaches}
              operation='edit'
              coachFormOperation={coachFormOperation}
            />
          )}

        </div>
      ),
    },
  ]

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10 mb-5'>
        <p className='text-zinc-200 font-semibold text-xl'>All Coaches</p>
        <Button className='bg-orange-500 hover:bg-orange-600' onClick={() => openCoachForm('add')}>Add New Coach</Button>
      </div>
      <div>
        <Card className="bg-[rgb(36,36,36)] border-0">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5 mb-[3rem]">
            <DataTable columns={columns} data={getAllCoachesData?.coaches || []} />
          </CardContent>
        </Card>
      </div>
      {isAddCoachOpen && (
        <CoachForm 
          isOpen={isAddCoachOpen} 
          onClose={closeCoachForm} 
          refetchCoaches={refetchCoaches} 
          operation="add"
          coachInfo={editCoachInfo}
          coachFormOperation={coachFormOperation}
        />
      )}
      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          coachInfo={deleteDialogCoachInfo}
          refetchCoaches={refetchCoaches}
        />
      )}
    </MaxWidthWrapper>
  )
}

const CoachForm = ({ isOpen, onClose, refetchCoaches, operation, coachInfo, coachFormOperation }: CoachFormDialogProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTeam, setSelectedTeam] = useState<{ value: string, label: string } | null>(null);
  const [logoUrl, setLogoUrl] = useState('')

  const {
    data: getAllTeamsData
  } = useSWR(
    Endpoint,
    fetcher
  );

  async function fetcher(Endpoint: any) {
 
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: coachInfo?.name || "",
      team_id: coachInfo?.team_id || "",
      date_of_birth: coachInfo?.date_of_birth || "",
      gender: coachInfo?.gender || "",
      nationality: coachInfo?.nationality || "",
      experience_years: coachInfo?.experience_years !== undefined ? coachInfo?.experience_years.toString() : "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
      avatar: coachInfo?.avatar || logoUrl,
    };

    let endpoint = '';

    if (coachFormOperation === 'add') {
      endpoint = Endpoint.ADD_COACH;
    } else if (coachFormOperation === 'edit' && coachInfo) {
      // Construct the edit endpoint with the user ID
      endpoint = `${Endpoint.EDIT_COACH}/${coachInfo?._id}`;
    } else {
      // Handle the case where operation is 'edit' but user ID is missing
      console.error("User ID is missing for edit operation");
      return;
    }

    try {
      setIsLoading(true)

      const response = await (coachFormOperation === 'edit' ? axios.put : axios.post)(endpoint, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
        })

        refetchCoaches();
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

  const handleSelectChange = (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      setSelectedTeam(selectedOption);
      form.setValue('team_id', selectedOption.value);
    } else {
      setSelectedTeam(null);
      form.setValue('team_id', '');
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

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="grid grid-cols-2 gap-x-5 mt-5 bg-[rgb(36,36,36)] border border-gray-800 p-10 w-[35rem] h-[30rem] overflow-y-auto scrollbar-hide"
            >
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Coach form</div>
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
                    name="date_of_birth"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Date of Birth</FormLabel>
                        <FormControl className='mt-[0.7rem]'>
                          <ReactDatePicker
                            // {...field}
                            selected={startDate}
                            onChange={(date: Date) => {
                              setStartDate(date);
                              const formattedDate = date.toISOString().split('T')[0];
                              form.setValue('date_of_birth', formattedDate);
                            }}
                            maxDate={new Date()}
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="MMMM d, yyyy"
                            placeholderText="Select a date of birth"
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
                    name="nationality"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Nationality</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter nationality"
                            className='bg-[rgb(20,20,20)] text-white' 
                            {...field}
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
                      toast.error(`Error uploading file`);
                    }}
                  />
                </div>

              </div>

              <div className='flex flex-col space-y-5'>

              <div className="">
                  <FormField
                    control={form.control}
                    name="team_id"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team</FormLabel>
                        <FormControl>
                          <Select 
                            options={selectOptions} 
                            value={selectOptions?.find((option: { value: string }) => option.value === coachInfo?.team_id)}
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
                    name="gender"
                    render={({ field, fieldState: { error } }) => {
                      // Find the option that matches the current value
                      const selectedOption = genderOptions.find(option => option.value === field.value);
                
                      return (
                        <FormItem className="w-full mt-1">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Gender</FormLabel>
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

                <div>
                  <FormField
                    control={form.control}
                    name="experience_years"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full mt-[0.1rem]">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Years of experience</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter years of experience"
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

const DeleteConfirmationDialog = ({ isOpen, onClose, coachInfo, refetchCoaches }: DeleteConfirmationDialogProps) => {

  const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async (event) => {

    event.preventDefault();
    event.stopPropagation();

    if (!coachInfo) {
      toast.error("Coach information is missing for delete operation");
      return;
    }

    const endpoint = `${Endpoint.DELETE_COACHES}/${coachInfo?._id}`;

    try {

      const response = await axios.delete(endpoint);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
      })

      refetchCoaches();
        
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
    <Dialog open={isOpen} onClose={onClose} className="relative z-100">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel>
          <div className="bg-white p-4 rounded-md">
            <p>Are you sure you want to delete this coach record: {coachInfo?.name}</p>
            <div className="flex justify-end mt-4">
              <Button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
                onClick={(event) => handleConfirm(event)}
              >
                Delete
              </Button>
              <Button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
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