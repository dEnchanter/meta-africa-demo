'use client'

import Footer from '@/components/Footer'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Endpoint } from '@/util/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import axios from '@/util/axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  })
})

const Page = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {

    try {
      setIsLoading(true)

      const response = await axios.post(Endpoint.LOGIN, data);
      const payload = response?.data;
      // console.log("payload", payload)

      if (payload && payload.status == "success" && payload.data.user) {
        localStorage.setItem("token", payload.data.token);
        localStorage.setItem("firstname", payload.data.user.firstname);
        localStorage.setItem("lastname", payload.data.user.lastname)
        localStorage.setItem("email", payload.data.user.email);
        localStorage.setItem("user_type", payload.data.user.user_type);
        
        toast.success(payload.message)

        // Navigate to the account-verification page
        router.push('/select-gender-profile');
        
      } else if (payload && payload.status == "success" && payload.data.admin) {
        localStorage.setItem("token", payload.data.token);
        localStorage.setItem("firstname", payload.data.admin.firstname);
        localStorage.setItem("lastname", payload.data.admin.lastname)
        localStorage.setItem("email", payload.data.admin.email);
        localStorage.setItem("user_type", payload.data.admin.user_type);
        
        toast.success(payload.message)

        // Navigate to the account-verification page
        router.push('/dashboard/admin/player');

      } else if (payload && payload.status == "error") {
        toast.error(payload.message)
      }
    } catch(error: any) {
      // display error message to user
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-2'>

        <div className='-ml-7 hidden lg:flex lg:flex-1' style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={'/basketball-login.jpg'}
            alt='login image'
            layout="fill"
            objectFit="cover"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Arthur@gmail.com" 
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-xs uppercase">Password</FormLabel>
                        <div className="relative"> {/* Wrapper div */}
                          <FormControl>
                            <Input
                              placeholder="Enter Password" 
                              type={showPassword ? 'text' : 'password'}
                              {...field}
                              className="pr-10" // Add right padding to make space for the icon
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                            {showPassword ? (
                              <EyeOffIcon className="h-5 w-5 text-gray-400" onClick={togglePasswordVisibility} />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-400" onClick={togglePasswordVisibility} />
                            )}
                          </div>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
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

                <Button 
                  className="bg-orange-500" 
                  type="submit"
                  isLoading={isLoading} 
                >
                  Login
                </Button>
              </form>
            </Form>
            <div className='mt-5 w-full'>
              <p className='uppercase text-xs text-center font-semibold'>Don't have an account? <span className='text-orange-500'><Link href="signup">Sign up</Link></span></p>
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

export default Page