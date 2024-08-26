import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React from 'react';
import * as z from 'zod';

import { Form, FormField } from 'components/shadcn/ui/form';
import { toast } from 'components/shadcn/ui/use-toast';
import { useDropzone } from 'react-dropzone';
import Icon from 'utils/Icon';
import { processError } from 'helper/error';
interface Iprops {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function UploadImageForm() {
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<any>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null); // New state for image URL
  const handleFileDrop = async (files: any) => {
    setUploading(true);
    setFile(files);
    const fileUrl = URL.createObjectURL(files);
    setImageUrl(fileUrl); // Store the URL in state

    const formdata = new FormData();
    formdata.append('file', files);

    try {
      console.log('====================================');
      console.log('file', files);
      console.log('====================================');
    } catch (error) {
      processError(error);
    }

    setUploading(false);
  };
  const onDrop = (acceptedFiles: any) => {
    handleFileDrop(acceptedFiles[0]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
  });

  return (
    <div>
      <section className=' rounded-xl    '>
        <section {...getRootProps()}>
          <input {...getInputProps()} />
          {imageUrl ? (
            <div className='relative h-[10rem] w-[10rem] rounded-full  hover:cursor-pointer'>
              <img
                src={imageUrl}
                alt='Selected'
                className=' h-full w-full rounded-full object-cover object-center '
              />{' '}
              {/* Display the selected image */}
              <div className='absolute bottom-[5%] right-0 h-fit rounded-full  bg-slate-100 p-2'>
                <Icon name='Camera' svgProp={{ className: 'w-6 h-6' }}></Icon>
              </div>
            </div>
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className='flex items-center justify-center gap-3 rounded-full border-2 border-dashed bg-gray-100 px-14 py-12 outline-dashed outline-2  outline-gray-500 hover:cursor-pointer'>
              <Icon name='Camera' svgProp={{ className: 'w-12' }}></Icon>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
