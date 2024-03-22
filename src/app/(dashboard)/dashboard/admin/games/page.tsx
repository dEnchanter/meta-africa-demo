'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from '@/util/axios'
import 'react-datepicker/dist/react-datepicker.css';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ReactDatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
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
import { Atom, BookmarkX, Camera, CopyPlus, Dribbble, FileEdit } from 'lucide-react'
import { Dialog } from '@headlessui/react';
import useSWR from 'swr'
import Pagination from '@/components/Pagination'
import { UploadButton } from '@/util/uploadthing'
import { Label } from '@/components/ui/label'
import { Loading } from '@/components/Icons'
import 'react-datepicker/dist/react-datepicker.css'

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

interface ResultFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resultInfo?: Game | null;
  refetchGames: () => void;
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
  currentPage?: number;
  // ... other parameters
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const formSchema = z.object({
  team_id: z.string().min(2, { message: "Select Team1." }),
  opponent: z.string().min(2, { message: "Select Team2." }),
  stadium: z.string().min(1, { message: "Stadium must be present." }),
  date: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
  gender: z.string().min(2, { message: "Team Gender must be present." }),
  time: z.string().min(1, { message: "atleast 1 character." }),
})

const resultSchema = z.object({
  team1_score1: z.string().min(1, { message: "1st quarter score must be present." }),
  team1_score2: z.string().min(1, { message: "2nd quarter score must be present." }),
  team1_score3: z.string().min(1, { message: "3rd quarter score must be present." }),
  team1_score4: z.string().min(1, { message: "4th quarter score must be present." }),
  team2_score1: z.string().min(1, { message: "1st quarter score must be present." }),
  team2_score2: z.string().min(1, { message: "2nd quarter score must be present." }),
  team2_score3: z.string().min(1, { message: "3rd quarter score must be present." }),
  team2_score4: z.string().min(1, { message: "4th quarter score must be present." }),
  // team1_finalScore: z.string().min(1, { message: "final score must be present." }),
  // team2_finalScore: z.string().min(1, { message: "final score must be present." }),
})

const playerResultSchema = z.object({
  team_id: z.string().min(1, { message: "Select Team." }),
  player_id: z.string().min(1, { message: "Select Player." }),
  minute_played: z.union([
    z.string().min(1, { message: "Assign minutes played." }),
    z.number().nonnegative({ message: "Minutes played cannot be negative." })
  ]),
  two_points_attempted: z.union([
    z.string().min(1, { message: "Assign 2p attempted." }),
    z.number().nonnegative({ message: "2p attempted cannot be negative." })
  ]),
  two_points_made: z.union([
    z.string().min(1, { message: "Assign 2p made." }),
    z.number().nonnegative({ message: "2p made cannot be negative." })
  ]),
  three_points_attempted: z.union([
    z.string().min(1, { message: "Assign 3p attempted." }),
    z.number().nonnegative({ message: "3p attempted cannot be negative." })
  ]),
  three_points_made: z.union([
    z.string().min(1, { message: "Assign 3p made." }),
    z.number().nonnegative({ message: "3p made cannot be negative." })
  ]),
  free_throw_attempted: z.union([
    z.string().min(1, { message: "Assign ft attempted." }),
    z.number().nonnegative({ message: "ft attempted cannot be negative." })
  ]),
  free_throw_made: z.union([
    z.string().min(1, { message: "Assign ft made." }),
    z.number().nonnegative({ message: "ft made cannot be negative." })
  ]),
  offensive_rebounds: z.union([
    z.string().min(1, { message: "Assign offensive rebounds." }),
    z.number().nonnegative({ message: "Offensive rebounds cannot be negative." })
  ]),
  defensive_rebounds: z.union([
    z.string().min(1, { message: "Assign defensive rebounds." }),
    z.number().nonnegative({ message: "Defensive rebounds cannot be negative." })
  ]),
  assists: z.union([
    z.string().min(1, { message: "Assign assists." }),
    z.number().nonnegative({ message: "Assists cannot be negative." })
  ]),
  turnovers: z.union([
    z.string().min(1, { message: "Assign turnovers." }),
    z.number().nonnegative({ message: "Turnovers cannot be negative." })
  ]),
  steals: z.union([
    z.string().min(1, { message: "Assign steals." }),
    z.number().nonnegative({ message: "Steals cannot be negative." })
  ]),
  blocks: z.union([
    z.string().min(1, { message: "Assign blocks." }),
    z.number().nonnegative({ message: "Blocks cannot be negative." })
  ]),
  fouls: z.union([
    z.string().min(1, { message: "Assign fouls." }),
    z.number().nonnegative({ message: "Fouls cannot be negative." })
  ]),
  efficiency: z.union([
    z.string().min(1, { message: "Assign efficiency." }),
    z.number().nonnegative({ message: "Efficiency cannot be negative." })
  ]) 
})

