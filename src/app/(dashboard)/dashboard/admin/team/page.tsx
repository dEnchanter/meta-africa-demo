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
import { z } from 'zod'
import toast from 'react-hot-toast'
import { UploadButton } from '@/util/uploadthing'

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  founded_year: z.string().min(2, { message: "Founded year must be at least 2 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  home_stadium: z.string().min(2, { message: "Home Stadium must be at least 2 characters." }),
})

const Page = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [logoUrl, setLogoUrl] = useState('')

  // const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      founded_year: "",
      city: "",
      home_stadium: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    const submissionData = {
      ...values,
      logo_url: logoUrl, // Add the logo URL to the submission data
    };

    try {
      setIsLoading(true)

      const response = await axios.post(Endpoint.ADD_TEAM, submissionData);
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
        <p className='text-zinc-200 font-semibold text-xl'>Add New Team</p>
        <Button className='bg-orange-500 hover:bg-orange-600'>Add Multiple Teams</Button>
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