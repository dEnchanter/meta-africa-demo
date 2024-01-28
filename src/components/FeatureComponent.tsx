import Image from 'next/image';
import React from 'react';

interface FeatureComponentProps {
  iconSrc: string;
  title: string;
  paragraph: string;
}

const FeatureComponent: React.FC<FeatureComponentProps> = ({ iconSrc, title, paragraph }) => {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex space-x-2 items-center justify-start">
        <div className="relative w-6 h-6"> {/* Adjust width and height as needed */}
          <Image 
            src={iconSrc}
            alt={title}
            layout="fill"
            objectFit="contain" // This will ensure the image is scaled correctly within the div
          />
        </div>
        <p className='uppercase font-semibold'>{title}</p>
      </div>
      <div>
        <h1 className="text-md font-light max-w-xs">{paragraph}</h1>
      </div>
    </div>
  );
}

export default FeatureComponent;