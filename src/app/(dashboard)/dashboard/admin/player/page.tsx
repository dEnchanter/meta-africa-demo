'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '@/util/axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select'
import ReactDatePicker from 'react-datepicker'
import { calculateStarRating } from "@/helper/calculateStarRating";
import 'react-datepicker/dist/react-datepicker.css';
import { UploadButton } from '@/util/uploadthing'
import { abbreviateBasketballPosition } from '@/helper/abbreviatePositionName'
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
import RatingComponent from '@/components/RatingComponent'
import { BookmarkX, DeleteIcon, Edit2Icon, FileEdit } from 'lucide-react'
import { useUser } from '@/hooks/auth'
import { Dialog } from '@headlessui/react';
import { generateHeightOptions } from '@/helper/generateHeightOptions'
import Pagination from '@/components/Pagination'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type PositionBadgeProps = {
  position: string;
};

interface Team {
  _id: string;
  name: string;
  // other fields...
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

interface PlayerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  refetchPlayers: () => void;
  operation: 'add' | 'edit';
  playerInfo?: Player | null;
  playerFormOperation: string
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playerInfo: Player | null;
  refetchPlayers: () => void;
}

interface FetchPlayersParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  currentPage?: number;
  // ... other parameters
}

const PositionBadge: React.FC<PositionBadgeProps> = ({ position }) => (
  <span className="border px-2 py-1 rounded text-sm">
    {abbreviateBasketballPosition(position)}
  </span>
);

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const documentOptions = [
  { value: 'passport', label: 'Passport' },
  { value: 'identification', label: 'Identification' },
  { value: 'basketball_license', label: 'Basketball License' },
  { value: 'school_report_card', label: 'School Report Card' },
]

const formSchema = z.object({
  team_id: z.string().min(2, { message: "Name must be at least 2 characters." }),
  position: z.string().min(1, { message: "position must be present." }),
  weight: z.string().min(1, { message: "atleast 1 character." }),
  jersey_number: z.string().optional(),
  nationality: z.string().min(2, { message: "State must be at least 2 characters." }),
  date_of_birth: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
  wingspan: z.string().optional(),
  name: z.string().optional(),
  gender: z.string().optional(),
  assigned_country: z.string().optional(),
  height: z.string().optional(),
  dob: z.string().optional(),
  // phone_number: z.string().min(6, { message: "Password must be at least 6 characters." }),
  scout_grade: z.string().optional(),
  biography: z.string().optional(),
  scout_comment: z.string().optional(),
  identity_type: z.string().optional(),
  identity_document: z.string().optional(),
  avatar:  z.string().optional(),
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
    user
  } = useUser({
    redirectTo: "/login",
  });

  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [totalPages, setTotalPages] = useState(0);
  
  const [filters, setFilters] = useState([]);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [playerFormOperation, setPlayerFormOperation] = useState<'add' | 'edit'>('add');
 
  const [deleteDialogPlayerInfo, setDeleteDialogPlayerInfo] = useState<Player | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editPlayerInfo, setEditPlayerInfo] = useState<Player | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const openPlayerForm = (operation: 'add' | 'edit', playerInfo?: Player) => {
    setPlayerFormOperation(operation);
    setEditPlayerInfo(playerInfo || null);
    setIsAddPlayerOpen(true);
  };

  const closePlayerForm = () => {
    setIsAddPlayerOpen(false);
  };

  const openDeleteDialog = (playerInfo: Player) => {
    setDeleteDialogPlayerInfo(playerInfo);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogPlayerInfo(null);
    setDeleteDialogOpen(false);
  };

  const {
    data: getAllPlayersData,
    mutate: refetchPlayers
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters, currentPage] : null,
    () => fetchPlayers(Endpoint, { pageIndex, pageSize, filters, currentPage }),
  );

  async function fetchPlayers(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchPlayersParams
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
      const response = await axios.get(Endpoint.GET_ALL_PLAYERS, {
        params: {
          page: currentPageIndex,
          limit: currentPageSize || 10,
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        setCurrentPage(payload?.data?.currentPage)
        setTotalPages(payload?.data?.totalPages)

        return {
          data: payload.data,
          players: payload.data.players,
          currentPage: payload.data.currentPage,
          totalPages: payload.data.totalPages,
        };
      }  else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

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
            src={info.row.original.avatar || '/meta-africa-logo.png'}
            alt='Avatar'
            width="30"
            height="30"
            objectFit="contain"
            quality={100}
            className="mr-2"
            style={{ borderRadius: '50%' }}
          />
          {String(info.getValue())}
        </div>
      ),
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: (info) => <PositionBadge position={abbreviateBasketballPosition(String(info.getValue()))} />,
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
      header: "Wingspan",
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
            onClick={() => openPlayerForm('edit', info.row.original)}
          />
          {/* Delete icon */}
          <BookmarkX
            className="text-red-600 cursor-pointer w-5 h-5"
            onClick={() => openDeleteDialog(info.row.original)} 
          />

          {isEditDialogOpen && (
            <PlayerForm
              isOpen={isAddPlayerOpen}
              onClose={closePlayerForm}
              playerInfo={editPlayerInfo}
              refetchPlayers={refetchPlayers}
              operation='edit'
              playerFormOperation={playerFormOperation}
            />
          )}

        </div>
      ),
    },
  ]

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10 mb-5'>
        <p className='text-zinc-200 font-semibold text-xl'>All Players</p>
        <Button className='dashboard-button-gradient hover:bg-orange-600' onClick={() => openPlayerForm('add')}>Add Player</Button>
      </div>
      <div>
        <Card className="bg-[rgb(36,36,36)] border-0">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5 mb-[3rem]">
            <DataTable 
              columns={columns} 
              data={getAllPlayersData?.players || []} 
            />
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
      {isAddPlayerOpen && (
        <PlayerForm 
          isOpen={isAddPlayerOpen} 
          onClose={closePlayerForm} 
          refetchPlayers={refetchPlayers} 
          operation="add" // or "edit"
          playerInfo={editPlayerInfo}
          playerFormOperation={playerFormOperation}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          playerInfo={deleteDialogPlayerInfo}
          refetchPlayers={refetchPlayers}
        />
      )}

    </MaxWidthWrapper>
  )
}

