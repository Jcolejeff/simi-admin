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
import { cn, getCreatedDateFromDocument } from 'lib/utils';
import { Switch } from 'components/shadcn/switch';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, updateDoc, addDoc, getDocs } from 'firebase/firestore';
import { db } from 'firebase';
import { Popover, PopoverContent, PopoverTrigger } from 'components/shadcn/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from 'components/shadcn/ui/calendar';
import { format } from 'date-fns';
import { processError } from 'helper/error';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'helper';

const FormSchema = z.object({
  showOfftakes: z.boolean().default(false).optional(),
  showFlashSales: z.boolean().default(false).optional(),

  FarmOffTakeAvailable: z.date({
    required_error: 'a date is required',
  }),
  FlashSaleAvailable: z.date({
    required_error: 'a date is required',
  }),
});

export default function ShowSections() {
  const { setEditData, setIsEditing } = useStore((state: StoreType) => state);
  const [formIsLoading, setformIsLoading] = useState(false);
  async function fetchShowSections() {
    const docRef = collection(db, 'showSections');

    const querySnapshot = await getDocs(docRef);

    const items: any = [];

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return items;
  }
  const { isLoading, data, isFetched } = useQuery({
    queryKey: ['get-showSections'],
    queryFn: () => fetchShowSections(),

    onError: (err) => {
      processError(err);
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    setformIsLoading(true);
    const docRef = collection(db, 'showSections');
    const announcementDoc = doc(docRef, data[0].id);
    const sectionData = {
      showOfftakes: values.showOfftakes,
      showFlashSales: values.showFlashSales,
      FarmOffTakeAvailable: values.FarmOffTakeAvailable,
      FlashSaleAvailable: values.FlashSaleAvailable,
    };
    updateDoc(announcementDoc, sectionData)
      .then(() => {
        setformIsLoading(false);
        toast.success('Sections updated successfully');
      })
      .catch((error) => {
        setformIsLoading(false);
        processError(error);
      });
  }

  useEffect(() => {
    if (isFetched) {
      form.setValue('showOfftakes', data[0].showOfftakes);
      form.setValue('showFlashSales', data[0].showFlashSales);
      form.setValue('FarmOffTakeAvailable', new Date(data[0].FarmOffTakeAvailable.seconds * 1000));
      form.setValue('FlashSaleAvailable', new Date(data[0].FlashSaleAvailable.seconds * 1000));
    }
  }, [isFetched]);
  return (
    <section className='flex flex-col  gap-4   '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('flex flex-col gap-8')}>
          <section className=' grid grid-cols-1 gap-8 md:max-w-[80%] md:gap-6   '>
            <FormField
              control={form.control}
              name='showFlashSales'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg  shadow-sm'>
                  <div className=''>
                    <FormLabel className='font-semibold text-black'>Show Flash Sales</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='FlashSaleAvailable'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className=' inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                    Available date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full py-6 pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Set a date</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='showOfftakes'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg   shadow-sm'>
                  <div className=''>
                    <FormLabel className='font-semibold text-black'>Show Farm Offtakes</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='FarmOffTakeAvailable'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className=' inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                    Available Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full py-6 pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Set a date</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        // disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <button
            type='submit'
            className={cn(
              `group flex w-fit items-center justify-center gap-2 rounded-lg bg-primary-1 px-3 py-2 text-sm text-white transition-all duration-300 ease-in-out hover:opacity-90`,
            )}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className='px-5 py-1'>
                <div className='h-4 w-4 animate-spin  rounded-full border-t-4 border-white'></div>
              </div>
            ) : (
              <span className='text-sm font-[400] leading-[24px]  tracking-[0.4px] text-white '>
                Update
              </span>
            )}
          </button>
        </form>
      </Form>
    </section>
  );
}
