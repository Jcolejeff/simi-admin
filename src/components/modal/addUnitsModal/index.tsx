import { Dialog, DialogContent, DialogTrigger } from 'components/shadcn/dialog';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import CONSTANTS from 'constant';
import { StoreType } from 'store';

import useStore from 'store';
import { Units } from 'pages/app/create-new-product';
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
import { Input } from 'components/shadcn/input';
import { cn } from 'lib/utils';
import { Switch } from 'components/shadcn/switch';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from 'firebase';
import { useDropzone } from 'react-dropzone';
import toast from 'helper';
import Icon from 'utils/Icon';
interface Iprop {
  trigger: JSX.Element;
  triggerClassName?: string;
  title?: string;
  img?: string;
  desc?: string;
  units: Units[];
  setUnits?: React.Dispatch<React.SetStateAction<Units[]>>;
  item?: any;
  isEditing?: boolean;
  editData?: Units;
}
const FormSchema = z.object({
  price: z.number().min(1, {
    message: 'Please enter a valid price',
  }),

  ratio: z.number().min(1, {
    message: 'Please enter a valid ratio',
  }),

  unit: z.string().min(1, {
    message: 'Please enter a valid unit',
  }),
  image: z.string().optional(),
  markedUpPrice: z.number().min(1, {
    message: 'Please enter a valid discount price',
  }),
  isDiscounted: z.boolean().default(false),
});

const AddUnitsModal = ({
  trigger,
  triggerClassName,
  title,
  img,
  desc,
  units,
  item,
  setUnits,
  isEditing = false,
  editData,
}: Iprop) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(editData?.image || null);
  const { setEditData, setIsEditing } = useStore((state: StoreType) => state);

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

  const unitForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: editData?.price || 0,
      isDiscounted: editData?.isDiscounted === undefined ? false : editData?.isDiscounted,
      ratio: editData?.ratio || 0,
      unit: editData?.unit || '',
      image: editData?.image || '',
      markedUpPrice: editData?.markedUpPrice || 0,
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setUploading(true);
    let unitData = {
      ...editData,
      ...data,
      image: imageUrl || '',
    };
    if (isEditing && file) {
      const storageRef = ref(
        getStorage(),
        `products/units/${file.name}${Date.now().toLocaleString()}${unitData.unit}`,
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add or update the image URL in product data
      unitData = { ...unitData, image: downloadURL } as typeof unitData & {
        image: string;
      };
    }

    if (isEditing) {
      // Assuming `UnitData` contains the ID of the unit to be edited
      const index = units?.findIndex((unit) => unit.unit === editData?.unit) || 0;
      units[index] = unitData;
      setUnits?.(units);
    } else {
      if (!file) {
        toast.error('Please upload an image for the new unit');
        throw new Error('Please upload an image for the new unit');
      }
      // Proceed with new unit creation, including initial image upload
      const storageRef = ref(
        getStorage(),
        `products/units/${file.name}${Date.now().toLocaleString()}${unitData.unit}`,
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      unitData = { ...unitData, image: downloadURL } as typeof unitData & {
        image: string;
      };

      setUnits?.((prev) => [...prev, unitData]);
    }
    setFile(null);
    unitForm.reset();

    setUploading(false);
    setModalOpen(false);
  }

  return (
    <Dialog onOpenChange={(i: boolean) => setModalOpen(i)} open={modalOpen}>
      <DialogTrigger className={triggerClassName}>
        <button>{trigger}</button>
      </DialogTrigger>
      <DialogContent className=' overflow-auto overflow-x-hidden bg-white      md:!max-w-[900px]'>
        <section className='flex flex-col  gap-4 px-8  '>
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
          <Form {...unitForm}>
            <form onSubmit={unitForm.handleSubmit(onSubmit)} className={cn('flex flex-col gap-8')}>
              <section className=' grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6  '>
                <FormField
                  control={unitForm.control}
                  name='isDiscounted'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg  p-3 shadow-sm'>
                      <div className=''>
                        <FormLabel className='font-semibold text-black'>
                          {' '}
                          Is Product On Sale?
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={unitForm.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <div className='relative'>
                        <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                          Price
                        </label>
                        <FormControl>
                          <Input
                            className='placeholder:t rounded-[8px] py-6 text-base placeholder:text-sm'
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : Number(value));
                            }}
                            type='number'
                            placeholder='Price'
                          />
                        </FormControl>
                      </div>
                      <FormMessage className='mt-1 text-sm' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={unitForm.control}
                  name='markedUpPrice'
                  render={({ field }) => (
                    <FormItem>
                      <div className='relative'>
                        <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                          Marked Up Price
                        </label>
                        <FormControl>
                          <Input
                            className='placeholder:t rounded-[8px] py-6 text-base placeholder:text-sm'
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : Number(value));
                            }}
                            type='number'
                            placeholder='Price'
                          />
                        </FormControl>
                      </div>
                      <FormMessage className='mt-1 text-sm' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={unitForm.control}
                  name='ratio'
                  render={({ field }) => (
                    <FormItem>
                      <div className='relative'>
                        <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                          Ratio
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
                            placeholder='E.g 1, 0.5'
                          />
                        </FormControl>
                      </div>
                      <FormMessage className='mt-1 text-sm' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={unitForm.control}
                  name='unit'
                  render={({ field }) => (
                    <FormItem>
                      <div className='relative'>
                        <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                          Unit of Measurement
                        </label>
                        <FormControl>
                          <Input
                            className='py-6 text-base placeholder:text-sm  '
                            {...field}
                            type='text'
                            placeholder='E.g kg, crate, basket'
                          />
                        </FormControl>
                      </div>
                      <FormMessage className='mt-1 text-sm' />
                    </FormItem>
                  )}
                />
              </section>

              <button
                type='button'
                onClick={unitForm.handleSubmit(onSubmit)}
                className={cn(
                  `group flex w-fit items-center justify-center gap-2 rounded-lg bg-primary-1 px-3 py-2 text-sm text-white transition-all duration-300 ease-in-out hover:opacity-90${
                    unitForm.formState.isSubmitting
                      ? 'cursor-not-allowed bg-gray-500 font-[700]'
                      : 'cursor-pointer'
                  } `,
                )}
                disabled={unitForm.formState.isSubmitting || uploading}
              >
                {uploading ? (
                  <div className='px-5 py-1'>
                    <div className='h-4 w-4 animate-spin  rounded-full border-t-4 border-white'></div>
                  </div>
                ) : (
                  <span className='text-sm font-[400] leading-[24px]  tracking-[0.4px] text-white '>
                    {isEditing ? 'Update Unit' : 'Add Unit'}
                  </span>
                )}
              </button>
              {/* <button type='submit' className={cn(``)} disabled={unitForm.formState.isSubmitting}>
                Add Unit
              </button> */}
            </form>
          </Form>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnitsModal;
