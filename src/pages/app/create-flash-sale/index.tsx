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
import toast, { convertFirebaseTimestampToDate } from 'helper';
import Spinner from 'components/shadcn/ui/spinner';
import { processError } from 'helper/error';
import CONSTANTS from 'constant';
import { Switch } from 'components/shadcn/switch';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db } from 'firebase';
import { useDropzone } from 'react-dropzone';
import useStore from 'store';
import DeleteModal from 'components/modal/DeleteModal';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
// fix for phone input build error
const PhoneInput: React.FC<PhoneInputProps> = (PI as any).default || PI;
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
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
  productName: z.string().min(2, {
    message: 'Please enter a valid name',
  }),

  price: z.number().min(2, {
    message: 'Please enter a valid price',
  }),

  description: z.string().min(1, {
    message: 'Please enter a valid description',
  }),
  unit: z.string({
    required_error: 'unit is required.',
  }),
  quantity: z.number({
    required_error: 'quantity is required.',
  }),

  prevPrice: z.number().min(2, {
    message: 'Please enter a valid previous price',
  }),
});
const CreateFlashSale = () => {
  const { location } = useUserLocation();
  const navigate = useNavigate();
  const { isEditing, setIsEditing, editData, setEditData } = useStore((state) => state);
  const [expireDate, setExpireDate] = useState<Date | null>(
    isEditing && editData?.expireDate
      ? convertFirebaseTimestampToDate(editData.expireDate)
      : new Date(new Date().setHours(new Date().getHours() + 5)),
  );
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<any>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(editData?.image || null); // New state for image URL
  const handleFileDrop = async (files: any) => {
    setUploading(true);
    setFile(files);
    const fileUrl = URL.createObjectURL(files);
    setImageUrl(fileUrl); // Store the URL in state

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
      productName: editData?.name || '',
      price: Number(editData?.price ?? 0),
      quantity: Number(editData?.quantity ?? 0),
      description: editData?.desc || '',
      unit: editData?.unit || '',
      prevPrice: Number(editData?.prevPrice ?? 0),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormIsLoading(true);

    try {
      // Initialize flashSaleData with common fields
      let flashSaleData = {
        name: data.productName,
        desc: data.description,
        price: Number(data.price),
        quantity: Number(data.quantity),

        unit: data.unit,
        prevPrice: Number(data.prevPrice),
        expireDate: expireDate,
        slug: splitStringBySpaceAndReplaceWithDash(data.productName),
      };

      // Check if editing and a new file is provided
      if (isEditing && file) {
        const storageRef = ref(getStorage(), `flashSales/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Add or update the image URL in flash sale data
        flashSaleData = { ...flashSaleData, image: downloadURL } as typeof flashSaleData & {
          image: string;
        };
      }

      if (isEditing) {
        // Assuming `editData` contains the ID of the flash sale to be edited
        const flashSaleRef = doc(db, 'flashsales', editData.id);
        await setDoc(flashSaleRef, flashSaleData, { merge: true });
        toast.success('Flash Sale updated successfully');
        navigate(-1);
      } else {
        if (!file) throw new Error('Please upload an image for the new flash sale');
        // Proceed with new flash sale creation, including initial image upload
        const storageRef = ref(getStorage(), `flashSales/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        flashSaleData = { ...flashSaleData, image: downloadURL } as typeof flashSaleData & {
          image: string;
        };

        const flashSalesCollectionRef = collection(db, 'flashsales');
        await addDoc(flashSalesCollectionRef, flashSaleData);
        toast.success('Flash Sale created successfully');
      }

      // Cleanup and navigate back or to another page as needed
      setFile(null);
      setImageUrl(null); // Ensure to clear the image URL state as well
      setFormIsLoading(false);
      if (isEditing) {
        setIsEditing(false);
        setEditData(null);
      }
      // navigate(-1) or any other post submission logic
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error ${isEditing ? 'updating' : 'creating'} flash sale. Please try again.`);
      setFormIsLoading(false);
    }
  }

  return (
    <div className='container flex h-full w-full max-w-[180.75rem] flex-col gap-8 px-container-base pb-[2.1rem] md:px-container-md'>
      <div className='mb-8 flex  w-full items-center justify-between gap-4 md:flex-row'>
        <div className='flex w-max cursor-pointer items-center gap-3 rounded-[8px] px-[2px]'>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditData(null);
              navigate(-1);
            }}
          >
            <ChevronLeft className='h-6 w-6 font-light' />
          </button>

          <InlineLoader isLoading={false}>
            <div className='hidden  flex-col gap-1  md:flex'>
              <h3 className=' text-base font-semibold md:text-xl'>
                {isEditing ? 'Edit Flash Sale' : 'Add Flash Sale'}
              </h3>
              <p className='text-[0.75rem] '>
                {isEditing
                  ? 'Edit the flash sale details'
                  : 'This will add a new flash sale to your catalogue'}
              </p>
            </div>
          </InlineLoader>
        </div>

        <div className='flex  gap-4'>
          {isEditing && (
            <DeleteModal
              btnText='Delete Flash Sale'
              collectionName='flashsales'
              documentId={editData?.id}
            />
          )}
          <button
            onClick={() => {
              setIsEditing(false);
              setEditData(null);
              navigate(-1);
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
              name='productName'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Product Name
                    </label>
                    <FormControl>
                      <Input
                        className='placeholder:t rounded-[8px] py-6 text-base placeholder:text-sm'
                        {...field}
                        type='text'
                        placeholder='Enter product name'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Price (NGN)
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        type='number'
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : Number(value));
                        }}
                        value={field.value}
                        placeholder='3000'
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
                      Description
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        type='text'
                        placeholder='Enter product description'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='unit'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Unit
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        type='text'
                        placeholder='Enter product measurement unit'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Quantity
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm placeholder:text-secondary-1/50 '
                        {...field}
                        type='number'
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : Number(value));
                        }}
                        value={field.value}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='prevPrice'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Previous Price (NGN)
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        type='number'
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : Number(value));
                        }}
                        value={field.value}
                        placeholder='previous price'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />
            <div className='flex flex-col py-6'>
              <p className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                Expiry Date
              </p>
              <DateTimePicker onChange={setExpireDate} value={expireDate} className='border-none' />
            </div>
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
                {isEditing ? 'Update Flash Sale' : ' Create Flash Sale'}
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

export default CreateFlashSale;
