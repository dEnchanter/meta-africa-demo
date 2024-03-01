"use client"

import { useUser } from '@/hooks/auth';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const DashboardBanner = () => {

  const [delayedRender, setDelayedRender] = useState(false);

  const {
    user,
    userIsLoading,
  } = useUser({
    redirectTo: "/login",
  });

  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setDelayedRender(true);
    }, 1000);

    return () => clearTimeout(delayTimeout);
  }, []);

  if (userIsLoading || !delayedRender) {
    return (
      <div>
        <Skeleton count={1} height={200} baseColor={"#bcbcbc"} />
      </div>
    )
  }

  if (!user) {
    return (
      <div>
        <Skeleton count={1} height={200} baseColor={"#bcbcbc"} />
      </div>
    )
  }

  return (
    <div className='w-full -my-[6rem]'>
      <Image 
        src={user.data.preference === 'male' ? "/men.png" : "/women.png"}
        alt='Banner'
        height={100}
        width={1000}
      />
    </div>
  )
}

export default DashboardBanner