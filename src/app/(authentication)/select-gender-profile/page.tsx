'use client'

import Footer from '@/components/Footer'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Endpoint } from '@/util/constants'
import axios from '@/util/axios'
import Image from 'next/image'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const Page = () => {
  
  const [isLoadingMale, setIsLoadingMale] = useState<boolean>(false);
  const [isLoadingFemale, setIsLoadingFemale] = useState<boolean>(false)
  const router = useRouter();

  const handleMaleClick = async () => {
    setIsLoadingMale(true);
    try {
      const response = await axios.post(Endpoint.SET_PREFERENCE, {
        preference: "male",
      });
      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message)
        router.push('/dashboard/overview');        
      }
    } catch (error) {
      toast.error('Error setting preference!');
    } finally {
      setIsLoadingMale(false);
    }
  };

  const handleFemaleClick = async () => {
    setIsLoadingFemale(true);
    try {
      const response = await axios.post(Endpoint.SET_PREFERENCE, {
        preference: "female",
      });

      const payload = response?.data;

      if (payload && payload.status == "success") {
        toast.success(payload.message)
        router.push('/dashboard/overview');        
      }
    } catch (error) {
      toast.error('Error setting preference!');
    } finally {
      setIsLoadingFemale(false);
    }
  };

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
            <h1 className='uppercase font-semibold text-2xl mt-5'>Select Gender to view</h1>
          </div>
        
          <MaxWidthWrapper className='mt-5 mb-[7rem] text-center lg:text-left flex flex-col space-y-10'>
            <Button 
              className='dashboard-button-gradient hover:bg-orange-400 p-7' 
              onClick={handleMaleClick}
              isLoading={isLoadingMale}>
                Male
            </Button>
            <Button 
              className='dashboard-button-gradient2 hover:bg-orange-600 p-7' 
              onClick={handleFemaleClick}
              isLoading={isLoadingFemale}>
                Female
            </Button>
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