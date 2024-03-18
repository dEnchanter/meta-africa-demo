'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from '@/util/axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select'
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
import useSWR from 'swr'
import Pagination from '@/components/Pagination'
import Image from 'next/image'
import { Loading } from '@/components/Icons'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface AdminFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetchAdmin: () => void;
  operation: 'add' | 'edit';
  adminInfo?: Admin | null;
  adminFormOperation: string
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  adminInfo: Admin | null;
  refetchAdmin: () => void;
}

interface FetchDocumentParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  currentPage?: number;
  // ... other parameters
}

const adminTypeOptions = [
  { value: 'superadmin', label: 'Super Admin' },
  { value: 'regular', label: 'Regular Admin' }
];

const formSchema = z.object({
  firstname: z.string().min(2, { message: "first name must be at least 2 characters." }),
  lastname: z.string().min(2, { message: "last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  user_type: z.string().min(2, { message: "User type must be present." }),
})

const Page = () => {

  const pageIndex = 1;
  const pageSize = 10;

  // const {
  //   user,
  //   isValidating: userIsValidating,
  //   error: fetchingUserError,
  // } = useUser({
  //   redirectTo: "/login",
  // });

  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [totalPages, setTotalPages] = useState(0);
  
  const [filters, setFilters] = useState([]);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [adminFormOperation, setAdminFormOperation] = useState<'add' | 'edit'>('add');
 
  const [deleteDialogCoachInfo, setDeleteDialogCoachInfo] = useState<Admin | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editAdminInfo, setEditAdminInfo] = useState<Admin | null>(null);
  // const [shouldReload, setShouldReload] = useState(false);
  // const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [logoUrl, setLogoUrl] = useState('')

  const openAdminForm = (operation: 'add' | 'edit', adminInfo?: Admin) => {
    setAdminFormOperation(operation);
    setEditAdminInfo(adminInfo || null);
    setIsAddAdminOpen(true);
  };

  const closeAdminForm = () => {
    setIsAddAdminOpen(false);
  };

  const openDeleteDialog = (adminInfo: Admin) => {
    setDeleteDialogCoachInfo(adminInfo);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogCoachInfo(null);
    setDeleteDialogOpen(false);
  };

  const {
    data: getAllDocumentData,
    mutate: refetchDocument,
    isValidating: tableDataIsValidating
  } = useSWR(
    [Endpoint, filters, currentPage],
    () => fetchDocument(Endpoint, { pageIndex, pageSize, filters, currentPage }),
  );

  async function fetchDocument(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchDocumentParams
  ) {

    let userFilter = filters?.reduce((acc: any, aFilter: any) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    // Provide a default value for pageIndex if it's undefined
    // const currentPageIndex = currentPage ?? 0;
    // const currentPageSize = pageSize ?? 3;

    try {
      const response = await axios.get(Endpoint.GET_ALL_DOC, {
        params: {
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        return {
          data: payload.data,
        };
      }  else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      console.error("Something went wrong");
    }
  }

  // useEffect(() => {
  //   // Assuming `getAllGamesData` might be undefined initially and then set asynchronously
  //   if (!getAllDocumentData) {
  //     setShouldReload(true);
  //   }
  // }, [getAllDocumentData]);

  // useEffect(() => {
  //   if (shouldReload) {
  //     window.location.reload();
  //   }
  // }, [shouldReload]);

  const columns: ColumnDef<Document>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => info.row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Player Name",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "identity_type",
      header: "ID Type",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "identity_document",
      header: "ID Document",
      cell: (info) => (
        <Image
          src={String(info.getValue())}  // Assuming info.getValue() returns the image URL or path
          alt="ID Document"
          // style={{ maxWidth: "20%", maxHeight: "20%" }}
          width={100}
          height={100}
        />
      ),
    },

    // {
    //   id: 'viewProfile',
    //   header: 'Actions',
    //   cell: (info) => (
    //     <div className="flex space-x-2">
    //       {/* Edit icon */}
    //       <FileEdit
    //         className="text-yellow-600 cursor-pointer w-5 h-5"
    //         onClick={() => openAdminForm('edit', info.row.original)}
    //       />
    //       {/* Delete icon */}
    //       <BookmarkX
    //         className="text-red-600 cursor-pointer w-5 h-5"
    //         onClick={() => openDeleteDialog(info.row.original)} 
    //       />

    //       {isEditDialogOpen && (
    //         <AdminForm
    //           isOpen={isAddAdminOpen}
    //           onClose={closeAdminForm}
    //           adminInfo={editAdminInfo}
    //           refetchAdmin={refetchAdmin}
    //           operation='edit'
    //           adminFormOperation={adminFormOperation}
    //         />
    //       )}

    //       {/* Delete Confirmation Dialog */}
    //       {isDeleteDialogOpen && (
    //         <DeleteConfirmationDialog
    //           isOpen={isDeleteDialogOpen}
    //           onClose={closeDeleteDialog}
    //           adminInfo={deleteDialogCoachInfo}
    //           refetchAdmin={refetchAdmin}
    //         />
    //       )}

    //     </div>
    //   ),
    // },
  ]

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
                  {!data.length && tableDataIsValidating && (
                      <div className="text-center p-4 text-zinc-200 text-sm h-14">
                        <span>
                          Loading page
                          <span className="tracking-widest">...</span>
                        </span>
                        <div className="inline-block ml-2">
                          <Loading h="w-4" />
                        </div>
                      </div>
                    )}
                    {!data.length && !tableDataIsValidating && (
                      <div className="text-center p-4 text-zinc-200 text-sm h-14">
                        <span>No record found</span>
                      </div>
                    )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10 mb-5'>
        <p className='text-zinc-200 font-semibold text-xl'>Players Documentation</p>
        {/* <Button className='dashboard-button-gradient hover:bg-orange-600' onClick={() => openAdminForm('add')}>Add New Admin</Button> */}
      </div>
      <div>
        <Card className="bg-[rgb(36,36,36)] border-0">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5 mb-[3rem]">
            <DataTable columns={columns} data={getAllDocumentData?.data || []} />
          </CardContent>
        </Card>
        {/* <div className='-mt-4'>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} 
          />
        </div> */}
      </div>
      {isAddAdminOpen && (
        <AdminForm 
          isOpen={isAddAdminOpen} 
          onClose={closeAdminForm} 
          refetchAdmin={refetchDocument} 
          operation="add" // or "edit"
          adminInfo={editAdminInfo}
          adminFormOperation={adminFormOperation}
        />
      )}
    </MaxWidthWrapper>
  )
}

const AdminForm = ({ isOpen, onClose, refetchAdmin, operation, adminInfo, adminFormOperation }: AdminFormDialogProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [logoUrl, setLogoUrl] = useState('')

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
      firstname: adminInfo?.firstname || "",
      lastname: adminInfo?.lastname || "",
      email: adminInfo?.email || "",
      user_type: adminInfo?.user_type || "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
      // logo_url: adminInfo?.logo_url || logoUrl, // Add the logo URL to the submission data
    };

    let endpoint = '';

    if (adminFormOperation === 'add') {
      endpoint = Endpoint.CREATE_ADMIN;
    } else if (adminFormOperation === 'edit' && adminInfo) {
      // Construct the edit endpoint with the user ID
      endpoint = `${Endpoint.EDIT_TEAM}/${adminInfo?.firstname}`;
    } else {
      // Handle the case where operation is 'edit' but user ID is missing
      console.error("User ID is missing for edit operation");
      return;
    }

    try {
      setIsLoading(true)

      const response = await (adminFormOperation === 'edit' ? axios.put : axios.post)(endpoint, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
        })

        refetchAdmin();
        form.reset();
        
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch(error: any) {
      toast.error(error?.response.data.message)
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
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Admin Form</div>
              <div className='flex flex-col space-y-5'>
                
                <div className="">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">FirstName</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter firstname"
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
                    name="email"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email"
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

                <div>
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter Lastname"
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
                    name="user_type"
                    render={({ field, fieldState: { error } }) => {
                      // Find the option that matches the current value
                      const selectedOption = adminTypeOptions.find(option => option.value === field.value);
                
                      return (
                        <FormItem className="w-full mt-1">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Admin Type</FormLabel>
                          <FormControl>
                            <Select
                              options={adminTypeOptions}
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

const DeleteConfirmationDialog = ({ isOpen, onClose, adminInfo, refetchAdmin }: DeleteConfirmationDialogProps) => {

  const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    console.log("delete")

    if (!adminInfo) {
      toast.error("Coach information is missing for delete operation");
      return;
    }

    const endpoint = `${Endpoint.DELETE_COACHES}/${adminInfo?.firstname}`;

    try {

      const response = await axios.delete(endpoint);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
      })

      refetchAdmin();
        
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch(error: any) {
      toast.error(error?.response.data.message)
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
            <p>Are you sure you want to delete this coach record: {adminInfo?.firstname}</p>
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