const mediaSchema = z.object({
  team_id: z.string().min(1, { message: "Select Team." }),
  player_id: z.array(z.string().min(1, { message: "Select at least one Player." })),  
  media_type: z.string().min(1, { message: "Select Player." }), 
})

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

  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [gameFormOperation, setGameFormOperation] = useState<'add' | 'edit'>('add');
 
  const [deleteDialogCoachInfo, setDeleteDialogCoachInfo] = useState<Game | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editGameInfo, setEditGameInfo] = useState<Game | null>(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogInfo, setResultDialogInfo] = useState<Game | null>(null);
  const [resultDialogInfo2, setResultDialogInfo2] = useState<Game | null>(null);

  const [playerResultDialogOpen, setPlayerResultDialogOpen] = useState(false);
  const [playerResultDialogOpen2, setPlayerResultDialogOpen2] = useState(false);

  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

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

  const openResultDialog = (gameInfo: Game) => {
    setResultDialogInfo(gameInfo || null);
    setResultDialogOpen(true);
  };

  const closeResultDialog = () => {
    setResultDialogOpen(false);
  };

  const openPlayerResultDialog = (gameInfo: Game) => {
    setResultDialogInfo(gameInfo || null);
    setPlayerResultDialogOpen(true);
  };

  const openPlayerResultDialog2 = (gameInfo: Game) => {
    setResultDialogInfo2(gameInfo || null);
    setPlayerResultDialogOpen2(true);
  };

  const closePlayerResultDialog = () => {
    setPlayerResultDialogOpen(false);
  };

  const closePlayerResultDialog2 = () => {
    setPlayerResultDialogOpen2(false);
  };

  const openMediaDialog = (gameInfo: Game) => {
    setResultDialogInfo(gameInfo || null);
    setMediaDialogOpen(true);
  };

  const closeMediaDialog = () => {
    setMediaDialogOpen(false);
  };

  const {
    data: getAllGamesData,
    isValidating: tableDataIsValidating,
    mutate: refetchGames
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters, currentPage] : null,
    () => fetchGames(Endpoint, { pageIndex, pageSize, filters, currentPage }),
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
    const currentPageIndex = currentPage ?? 0;
    const currentPageSize = pageSize ?? 3;

    try {
      const response = await axios.get(Endpoint.GET_ALL_GAMES, {
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
          matches: payload.data.matches,
          currentPage: payload.data.currentPage,
          totalPages: payload.data.totalPages,
        };
      } else if (payload && payload.status == "error") {
        console.error(payload.message)
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    // Assuming `getAllGamesData` might be undefined initially and then set asynchronously
    if (getAllGamesData && !getAllGamesData?.matches?.length) {
      setShouldReload(true);
    }
  }, [getAllGamesData]);

  useEffect(() => {
    if (shouldReload) {
      window.location.reload();
    }
  }, [shouldReload]);

  const columns: ColumnDef<Game>[] = [
    {
      id: 'sn',
      header: 'S/N',
      cell: (info) => (currentPage - 1) * pageSize + info.row.index + 1,
    },
    {
      accessorKey: "team.name",
      header: "Team 1",
      cell: (info) => (String(info.getValue()))
    },
    {
      accessorKey: "opponent.name",
      header: "Team 2",
      cell: (info) => (String(info.getValue()))
    },
    {
      accessorKey: "stadium",
      header: "Stadium",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: (info) => (String(info.getValue())),
    },
    {
      accessorKey: "finalResult.team1Score",
      header: "T1 score",
      cell: (info) => {
        const team1Score = info.row.original.finalResult?.team1Score;
        return team1Score ? String(team1Score) : 'upcoming';
      },
    },
    {
      accessorKey: "finalResult.team2Score",
      header: "T2 score",
      cell: (info) => {
        const team2Score = info.row.original.finalResult?.team2Score;
        return team2Score ? String(team2Score) : 'upcoming';
      },
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

           {/* ADD GAME RESULT */}
           <CopyPlus
            className="text-orange-600 cursor-pointer w-5 h-5"
            onClick={() => openResultDialog(info.row.original)} 
          />

          {/* ADD PLAYER GAME RESULT */}
          <Dribbble
            className="text-zinc-400 cursor-pointer w-5 h-5"
            onClick={() => openPlayerResultDialog(info.row.original)} 
          />

          <Camera
            className="text-zinc-400 cursor-pointer w-5 h-5"
            onClick={() => openMediaDialog(info.row.original)} 
          />

          <Atom
            className="text-zinc-400 cursor-pointer w-5 h-5"
            onClick={() => openPlayerResultDialog2(info.row.original)} 
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
        </div>
      ),
    },
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
        <p className='text-zinc-200 font-semibold text-xl'>All Games</p>
        <Button className='dashboard-button-gradient hover:bg-orange-600' onClick={() => openGameForm('add')}>Add New Game</Button>
      </div>
      <div>
        <Card className="bg-[rgb(36,36,36)] border-0">
          <CardHeader>
          </CardHeader>
          <CardContent className="flex flex-col space-y-5 mb-[3rem]">
            <DataTable columns={columns} data={getAllGamesData?.matches || []} />
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

      {resultDialogOpen && (
        <GameResult
          isOpen={resultDialogOpen}
          onClose={closeResultDialog}
          resultInfo={resultDialogInfo}
          refetchGames={refetchGames}
        />
      )}

      {playerResultDialogOpen && (
        <PlayerResult
          isOpen={playerResultDialogOpen}
          onClose={closePlayerResultDialog}
          resultInfo={resultDialogInfo}
          refetchGames={refetchGames}
        />
      )}

      {playerResultDialogOpen2 && (
        <PlayerResult2
          isOpen={playerResultDialogOpen2}
          onClose={closePlayerResultDialog2}
          resultInfo={resultDialogInfo2}
          refetchGames={refetchGames}
        />
      )}

      {mediaDialogOpen && (
        <UploadGameMedia
          isOpen={mediaDialogOpen}
          onClose={closeMediaDialog}
          resultInfo={resultDialogInfo}
          refetchGames={refetchGames}
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
    </MaxWidthWrapper>
  )
}