const PlayerForm = ({ isOpen, onClose, refetchPlayers, operation, playerInfo, playerFormOperation }: PlayerFormDialogProps) => {
 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTeam, setSelectedTeam] = useState<{ value: string, label: string } | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const {
    data: getAllTeamsData
  } = useSWR(
    Endpoint,
    () => fetchTeams(Endpoint, selectedGender)
  );

  const heightOptions = generateHeightOptions();

  async function fetchTeams(Endpoint: any, selectedGender: string | null) { 
 
    try {
      const url = selectedGender
      ? `${Endpoint.GET_ALL_TEAM}?gender=${selectedGender}`
      : Endpoint.GET_ALL_TEAM;

      const response = await axios.get(url);
      const payload = response.data;
      if (payload && payload.status == "suceess") {
        return payload.data
      }
    } catch (error) {
      toast.error("Something went wrong");
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
      team_id: playerInfo?.team_id || "",
      position:  playerInfo?.position || "",
      weight: playerInfo?.weight !== undefined ? playerInfo?.weight.toString() : "",
      jersey_number: playerInfo?.jersey_number !== undefined ? playerInfo?.jersey_number.toString() : "",
      nationality: playerInfo?.nationality || "",
      wingspan: playerInfo?.wingspan || "",
      name: playerInfo?.name || "",
      height: playerInfo?.height !== undefined ? playerInfo?.height.toString() : "",
      date_of_birth: playerInfo?.date_of_birth || "",
      gender: playerInfo?.gender || "",
      assigned_country: playerInfo?.assigned_country || "",
      scout_grade: playerInfo?.scout_grade || "",
      scout_comment: playerInfo?.scout_comment || "",
      biography: playerInfo?.biography || "",
      identity_type: playerInfo?.identity_type || "",
      avatar: playerInfo?.avatar || "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
    };

    if (logoUrl) {
      submissionData.avatar = logoUrl;
    }

    if (documentUrl) {
      submissionData.identity_document = documentUrl;
    }

    let endpoint = '';

    if (playerFormOperation === 'add') {
      endpoint = Endpoint.ADD_PLAYERS;
    } else if (playerFormOperation === 'edit' && playerInfo) {
      // Construct the edit endpoint with the user ID
      endpoint = `${Endpoint.EDIT_PLAYERS}/${playerInfo?._id}`;
    } else {
      // Handle the case where operation is 'edit' but user ID is missing
      console.error("User ID is missing for edit operation");
      return;
    }

    try {
      setIsLoading(true)

      const response = await (playerFormOperation === 'edit' ? axios.put : axios.post)(endpoint, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
      })

      refetchPlayers();
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
              className="grid grid-cols-2 gap-x-5 mt-[5rem] bg-[rgb(36,36,36)] border border-gray-800 p-10 w-[35rem] h-[30rem] overflow-y-auto scrollbar-hide"
            >
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Player form</div>
                <div className='flex flex-col space-y-5 -mt-[.2rem]'>

                  <div className="">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field, fieldState: { error } }) => {
                        // Find the option that matches the current value
                        const selectedOption = genderOptions.find(option => option.value === field.value);
                        setSelectedGender(selectedOption?.value || null);
                  
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
                      name="name"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">FullName</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter Name"
                              className='bg-[rgb(20,20,20)] text-white' 
                              {...field}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Height</FormLabel>
                          <FormControl>
                            <Select 
                              options={heightOptions} 
                              value={heightOptions.find(option => option.value === field.value)}
                              onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                              className='bg-[rgb(20,20,20)] text-white'
                              styles={customStyles}
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
                      name="jersey_number"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Jersey Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Jersey Number"
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
                      name="nationality"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Nationality</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Nationality" 
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
                      name="date_of_birth"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Date of Birth</FormLabel>
                          <FormControl className='mt-[0.5rem]'>
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
                      name="scout_comment"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Scout Comment</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter Scout Comment" 
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
                      name="identity_type"
                      render={({ field, fieldState: { error } }) => {
                        // Find the option that matches the current value
                        const selectedOption = documentOptions.find(option => option.value === field.value);
                        setSelectedDocument(selectedOption?.value || null);
                  
                        return (
                          <FormItem className="w-full mt-1">
                            <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Document Type</FormLabel>
                            <FormControl>
                              <Select
                                options={documentOptions}
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
                              value={selectOptions?.find((option: { value: string }) => option.value === playerInfo?.team_id)}
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
                      name="position"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Position</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Position"
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
                      name="weight"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Weight (pounds)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Weight"
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
                      name="scout_grade"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Scout Grade</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Scout Grade" 
                              {...field}
                              className='bg-[rgb(20,20,20)] text-white'
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
                      name="assigned_country"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Assigned Country</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Assigned Country"
                              className="w-full bg-[rgb(20,20,20)] text-white" 
                              {...field}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="wingspan"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Wingspan</FormLabel>
                          <FormControl>
                            <Select 
                              options={heightOptions} 
                              value={heightOptions.find(option => option.value === field.value)}
                              onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                              className='bg-[rgb(20,20,20)] text-white'
                              styles={customStyles}
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
                      name="biography"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Biography</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter Player Biography" 
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
                    <Label className='text-zinc-200 text-xs'>Document Upload</Label>
                    <UploadButton
                      className="mt-[.7rem] ut-button:bg-orange-600 ut-button:ut-readying:bg-orange-500/50"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        // Do something with the response
                        // console.log("Files: ", res);
                        if (res.length > 0) {
                          setDocumentUrl(res[0].url);
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

                <div className='flex items-center col-span-2 justify-around mt-4'>

                  <div className='w-[9rem]'>
                      <Label className='text-zinc-200 text-xs'>Player Image Upload</Label>
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

const DeleteConfirmationDialog = ({ isOpen, onClose, playerInfo, refetchPlayers }: DeleteConfirmationDialogProps) => {

  const handleConfirm: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();

    if (!playerInfo) {
      toast.error("Player information is missing for delete operation");
      return;
    }

    const endpoint = `${Endpoint.DELETE_PLAYERS}/${playerInfo?._id}`;

    try {

      const response = await axios.delete(endpoint);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
      })

      refetchPlayers();
        
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
            <p>Are you sure you want to delete this player record: {playerInfo?.name}</p>
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
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:text-white hover:bg-zinc-400"
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