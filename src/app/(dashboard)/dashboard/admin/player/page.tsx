'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Button from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from '@/util/axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import { UploadButton } from '@/util/uploadthing'

interface Team {
  _id: string;
  name: string;
  // other fields...
}

const formSchema = z.object({
  team_id: z.string().min(2, { message: "First name must be at least 2 characters." }),
  position: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  weight: z.string().min(2, { message: "Invalid email address." }),
  jersey_number: z.string().optional(),
  nationality: z.string().min(2, { message: "State must be at least 2 characters." }),
  date_of_birth: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
  wingspan: z.string().optional(),
  name: z.string().optional(),
  height: z.string().optional(),
  dob: z.string().optional(),
  // phone_number: z.string().min(6, { message: "Password must be at least 6 characters." }),
  scout_grade: z.string().optional(),
})

const page = () => {

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

  const selectOptions = getAllTeamsData?.map((team: Team) => ({
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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team_id: "",
      position: "",
      weight: "",
      jersey_number: "",
      nationality: "",
      wingspan: "",
      name: "",
      height: "",
      date_of_birth: "",
      // phone_number: "",
      scout_grade: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
      avatar: logoUrl,
    };

    try {
      setIsLoading(true)

      const response = await axios.post(Endpoint.ADD_PLAYERS, submissionData);
      const payload = response?.data;
      console.log("payload", payload)

      if (payload && payload.status == "success") {
        toast.success(payload.data.message, {
          duration: 5000,
      })
        
      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch(error: any) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10'>
        <p className='text-zinc-200 font-semibold text-xl'>Add New Player</p>
        <Button className='bg-orange-500 hover:bg-orange-600'>Add Multiple Players</Button>
      </div>
      <div>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="grid grid-cols-2 gap-x-5 mt-5 mb-[10rem]"
          >
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
                          value={selectedTeam}
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
                      <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Weight</FormLabel>
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

              <div className="">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Height</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Height"
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
                  name="wingspan"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold text-xs uppercase text-zinc-200">Wingspan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Wingspan"
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
      </div>
    </MaxWidthWrapper>
  )
}

export default page