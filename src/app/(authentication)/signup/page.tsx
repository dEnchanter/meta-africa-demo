'use client'

import Footer from '@/components/Footer'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import axios from '@/util/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Select from 'react-select';
import countryList from 'react-select-country-list';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Endpoint } from '@/util/constants'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type OptionType = {
  label: string;
  value: string;
};

const formSchema = z.object({
  firstname: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastname: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  // country: z.string().optional(),
  // state: z.string().min(2, { message: "State must be at least 2 characters." }),
  // birth_year: z.string().refine((val) => {
  //   const parsedDate = new Date(val);
  //   return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  // }, { message: "Invalid date format." }),
  // institution: z.string().optional(),
  team: z.string().optional(),
  phone_number: z.string().regex(/^\+\d{1,3}\s?\d{4,14}$/, {
    message: "Invalid phone number format, Add country code",
  }),
  // address: z.string().min(2, { message: "Address must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirm_password: z.string().min(6, { message: "Confirm password must be at least 6 characters." }),
})

const Page = () => {

  const [activeButton, setActiveButton] = useState('scout');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [country, setCountry] = useState<OptionType | null>(null);
  const options = countryList().getData();

  const router = useRouter();
  

  // const changeHandler = (option: OptionType | null) => {
  //   setCountry(option);
  //   form.setValue('country', option ? option.label : '');
  // };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      // country: "",
      // state: "",
      // birth_year: "",
      // institution: "",
      // team: "",
    },
  })

 // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    // const birthYearAsNumber = values.birth_year ? parseInt(values.birth_year.split('-')[0], 10) : undefined;

    const submissionData = {
      ...values,
      // birth_year: birthYearAsNumber,
      user_type: activeButton,
      // address: "11 Oyesiku street" // Add the address field here
    };

    try {
      setIsLoading(true)

      const response = await axios.post(Endpoint.REGISTER, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.data.message, {
          duration: 5000,
        });

        // Store email in local storage
        localStorage.setItem('email', values.email);

        // Navigate to the account-verification page
        router.push('/account-verification');
        
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
    <div className='h-screen w-screen overflow-x-hidden'>
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
            <div className='lg:place-self-start lg:ml-10'>
              <Image
                src="/meta-africa-logo.png"
                width={50}
                height={50}
                alt="meta-africa-logo"
                className="cursor-pointer object-contain mb-7"
              />
            </div>

          <div className='flex flex-col items-center space-y-5'>
              <div>
                <h1 className='uppercase font-semibold text-2xl mt-5 text-center'>Sign Up</h1>
                <p className='font-light'>Welcome to Meta Africa! Please Sign up your details.</p>
              </div>

              <div className='flex space-x-5'>
                <Button 
                  variant="ghost" 
                  className={`uppercase min-w-[10rem] p-2 lg:min-w-[15rem] ${
                    activeButton === 'scout' ? 'bg-pink-500/20 text-red-500/70 hover:text-red-500/70 hover:bg-pink-500/40' : 'text-black'
                  }`} 
                  onClick={() => setActiveButton('scout')}
                >
                  Scout
                </Button>
                <Button 
                  variant="ghost" 
                  className={`uppercase min-w-[10rem] p-2 lg:min-w-[15rem] ${
                    activeButton === 'player' ? 'bg-pink-500/20 text-red-500/70 hover:text-red-500/70 hover:bg-pink-500/40' : 'text-black'
                  }`}
                  onClick={() => setActiveButton('player')}
                >
                  Player
                </Button>
              </div>
              
          </div>
        
          <MaxWidthWrapper className='mb-[7rem] md:px-5'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-5 mt-5">
                <div className='flex flex-col space-y-7'>
                  
                  <div className="">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase">First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter First Name"
                              className="w-full" 
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
                      name="phone_number"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase">Phone number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Phone Number" 
                              {...field}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* <div className="">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase">Country</FormLabel>
                          <FormControl>
                            <Select 
                              options={options} 
                              value={country}
                              onChange={changeHandler}
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
                      name="birth_year"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="font-semibold text-xs uppercase">Date of Birth</FormLabel>
                          <FormControl className='mt-[0.7rem]'>
                            <DatePicker
                              // {...field}
                              selected={startDate}
                              onChange={(date: Date) => {
                                setStartDate(date);
                                const formattedDate = date.toISOString().split('T')[0];
                                form.setValue('birth_year', formattedDate);
                              }}
                              maxDate={new Date()}
                              showYearDropdown
                              dropdownMode="select"
                              dateFormat="MMMM d, yyyy"
                              placeholderText="Select a date of birth"
                              className={`${
                                error ? 'border-red-500' : 'border-gray-300'
                              } focus:outline-none flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none`}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div> */}

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
                </div>

                <div className='flex flex-col space-y-7'>

                  <div>
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase">Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter Last Name" 
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
                          <FormLabel className="font-semibold text-xs uppercase">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Email" 
                              {...field}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* <div className="">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase">State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter State" 
                              {...field}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div> */}

                  {/* <div className="">
                    <FormField
                      control={form.control}
                      name={activeButton === 'player' ? "team" : "institution"}
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase">
                            {activeButton === 'player' ? "Team" : "Institution"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter ${activeButton === 'player' ? "Team" : "Institution"}`} 
                              {...field}
                            />
                          </FormControl>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div> */}

                  <div className="">
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-xs uppercase">Confirm Password</FormLabel>
                          <div className="relative"> {/* Wrapper div */}
                            <FormControl>
                              <Input
                                placeholder="Confirm Password" 
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...field}
                                className="pr-10" // Add right padding to make space for the icon
                              />
                            </FormControl>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                              {showConfirmPassword ? (
                                <EyeOffIcon className="h-5 w-5 text-gray-400" onClick={toggleConfirmPasswordVisibility} />
                              ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" onClick={toggleConfirmPasswordVisibility} />
                              )}
                            </div>
                          </div>
                          {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  className="dashboard-button-gradient col-span-2 mt-10 h-[3rem]" 
                  type="submit"
                  isLoading={isLoading} 
                >
                    SIGN UP
                </Button>
                
              </form>
            </Form>
            <div className='mt-5 w-full'>
              <p className='uppercase text-xs text-center font-semibold'>Already have an account? <span className='text-gradient2'><Link href="/login">LOG IN</Link></span></p>
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