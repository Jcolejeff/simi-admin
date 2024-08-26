import { TabsContent } from 'components/shadcn/ui/tabs';
import useStore from 'store';
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
import { doc, setDoc, collection, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase';
import { useDropzone } from 'react-dropzone';
import DeleteModal from 'components/modal/DeleteModal';
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
  subCategoryName: z.string().min(2, {
    message: 'Please enter a valid name',
  }),

  category: z.string().min(2, {
    message: 'Please enter a valid category',
  }),
  description: z.string().min(1, {
    message: 'Please enter a valid description',
  }),
});
const CreateSubCategory = () => {
  const { location } = useUserLocation();
  const navigate = useNavigate();
  const { categories, isEditing, editData, setIsEditing, setEditData } = useStore((state) => state);

  const [formIsLoading, setFormIsLoading] = useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<any>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(editData?.image || null); // New state for image URL

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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subCategoryName: editData?.name ?? '',
      category: editData?.category?.id ?? '',
      description: editData?.desc ?? '',
    },
  });

  function extractErrorMessages(errors: ErrorMessages): string[] {
    let messages: string[] = [];
    for (const key of Object.keys(errors)) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        messages = messages.concat(errors[key]);
      }
    }
    return messages;
  }
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormIsLoading(true);

    try {
      let downloadURL = imageUrl; // Use existing imageUrl if not editing or no new file selected

      // Only attempt upload if a new file is selected
      if (file) {
        const storageRef = ref(getStorage(), 'categories/' + file.name);
        const snapshot = await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref); // Update downloadURL with new image URL
        console.log('Uploaded a blob or file!', snapshot);
        console.log('File available at', downloadURL);
      }

      if (!downloadURL) {
        throw new Error('Image is required.');
      }

      const subCategoryData = {
        name: data.subCategoryName,
        desc: data.description,
        image: downloadURL, // Use the latest downloadURL
        category: {
          id: data.category,
          name: categories.find((category: any) => category.id === data.category)?.name,
        },
        slug: splitStringBySpaceAndReplaceWithDash(data.subCategoryName),
      };

      // Determine if creating a new sub-category or updating an existing one
      if (isEditing && editData?.id) {
        // Logic to update the existing sub-category
        const subCategoryRef = doc(db, 'subcategories', editData.id);
        await updateDoc(subCategoryRef, subCategoryData);
        console.log(`Updated subcategory document with ID: ${editData.id}`);
        navigate(-1);
      } else {
        // Logic to create a new sub-category
        const subCategoriesCollectionRef = collection(db, 'subcategories');
        const newSubCategoryRef = doc(subCategoriesCollectionRef);
        await setDoc(newSubCategoryRef, subCategoryData);
        console.log(`New subcategory document created with ID: ${newSubCategoryRef.id}`);
      }

      toast.success('Subcategory ' + (isEditing ? 'updated' : 'created') + ' successfully');
      form.reset(); // Reset form state
      setFile(null); // Clear selected file
      setImageUrl(null); // Reset image URL
      setIsEditing(false); // Reset editing state
      // Optionally navigate or perform additional cleanup
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }

    setFormIsLoading(false);
  }

  return (
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col gap-8 px-container-base pb-[2.1rem] md:px-container-md'>
      <div className='mb-8 flex  w-full items-center justify-between gap-4 md:flex-row'>
        <div className='flex w-max cursor-pointer items-center gap-3 rounded-[8px] px-[2px]'>
          <button
            onClick={() => {
              navigate(-1);
              setIsEditing(false);
              setEditData(null);
            }}
          >
            <ChevronLeft className='h-6 w-6 font-light' />
          </button>

          <InlineLoader isLoading={false}>
            <div className='hidden flex-col gap-1  md:flex'>
              <h3 className=' text-base font-semibold md:text-xl'>
                {isEditing ? 'Edit' : 'Create'} Sub-category
              </h3>
              <p className='text-[0.75rem] '>
                {isEditing
                  ? 'Edit the sub-category details'
                  : 'This will add a new sub-category to your catalogue'}
              </p>
            </div>
          </InlineLoader>
        </div>

        <div className='flex  gap-4'>
          {isEditing && (
            <DeleteModal
              btnText='Delete Sub-category'
              collectionName='subcategories'
              documentId={editData?.id}
            />
          )}
          <button
            onClick={() => {
              navigate(-1);
              setIsEditing(false);
              setEditData(null);
            }}
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
          <section className=' grid grid-cols-1 gap-8 md:max-w-[80%] md:gap-6 xm:grid-cols-[1fr_1fr]  '>
            <FormField
              control={form.control}
              name='subCategoryName'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Sub-category Name
                    </label>
                    <FormControl>
                      <Input
                        className='placeholder:t rounded-[8px] py-6 text-base placeholder:text-sm'
                        {...field}
                        type='text'
                        placeholder='Enter sub-category name'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Main Category
                    </label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full py-6 text-sm  text-secondary-3 transition-all duration-300  ease-in-out  placeholder:text-lg focus-within:text-secondary-2 '>
                          <SelectValue placeholder='Select a main category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-primary-1'>
                        {categories?.map((category: any, index: number) => (
                          <SelectItem
                            value={category?.id}
                            className='py-3 text-sm text-white'
                            key={index}
                          >
                            {category?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage className='mt-1 text-xs' />
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
                      Sub-category Description
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        type='text'
                        placeholder='Enter sub-category description'
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
                {isEditing ? 'Update' : '  Create Sub-category'}
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

export default CreateSubCategory;
