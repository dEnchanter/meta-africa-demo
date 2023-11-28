'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Button from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
// import { useRouter } from 'next/navigation'
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

interface Team {
  _id: string;
  name: string;
  // other fields...
}

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

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const Page = () => {

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      team_id: "",
      date_of_birth: "",
      gender: "",
      nationality: "",
      experience_years: "",
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

      const response = await axios.post(Endpoint.ADD_COACH, submissionData);
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
    }

  }

  return (
    <MaxWidthWrapper className='flex flex-col bg-[rgb(20,20,20)] h-screen overflow-y-auto scrollbar-hide'>
      <div className='flex items-center justify-between mt-10'>
        <p className='text-zinc-200 font-semibold text-xl'>Add New Coach</p>
        <Button className='bg-orange-500 hover:bg-orange-600'>Add Multiple Coaches</Button>
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
      </div>
    </MaxWidthWrapper>
  )
}

export default Page