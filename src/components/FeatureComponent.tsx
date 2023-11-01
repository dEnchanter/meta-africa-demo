import Image from 'next/image';
import React from 'react';

interface FeatureComponentProps {
  icon: any;
  title: string;
  paragraph: string;
}

const FeatureComponent: React.FC<FeatureComponentProps> = ({ icon, title, paragraph }) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex space-x-2 items-center justify-start">
        <p>{icon}</p>
        <p className='uppercase font-semibold'>{title}</p>
      </div>
      <div>
        <h1 className="text-md font-light max-w-xs">{paragraph}</h1>
      </div>
    </div>
  );
}

export default FeatureComponent;