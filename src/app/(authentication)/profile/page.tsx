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
import React, { useEffect, useState } from 'react'
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
import { useUser } from '@/hooks/auth'

type OptionType = {
  label: string;
  value: string;
};

const formSchema = z.object({
  country: z.string().optional(),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  birth_year: z.string().refine((val) => {
    const parsedDate = new Date(val);
    return !isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(val);
  }, { message: "Invalid date format." }),
  institution: z.string().optional(),
  phone_number: z.string().regex(/^\+\d{1,3}\s?\d{4,14}$/, {
    message: "Invalid phone number format, Add country code",
  }),
  address: z.string().min(2, { message: "Address must be at least 2 characters." }),
})

const Page = () => {

  const {
    user,
  } = useUser({
    redirectTo: "/login",
  });

  console.log("user", user)

  const [activeButton, setActiveButton] = useState('scout');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [country, setCountry] = useState<OptionType | null>(null);
  const options = countryList().getData();

  const router = useRouter();
  

  const changeHandler = (option: OptionType | null) => {
    setCountry(option);
    form.setValue('country', option ? option.label : '');
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: user?.data?.phone_number || "",
      country: "",
      state: "",
      birth_year: "",
      institution: user?.data?.user_type || "",
    },
  })

  useEffect(() => {
    if (user?.data?.phone_number) {
      form.setValue('phone_number', user.data.phone_number);
    }
    if (user?.data?.institution) {
      form.setValue('institution', user.data.institution);
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {

    const birthYearAsNumber = values.birth_year ? parseInt(values.birth_year.split('-')[0], 10) : undefined;

    const submissionData = {
      ...values,
      birth_year: birthYearAsNumber,
      user_type: activeButton,
      address: "11 Oyesiku street" // Add the address field here
    };

    try {
      setIsLoading(true)

      const response = await axios.post(Endpoint.REGISTER, submissionData);
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.data.message, {
          duration: 5000,
        });
        
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
                <h1 className='uppercase font-semibold text-2xl mt-5 text-center'>Upload your Details</h1>
                <p className='font-light'>Welcome to Meta Africa! Please complete your profile update</p>
              </div>
          </div>
        
          <MaxWidthWrapper className='mb-[7rem] md:px-5'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-5 mt-5">
                <div className='flex flex-col space-y-7'>

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

                  <div className="">
                    <FormField
                      control={form.control}
                      name="birth_year"
                      render={({ field, fieldState: { error } }) => (
                        <FormItem className="w-full flex flex-col">
                          <FormLabel className="font-semibold text-xs uppercase">Date of Birth</FormLabel>
                          <FormControl className='mt-[0.45rem]'>
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
                  </div>

                  {user?.data?.user_type !== 'player' && (
                    <div className="">
                      <FormField
                        control={form.control}
                        name="institution"
                        render={({ field, fieldState: { error } }) => (
                          <FormItem className="w-full">
                            <FormLabel className="font-semibold text-xs uppercase">Institution</FormLabel>
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
                    </div>
                  )}
                </div>

                <div className='flex flex-col space-y-7'>

                  <div className="">
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
                  </div>

                  <div className="">
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

                </div>

                <Button 
                  className="dashboard-button-gradient col-span-2 mt-10 h-[3rem]" 
                  type="submit"
                  isLoading={isLoading} 
                >
                    SUBMIT
                </Button>
                
              </form>
            </Form>
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