const GameForm = ({ isOpen, onClose, refetchGames, operation, gameInfo, gameFormOperation }: GameFormDialogProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTeam, setSelectedTeam] = useState<{ value: string, label: string } | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const {
    data: getAllTeamsData
  } = useSWR(
    selectedGender ? [`Endpoint`, selectedGender] : null,
    () => fetchTeams(Endpoint, selectedGender),
    { shouldRetryOnError: false, revalidateOnFocus: true } 
  );

  async function fetchTeams(Endpoint: any, selectedGender: string | null) {
 
    try {
      const url = `${Endpoint.GET_ALL_TEAM}?gender=${selectedGender}`;

      const response = await axios.get(url);
      const payload = response.data;
      if (payload && payload.status == "suceess") {
        return payload.data
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
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
      gender: gameInfo?.gender || "",
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
              className="grid grid-cols-2 gap-x-5 mt-5 bg-[rgb(36,36,36)] border border-gray-800 p-10 w-[35rem] h-[40rem] overflow-y-auto scrollbar-hide"
            >
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Game form</div>
              <div className='flex flex-col space-y-5'>

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
                              // onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                              onChange={(selectedOption) => {
                                const foundOption = genderOptions.find(option => option.value === gameInfo?.gender);
                                if (foundOption) {
                                  field.onChange(foundOption.value);
                                } else {
                                  field.onChange(selectedOption?.value)
                                }
                              }}
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
                            value={selectOptions?.find((option: { value: string }) => option.value === gameInfo?.team.id)}
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

              </div>

              <div className='flex flex-col space-y-5'>

                <div className="">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full flex flex-col">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Date</FormLabel>
                        <FormControl className='mt-[0.6rem]'>
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
                            value={selectOptions?.find((option: { value: string }) => option.value === gameInfo?.opponent.id)}
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
                      <FormItem className="w-full flex flex-col my-2">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Time</FormLabel>
                        <FormControl>
                          <ReactDatePicker
                            selected={field.value ? new Date(`2024-01-01T${field.value}`) : null}
                            onChange={(date) => {
                              if (date) {
                                const adjustedDate = new Date(date.getTime() + 3600000);
                            
                                const isoString = adjustedDate.toISOString();
                                const time = isoString.split('T')[1].substring(0, 5);
                            
                                form.setValue('time', time);
                              } else {
                                form.setValue('time', '');
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15} // Interval of time selection options in minutes
                            timeCaption="Time"
                            dateFormat="HH:mm" // 24-hour format
                            className={`${
                              error ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none flex h-10 w-full rounded-md border bg-[rgb(20,20,20)] px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none text-white`}
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

const GameResult = ({ isOpen, onClose, resultInfo, refetchGames }: ResultFormDialogProps) => {

  type ScoreFields = {
    [key: string]: string;
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultScores: ScoreFields = {
    team1_score1: "",
    team1_score2: "",
    team1_score3: "",
    team1_score4: "",
    team2_score1: "",
    team2_score2: "",
    team2_score3: "",
    team2_score4: "",
  };

  if (resultInfo && resultInfo.quarterResult) {
    resultInfo?.quarterResult?.forEach((result: any, index: any) => {
      defaultScores[`team1_score${index + 1}`] = result.team1Score.toString();
      defaultScores[`team2_score${index + 1}`] = result.team2Score.toString();
    });
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof resultSchema>>({
    resolver: zodResolver(resultSchema),
    defaultValues: defaultScores,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof resultSchema>) {

    const formattedSubmission = {
      quarter1: {
        team1_score: Number(values.team1_score1),
        team2_score: Number(values.team2_score1),
      },
      quarter2: {
        team1_score: Number(values.team1_score2),
        team2_score: Number(values.team2_score2),
      },
      quarter3: {
        team1_score: Number(values.team1_score3),
        team2_score: Number(values.team2_score3),
      },
      quarter4: {
        team1_score: Number(values.team1_score4),
        team2_score: Number(values.team2_score4),
      },
    };

    try {
      setIsLoading(true)

      const gameId = resultInfo?.game_id; // Extract the game_id
      const endpointUrl = `${Endpoint.UPLOAD_GAME_RESULT}/${gameId}`;

      const response = await axios.put(endpointUrl, formattedSubmission);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message, {
          duration: 5000,
        })

        form.reset();
        refetchGames();
        
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
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Upload Game Result</div>
              <div className='flex flex-col space-y-5'>

                <div className="">
                  <FormField
                    control={form.control}
                    name="team1_score1"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 1 score (1st quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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
                    name="team1_score2"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 1 score (2nd quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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
                    name="team1_score3"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 1 score (3rd quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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
                    name="team1_score4"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 1 score (4th quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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

                <div className="">
                  <FormField
                    control={form.control}
                    name="team2_score1"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 2 score (1st quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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
                    name="team2_score2"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 2 score (2nd quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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
                    name="team2_score3"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 2 score (3rd quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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
                    name="team2_score4"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Team 2 score (4th quarter)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
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

const PlayerResult = ({ isOpen, onClose, resultInfo, refetchGames}: ResultFormDialogProps) => {

  let selectOptions: { value: string; label: string }[] = [];
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<{ value: string, label: string } | null>(null);
  const [players, setPlayers] = useState<Array<{ value: string, label: string }>>([]);

  const fetchPlayers = async (teamId: string) => {
    try {
      const response = await axios.get(`${Endpoint.GET_PLAYER_FOR_RESULT}/${teamId}/${resultInfo?.game_id}`);
      const payload = response.data;
      if (payload && payload.status === "success") {
        const playerOptions = payload.data.players?.resultNotUploaded.map((player: Player) => ({
          value: player._id,
          label: player.name
        }));
        setPlayers(playerOptions);
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Unable to fetch players");
    }
  };

  if (resultInfo?.opponent) {
    selectOptions.push({
      value: resultInfo.opponent.id || "",
      label: resultInfo.opponent.name || ""
    });
  }

  if (resultInfo?.team) {
    selectOptions.push({
      value: resultInfo.team.id || "",
      label: resultInfo.team.name || "",
    });
  }

  const handleSelectChange = (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      setSelectedTeam(selectedOption);
      form.setValue('team_id', selectedOption.value);
      fetchPlayers(selectedOption?.value);
    } else {
      setSelectedTeam(null);
      form.setValue('team_id', '');
      setPlayers([]);
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
  const form = useForm<z.infer<typeof playerResultSchema>>({
    resolver: zodResolver(playerResultSchema),
    defaultValues: {
      team_id: "",
      player_id: "",
      minute_played: "",
      two_points_attempted: "",
      two_points_made: "",
      three_points_attempted: "",
      three_points_made: "",
      free_throw_attempted: "",
      free_throw_made: "",
      offensive_rebounds: "",
      defensive_rebounds: "",
      assists: "",
      turnovers: "",
      steals: "",
      blocks: "",
      fouls: "",
      efficiency: ""  
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof playerResultSchema>) {

    const submissionData = {
      ...values,
    };

    try {
      setIsLoading(true)

      const gameId = resultInfo?.game_id; // Extract the game_id
      const endpointUrl = `${Endpoint.UPLOAD_PLAYER_RESULT}/${gameId}`;

      const response = await axios.post(endpointUrl, submissionData);
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
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Upload Player Stats</div>
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
                              value={selectOptions?.find((option: { value: string }) => option.value === resultInfo?.team.name)}
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
                      name="minute_played"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Minute Played</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="two_points_attempted"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Two points attempted</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="three_points_attempted"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Three points attempted</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="free_throw_attempted"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Free throws attempted</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="offensive_rebounds"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Offensive Rebound</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="assists"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Assists</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="turnovers"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Turnovers</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="fouls"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Fouls</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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

                  <div className="">
                    <FormField
                      control={form.control}
                      name="player_id"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Player</FormLabel>
                          <FormControl>
                            <Select
                              options={players}  
                              value={players.find(player => player.value === field.value)}
                              onChange={(selectedOption) => {
                                form.setValue('player_id', selectedOption?.value || '')
                              }}
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
                      name="efficiency"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">+/-</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="two_points_made"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Two points made</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="three_points_made"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Three points made</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="free_throw_made"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Free throws made</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="defensive_rebounds"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Defensive Rebound</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="blocks"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Blocks</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="steals"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Steals</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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

const PlayerResult2 = ({ isOpen, onClose, resultInfo, refetchGames}: ResultFormDialogProps) => {

  let selectOptions: { value: string; label: string }[] = [];
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<{ value: string, label: string } | null>(null);
  const [players, setPlayers] = useState<Array<{ value: string, label: string }>>([]);

  const fetchPlayers = async (teamId: string) => {
    try {
      const response = await axios.get(`${Endpoint.GET_PLAYER_FOR_RESULT}/${teamId}/${resultInfo?.game_id}`);
      const payload = response.data;
      if (payload && payload.status === "success") {
        const playerOptions = payload.data.players?.resultUploaded.map((player: Player) => ({
          value: player._id,
          label: player.name
        }));
        setPlayers(playerOptions);
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Unable to fetch players");
    }
  };

  // const selectOptions = getAllTeamsData?.teams?.map((team: Team) => ({
  //   value: team._id,
  //   label: team.name
  // }));

  if (resultInfo?.opponent) {
    selectOptions.push({
      value: resultInfo.opponent.id || "",
      label: resultInfo.opponent.name || ""
    });
  }

  if (resultInfo?.team) {
    selectOptions.push({
      value: resultInfo.team.id || "",
      label: resultInfo.team.name || "",
    });
  }

  const handleSelectChange = (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      setSelectedTeam(selectedOption);
      form.setValue('team_id', selectedOption.value);
      fetchPlayers(selectedOption?.value);
    } else {
      setSelectedTeam(null);
      form.setValue('team_id', '');
      setPlayers([]);
    }
  };

  const handlePlayerSelectChange = async (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      const playerId = selectedOption.value;
      form.setValue('player_id', playerId);

      const gameId = resultInfo?.game_id;
      
      if (gameId && playerId) {
        try {
          const response = await axios.get(`${Endpoint.GET_PLAYER_STAT}/${gameId}/${playerId}`);
          const playerGameResult = response.data;
          
          if (playerGameResult && playerGameResult.status === "success") {
            // Example: Populate the form with the fetched data
            form.setValue('minute_played', playerGameResult.data.minute_played);
            form.setValue('efficiency', playerGameResult.data.efficiency);
            form.setValue('two_points_attempted', playerGameResult.data.two_points_attempted);
            form.setValue('two_points_made', playerGameResult.data.two_points_made);
            form.setValue('three_points_attempted', playerGameResult.data.three_points_attempted);
            form.setValue('three_points_made', playerGameResult.data.three_points_made);
            form.setValue('free_throw_attempted', playerGameResult.data.free_throw_attempted);
            form.setValue('free_throw_made', playerGameResult.data.free_throw_made);
            form.setValue('offensive_rebounds', playerGameResult.data.offensive_rebounds);
            form.setValue('defensive_rebounds', playerGameResult.data.defensive_rebounds);
            form.setValue('assists', playerGameResult.data.assists);
            form.setValue('blocks', playerGameResult.data.blocks);
            form.setValue('turnovers', playerGameResult.data.turnovers);
            form.setValue('steals', playerGameResult.data.steals);
            form.setValue('fouls', playerGameResult.data.fouls);
  
          } else {
            toast.error(playerGameResult.message || "Failed to fetch player game results");
          }
        } catch (error) {
          toast.error("Unable to fetch player game results");
        }
      }
    } else {
      // Reset or clear specific fields in the form as needed
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
  const form = useForm<z.infer<typeof playerResultSchema>>({
    resolver: zodResolver(playerResultSchema),
    defaultValues: {
      team_id: "",
      player_id: "",
      minute_played: "",
      two_points_attempted: "",
      two_points_made: "",
      three_points_attempted: "",
      three_points_made: "",
      free_throw_attempted: "",
      free_throw_made: "",
      offensive_rebounds: "",
      defensive_rebounds: "",
      assists: "",
      turnovers: "",
      steals: "",
      blocks: "",
      fouls: "",
      efficiency: ""  
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof playerResultSchema>) {

    const submissionData = {
      ...values,
    };

    try {
      setIsLoading(true)

      const gameId = resultInfo?.game_id; // Extract the game_id
      const endpointUrl = `${Endpoint.EDIT_PLAYER_RESULT}/${gameId}`;

      const response = await axios.post(endpointUrl, submissionData);
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
              <div className='col-span-2 mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5'>Edit Player Stats</div>
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
                              value={selectOptions?.find((option: { value: string }) => option.value === resultInfo?.team.name)}
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
                      name="minute_played"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Minute Played</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="two_points_attempted"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Two points attempted</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="three_points_attempted"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Three points attempted</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="free_throw_attempted"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Free throws attempted</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="offensive_rebounds"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Offensive Rebound</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="assists"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Assists</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="turnovers"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Turnovers</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="fouls"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Fouls</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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

                  <div className="">
                    <FormField
                      control={form.control}
                      name="player_id"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Player</FormLabel>
                          <FormControl>
                            <Select
                              options={players}  
                              value={players.find(player => player.value === field.value)}
                              onChange={handlePlayerSelectChange}
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
                      name="efficiency"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">+/-</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="two_points_made"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Two points made</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="three_points_made"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Three points made</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="free_throw_made"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Free throws made</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="defensive_rebounds"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Defensive Rebound</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="blocks"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Blocks</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="steals"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Steals</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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

const UploadGameMedia = ({ isOpen, onClose, resultInfo, refetchGames}: ResultFormDialogProps) => {

  let selectOptions: { value: string; label: string }[] = [];
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<{ value: string, label: string } | null>(null);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string>("");
  const [players, setPlayers] = useState<Array<{ value: string, label: string }>>([]);
  // const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null); // New state for media type
  const [mediaCount, setMediaCount] = useState<number>(0);

  const fetchPlayers = async (teamId: string) => {
    try {
      const response = await axios.get(`${Endpoint.GET_PLAYERS_PER_TEAM}/${teamId}`);
      const payload = response.data;
      if (payload && payload.status === "success") {
        const playerOptions = payload.data.players.map((player: Player) => ({
          value: player._id,
          label: player.name
        }));
        setPlayers(playerOptions);
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch (error) {
      toast.error("Unable to fetch players");
    }
  };

  const handleSelectChange = (selectedOption: SingleValue<{ value: string, label: string }>, actionMeta: ActionMeta<{ value: string, label: string }>) => {
    if (selectedOption) {
      setSelectedTeam(selectedOption);
      form.setValue('team_id', selectedOption.value);
      fetchPlayers(selectedOption?.value);
    } else {
      setSelectedTeam(null);
      form.setValue('team_id', '');
      setPlayers([]);
    }
  };

  const handleMediaTypeChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setSelectedMediaType(selectedOption.value);
      // Additional logic based on the selected media type, if needed
    } else {
      setSelectedMediaType(null);
      // Additional logic for handling unselecting media type
    }
  };
  
  if (resultInfo?.opponent) {
    selectOptions.push({
      value: resultInfo.opponent.id || "",
      label: resultInfo.opponent.name || ""
    });
  }

  if (resultInfo?.team) {
    selectOptions.push({
      value: resultInfo.team.id || "",
      label: resultInfo.team.name || "",
    });
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof mediaSchema>>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      team_id: "",
      player_id: [],
      media_type: "",
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof mediaSchema>) {

    const { team_id, player_id, media_type } = values;

    const submissionData = {
      team_id,
      players: player_id,
      media_type,
      media_url: media_type === "video" ? [videoUrls] : mediaUrls,
    };

    try {
      setIsLoading(true)

      const gameId = resultInfo?.game_id;
      const endpointUrl = `${Endpoint.UPLOAD_MEDIA}/${gameId}`;

      const response = await axios.post(endpointUrl, submissionData);
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
              className="mt-5 bg-[rgb(36,36,36)] border border-gray-800 p-10 w-[35rem] h-[30rem] overflow-y-auto scrollbar-hide"
            >
              <div className='mx-auto text-3xl text-zinc-200 italic font-semibold uppercase mb-5 text-center'>Upload Game Media</div>
                <div className='flex flex-col space-y-5'>

                  {/* <div className="">
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
                  </div> */}

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
                              value={selectOptions?.find((option: { value: string }) => option.value === resultInfo?.team.name)}
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
                      name="player_id"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Player</FormLabel>
                          <FormControl>
                            <Select
                              options={players}  
                              value={players.filter(player => field.value.includes(player.value))}
                              onChange={(selectedOptions) => {
                                const selectedValues: any = Array.isArray(selectedOptions)
                                  ? selectedOptions.map(option => option.value)
                                  : selectedOptions?.value
                                  ? [selectedOptions.value]
                                  : [];
                                form.setValue('player_id', selectedValues || []);
                              }}
                              isMulti={true as any}
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
                      name="media_type"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Media Type</FormLabel>
                          <FormControl>
                            <Select
                              options={[
                                { value: 'picture', label: 'Image' },
                                { value: 'video', label: 'Video' },
                              ]}
                              value={field.value ? { value: field.value, label: field.value } : null}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value);
                                handleMediaTypeChange(selectedOption);
                              }}
                              className="bg-[rgb(20,20,20)] text-white"
                              styles={customStyles}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {selectedMediaType === 'picture' && (
                    <div className="flex items-center justify-around">
                      <div className="w-[9rem]">
                        <Label className="text-zinc-200 font-light">Image Upload</Label>
                        <UploadButton
                          className="mt-4 ut-button:bg-orange-600 ut-button:ut-readying:bg-orange-500/50"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res.length > 0) {
                              setMediaUrls((prevUrls) => [...prevUrls, res[0].url]);
                              setMediaCount((prevCount) => prevCount + 1);
                              // setMediaUrls(res[0].url);
                            }
                            toast.success('Upload Completed');
                          }}
                          onUploadError={(error: Error) => {
                            // Do something with the error.
                            toast.error(`Error uploading file`);
                          }}
                        />
                        <p className="text-zinc-200 mt-2">{`Images uploaded: ${mediaCount}`}</p>
                      </div>
                    </div>
                  )}

                  {selectedMediaType === 'video' && (
                    <div className="flex items-center justify-around">
                      <div className="w-full">
                        <Label className="text-zinc-200 font-light">Video URL</Label>
                        <Input
                          className="mt-4 ut-button:bg-orange-600 ut-button:ut-readying:bg-orange-500/50"
                          name="videoUrl" // You may need to update this based on your form structure
                          placeholder="Enter YouTube URL"
                          onChange={(e) => {
                            // Handle changes to video URL
                            const url = e.target.value;
                            setVideoUrls(url)
                            // Additional logic for handling video URL
                          }}
                        />
                      </div>
                    </div>
                  )}

                </div>

                <Button 
                  className="bg-orange-500 w-full mt-10 h-[3.5rem] hover:bg-orange-600" 
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

    if (!gameInfo) {
      toast.error("Game information is missing for delete operation");
      return;
    }

    const endpoint = `${Endpoint.DELETE_GAME}/${gameInfo?.game_id}`;

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
      onClose();
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
            <p>Are you sure you want to delete this game record: {gameInfo?.team.name}</p>
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
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-zinc-400 hover:text-white"
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