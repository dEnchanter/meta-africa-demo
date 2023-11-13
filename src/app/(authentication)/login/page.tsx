'use client'

import Footer from '@/components/Footer'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  userName: z.string().min(2, {
    message: "username must be at least 4 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  })
})

const Page = () => {

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }


  return (
    <div className='h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-2'>

        <div className='-ml-7 hidden lg:flex lg:flex-1'>
          <Image
            src={'/basketball-login.jpg'}
            alt='login image'
            width={6720}
            height={4480}
            objectFit=''
          />
        </div>

        <div className='flex flex-col items-center justify-start mt-10'>

          <div className='flex flex-col items-center space-y-1'>
            <Image
              src="/meta-africa-logo.png"
              width={50}
              height={50}
              alt="meta-africa-logo"
              className="cursor-pointer object-contain mb-7"
            />
            <h1 className='uppercase font-semibold text-2xl mt-5'>Welcome back</h1>
            <p className='font-light'>Welcome back! Please enter your details</p>
          </div>
        
          <MaxWidthWrapper className='mb-[7rem]'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col w-full mt-5">
                
                <div className="">
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-light">USERNAME</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Arthur" 
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-light">PASSWORD</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Curry" 
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between items-center space-x-2">
                  <div className='flex items-center space-x-2'>
                    <Switch />
                    <p className="text-xs font-light">Remember Me</p>
                  </div>
                  <div className='text-xs font-semibold text-orange-500'>
                    <Link href={'#'}>Forgot Password</Link>
                  </div>
                </div>

                <Button className="bg-orange-500" type="submit">Login</Button>
              </form>
            </Form>
            <div className='mt-5 w-full'>
              <p className='uppercase text-xs text-center font-semibold'>Don't have an account? <span className='text-orange-500'>Sign up</span></p>
            </div>
          </MaxWidthWrapper>
          

        </div>
      </div>
      <div className='-mt-10'>
        <Footer />
      </div>
    </div>
  )
}

export default page