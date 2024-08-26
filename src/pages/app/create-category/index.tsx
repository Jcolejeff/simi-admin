import { TabsContent } from 'components/shadcn/ui/tabs';
import { Button } from 'components/shadcn/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
  FormLabel,
} from 'components/shadcn/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/shadcn/ui/select';
import { Input } from 'components/shadcn/input';
import axiosInstance from 'services';
import { ChevronLeft, ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { cn, splitStringBySpaceAndReplaceWithDash } from 'lib/utils';
import { Checkbox } from 'components/shadcn/ui/checkbox';
import 'react-phone-input-2/lib/style.css';
import InlineLoader from 'components/Loaders/InlineLoader';
import useUserLocation from 'hooks/useUserLoction';
import { useEffect } from 'react';
import Icon from 'utils/Icon';
import { useNavigate } from 'react-router-dom';
import UploadImageForm from './UploadForm';
import SavePatientModal from 'components/modal/Patients/SavePatient';
import LinkPatientsModal from 'components/modal/Patients/LinkPatient';
import PI, { PhoneInputProps } from 'react-phone-input-2';
import API from 'services';
import toast from 'helper';
import Spinner from 'components/shadcn/ui/spinner';
import { processError } from 'helper/error';
import CONSTANTS from 'constant';
import { Switch } from 'components/shadcn/switch';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from 'firebase';
import { useDropzone } from 'react-dropzone';
import useStore from 'store';
import DeleteModal from 'components/modal/DeleteModal';

// fix for phone input build error
const PhoneInput: React.FC<PhoneInputProps> = (PI as any).default || PI;
interface Iprops {
  switchTab: (tab: string) => void;
  handleComplete: (tab: string) => void;
  data: string[];
  userInfo: any; // change to the right type
  handleUserInfo: (info: any) => void; // change to the right type
}
interface ErrorMessages {
  [key: string]: string[];
}

const FormSchema = z.object({
  categoryName: z.string().min(2, {
    message: 'Please enter a valid name',
  }),

  description: z.string().min(1, {
    message: 'Please enter a valid description',
  }),
});
const CreateCategory = () => {
  const { location } = useUserLocation();
  const { isEditing, editData, setEditData, setIsEditing } = useStore((state) => state);

  const navigate = useNavigate();
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<any>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(editData?.image || null); // New state for image URL

  const handleFileDrop = async (files: any) => {
    setFile(files);
    const fileUrl = URL.createObjectURL(files);
    setImageUrl(fileUrl); // Store the URL in state
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categoryName: editData?.name || '',
      description: editData?.desc || '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormIsLoading(true);
    let downloadURL = imageUrl;

    if (file) {
      const storageRef = ref(getStorage(), `categories/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      downloadURL = await getDownloadURL(snapshot.ref);
    }

    if (!downloadURL) {
      toast.error('Image is required.');
      setFormIsLoading(false);
      return;
    }

    try {
      const categoryData = {
        name: data.categoryName,
        desc: data.description,
        image: downloadURL,
        slug: splitStringBySpaceAndReplaceWithDash(data.categoryName),
      };

      if (isEditing && editData?.id) {
        const docRef = doc(db, 'categories', editData.id);
        await updateDoc(docRef, categoryData);
        toast.success('Category updated successfully');
      } else {
        const collectionRef = collection(db, 'categories');
        const docRef = doc(collectionRef);
        await setDoc(docRef, categoryData);
        toast.success('Category created successfully');
      }

      form.reset();
      setImageUrl(null);
      setFile(null);
      setIsEditing(false);
      navigate(-1);
    } catch (error) {
      processError(error);
      toast.error('An error occurred, please try again.');
    } finally {
      setFormIsLoading(false);
    }
  }

  return (
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col gap-8 px-container-base pb-[2.1rem] md:px-container-md'>
      <div className='mb-8 flex  w-full items-center justify-between gap-4 md:flex-row'>
        <div className='flex w-max cursor-pointer items-center gap-3 rounded-[8px] px-[2px]'>
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className='h-6 w-6 font-light' />
          </button>

          <InlineLoader isLoading={false}>
            <div className='hidden  flex-col gap-1  md:flex'>
              <h3 className=' text-base font-semibold md:text-xl'>
                {isEditing ? 'Edit Category' : 'Add Category'}
              </h3>
              <p className='text-[0.75rem] '>
                {isEditing
                  ? 'Edit the category details and click the save button to update the category'
                  : 'This will add a new category to your catalogue'}
              </p>
            </div>
          </InlineLoader>
        </div>

        <div className='flex  gap-4'>
          {isEditing && (
            <DeleteModal
              btnText='Delete Category'
              collectionName='categories'
              documentId={editData?.id}
            />
          )}
          <button
            onClick={() => navigate(-1)}
            className='group flex items-center justify-center gap-2 rounded-[5px] border   px-8   py-2 text-base font-semibold transition-all duration-300 ease-in-out hover:opacity-90'
          >
            <span className='text-xs font-[500] leading-[24px] tracking-[0.4px]  md:text-sm'>
              Cancel
            </span>
          </button>
        </div>
      </div>
      <div className='flex items-end justify-between'>
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'flex flex-col gap-8',
            formIsLoading && 'pointer-events-none cursor-not-allowed opacity-30',
          )}
        >
          <section className=' grid grid-cols-1 gap-8 md:max-w-[40%] md:gap-6   '>
            <FormField
              control={form.control}
              name='categoryName'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Category Name
                    </label>
                    <FormControl>
                      <Input
                        className='placeholder:t rounded-[8px] py-6 text-base placeholder:text-sm'
                        {...field}
                        type='text'
                        placeholder='Enter category name'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Category Description
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        type='text'
                        placeholder='Enter category description'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />
          </section>

          <button
            type='submit'
            className={cn(
              `group flex w-fit items-center justify-center gap-2 rounded-lg bg-primary-1 px-4 py-3 transition-all duration-300 ease-in-out hover:opacity-90 xm:px-6 xm:py-3 ${
                form.formState.isSubmitting
                  ? 'cursor-not-allowed bg-gray-500 font-[700]'
                  : 'cursor-pointer'
              } `,
            )}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className='px-5 py-1'>
                <div className='h-4 w-4 animate-spin  rounded-full border-t-4 border-white'></div>
              </div>
            ) : (
              <span className='text-sm font-[400] leading-[24px]  tracking-[0.4px] text-white '>
                {isEditing ? 'Update Category' : 'Create Category'}
              </span>
            )}
          </button>

          <p className='invisible'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quam nulla illo
            dolore? Voluptatibus in blanditiis deleniti quasi a ex culpa quae, aliquid, dolores
            unde, corrupti iusto. Asperiores ipsa dignissimos temporibus error possimus. Asperiores,
            eos!
          </p>
        </form>
      </Form>
    </div>
  );
};

export default CreateCategory;
