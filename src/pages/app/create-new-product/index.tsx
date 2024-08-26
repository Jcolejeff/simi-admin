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
import { cn, formatToNaira, splitStringBySpaceAndReplaceWithDash } from 'lib/utils';
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
import { doc, setDoc, collection, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from 'firebase';
import { useDropzone } from 'react-dropzone';
import useStore, { StoreType } from 'store';
import DeleteModal from 'components/modal/DeleteModal';
import AddUnitsModal from 'components/modal/addUnitsModal';
import { X } from 'lucide-react';
// fix for phone input build error
const PhoneInput: React.FC<PhoneInputProps> = (PI as any).default || PI;
interface Iprops {
  switchTab: (tab: string) => void;
  handleComplete: (tab: string) => void;
  data: string[];
  userInfo: any; // change to the right type
  handleUserInfo: (info: any) => void; // change to the right type
}
export interface Units {
  price: number;
  unit: string;
  ratio: number;
  markedUpPrice: number;
  image?: string | undefined;
  isDiscounted: boolean;
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
  // rating: z.number().min(2, {
  //   message: 'Please enter a valid price',
  // }),
  costprice: z.number().min(2, {
    message: 'Please enter a valid price',
  }),
  category: z.string().min(2, {
    message: 'Please enter a valid category',
  }),
  subcategory: z.string().min(2, {
    message: 'Please enter a valid subcategory',
  }),
  description: z.string().min(1, {
    message: 'Please enter a valid description',
  }),

  quantity: z.number({
    required_error: 'quantity is required.',
  }),

  minimumPrice: z.number().optional(),
  nameYourPrice: z.boolean().default(false).optional(),
  inStock: z.boolean().default(true).optional(),
});
const CreateNewProduct = () => {
  const { location } = useUserLocation();
  const navigate = useNavigate();
  const { categories, subcategories, isEditing, editData, setEditData, setIsEditing } = useStore(
    (state: StoreType) => state,
  );

  const [formIsLoading, setFormIsLoading] = useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<any>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(editData?.image || null); // New state for image URL
  const [unitsArrary, setUnitsArray] = useState<Units[]>(editData?.units || []);
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
      nameYourPrice: editData?.nameYourPrice === undefined ? false : editData?.nameYourPrice,
      category: editData?.category?.id || '',
      subcategory: editData?.subcategory?.id || '',
      productName: editData?.name || '',
      price: Number(editData?.price),
      description: editData?.desc || '',
      quantity: Number(editData?.quantity ?? 0),
      minimumPrice: Number(editData?.minimumPrice || 0),
      costprice: Number(editData?.costprice || 0),
      inStock: editData?.inStock === undefined ? true : editData?.inStock,
      // rating: Number(editData?.rating || 0),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFormIsLoading(true);

    try {
      // Initialize productData with common fields
      let productData = {
        name: data.productName,
        desc: data.description,
        subcategory: {
          id: data.subcategory,
          name: subcategories.find((sc: any) => sc.id === data.subcategory)?.name,
        },
        category: {
          id: data.category,
          name: categories.find((c: any) => c.id === data.category)?.name,
        },
        price: Number(data.price),
        costprice: Number(data.costprice),
        quantity: Number(data.quantity),
        minimumPrice: Number(data.minimumPrice),
        nameYourPrice: data.nameYourPrice ? true : false,
        slug: splitStringBySpaceAndReplaceWithDash(data.productName),
        units: unitsArrary,
        inStock: data.inStock,
        rating: Number(editData?.rating || 0),
        ratingCount: Number(editData?.ratingCount || 0),
        created_date: serverTimestamp(),
      };
      if (unitsArrary.length === 0) {
        toast.error('Please add units for the product');
        throw new Error('Please add units for the product');
      }
      // Check if editing and a new file is provided
      if (isEditing && file) {
        const storageRef = ref(getStorage(), `products/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Add or update the image URL in product data
        productData = { ...productData, image: downloadURL } as typeof productData & {
          image: string;
        };
      }

      if (isEditing) {
        // Assuming `editData` contains the ID of the product to be edited
        const productRef = doc(db, 'products', editData.id);
        await setDoc(productRef, productData, { merge: true });
        toast.success('Product updated successfully');
      } else {
        if (!file) {
          toast.error('Please upload an image for the new product');
          throw new Error('Please upload an image for the new product');
        }
        // Proceed with new product creation, including initial image upload
        const storageRef = ref(getStorage(), `products/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        productData = { ...productData, image: downloadURL } as typeof productData & {
          image: string;
        };

        const productsCollectionRef = collection(db, 'products');
        await addDoc(productsCollectionRef, productData);
        toast.success('Product created successfully');
      }

      // Cleanup and navigate back or to another page as needed
      setFile(null);
      setFormIsLoading(false);
      if (isEditing) {
        navigate(-1);
        setIsEditing(false);
        setEditData(null);
      }
      // navigate(-1) or any other post submission logic
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error ${isEditing ? 'updating' : 'creating'} product. Please try again.`);
      setFormIsLoading(false);
    }
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
            <div className=' hidden flex-col gap-1 md:block'>
              <h3 className=' text-base font-semibold md:text-xl'>
                {isEditing ? 'Edit Product' : 'Add Product'}
              </h3>
              <p className='text-[0.75rem] '>
                {isEditing
                  ? 'Edit the product details below'
                  : 'This will add a new product to your catalogue'}
              </p>
            </div>
          </InlineLoader>
        </div>

        <div className='flex  gap-4'>
          {isEditing && (
            <DeleteModal
              btnText='Delete Product'
              collectionName='products'
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
              name='inStock'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg  p-3 shadow-sm'>
                  <div className=''>
                    <FormLabel className='font-semibold text-black'> In Stock?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='costprice'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Cost Price (NGN)
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : Number(value));
                        }}
                        value={field.value}
                        type='number'
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
              name='price'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Marked Up Price (NGN){' '}
                      <span className='text-xs text-red-600'>*selling price</span>
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : Number(value));
                        }}
                        value={field.value}
                        type='number'
                        placeholder='3000'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Product Rating
                    </label>
                    <FormControl>
                      <Input
                        className='py-6 text-base placeholder:text-sm  '
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : Number(value));
                        }}
                        min={1}
                        max={5}
                        value={field.value}
                        type='number'
                        placeholder='(1-5)'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Category
                    </label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full py-6 text-sm  text-secondary-3 transition-all duration-300  ease-in-out  placeholder:text-lg focus-within:text-secondary-2 '>
                          <SelectValue placeholder='Select product categories' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-primary-1'>
                        {categories?.map((category: any) => (
                          <SelectItem value={category.id} className='py-3 text-sm text-white'>
                            {category.name}
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
              name='subcategory'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Subcategory
                    </label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full py-6 text-sm  text-secondary-3 transition-all duration-300  ease-in-out  placeholder:text-lg focus-within:text-secondary-2 '>
                          <SelectValue placeholder='Select product subcategory' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-primary-1'>
                        {subcategories?.map((subcategory: any) => (
                          <SelectItem value={subcategory.id} className='py-3 text-sm text-white'>
                            {subcategory.name}
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
              name='nameYourPrice'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg  p-3 shadow-sm'>
                  <div className=''>
                    <FormLabel className='font-semibold text-black'>Name your price</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.getValues('nameYourPrice') && (
              <FormField
                control={form.control}
                name='minimumPrice'
                render={({ field }) => (
                  <FormItem>
                    <div className='relative'>
                      <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                        Minimum Price (NGN)
                      </label>
                      <FormControl>
                        <Input
                          className='py-6 text-base placeholder:text-sm  '
                          {...field}
                          placeholder='Set minimum price'
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
            )}
          </section>
        </form>
      </Form>
      <div>
        <h3 className='text-base font-semibold'>Units</h3>
        {unitsArrary.map((unit, index) => (
          <div key={index} className='my-2 flex items-center gap-4'>
            <span className='font- text-sm'>Unit - {unit.unit}</span>
            <span className='text-sm '>Ratio - {unit.ratio}</span>
            <span className='text-sm '>Price - {formatToNaira(unit.price)}</span>
            <AddUnitsModal
              units={unitsArrary}
              setUnits={setUnitsArray}
              isEditing={true}
              editData={unit}
              trigger={
                <button className='  '>
                  <Icon
                    name='editPen'
                    svgProp={{
                      className: 'text-white fill-current',
                    }}
                  />
                </button>
              }
            />
            <button
              type='button'
              onClick={() => {
                const newUnits = unitsArrary.filter((_, i) => i !== index);
                setUnitsArray(newUnits);
              }}
              className=' text-red-600'
            >
              <X className='h-6 w-6' />
            </button>
          </div>
        ))}

        <AddUnitsModal
          units={unitsArrary}
          setUnits={setUnitsArray}
          trigger={
            <button className='group mt-3  flex w-fit items-center justify-center gap-2 place-self-end   rounded-[5px] bg-primary-1 px-2 py-1 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:opacity-90'>
              <Icon name='addIcon' />
              <span className='text-xs font-[400] leading-[24px] tracking-[0.4px] text-white '>
                Add Units
              </span>
            </button>
          }
        />
      </div>
      <button
        type='button'
        onClick={form.handleSubmit(onSubmit)}
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
            {isEditing ? 'Update Product' : 'Create Product'}
          </span>
        )}
      </button>
      <p className='invisible'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus quam nulla illo dolore?
        Voluptatibus in blanditiis deleniti quasi a ex culpa quae, aliquid, dolores unde, corrupti
        iusto. Asperiores ipsa dignissimos temporibus error possimus. Asperiores, eos!
      </p>
    </div>
  );
};

export default CreateNewProduct;
