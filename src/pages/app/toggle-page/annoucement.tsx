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
  showAnnouncement: z.boolean().default(false).optional(),

  duration: z.date({
    required_error: 'a date is required',
  }),
  text: z.string().min(1, {
    message: 'Please enter a valid duration',
  }),
});

export default function AnnouncementToggle() {
  const { setEditData, setIsEditing } = useStore((state: StoreType) => state);
  const [formIsLoading, setformIsLoading] = useState(false);
  async function fetchAnnouncement() {
    const announcementRef = collection(db, 'announcement');

    const querySnapshot = await getDocs(announcementRef);

    const products: any = [];

    querySnapshot.forEach((doc) => {
      const createdDate = getCreatedDateFromDocument(doc as any);
      products.push({
        id: doc.id,
        ...doc.data(),
        createdDate,
      });
    });

    return products;
  }
  const { isLoading, data, isFetched } = useQuery({
    queryKey: ['get-announcement'],
    queryFn: () => fetchAnnouncement(),

    onError: (err) => {
      processError(err);
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  function onSubmit(values: z.infer<typeof FormSchema>) {
    setformIsLoading(true);
    const { showAnnouncement, duration, text } = values;
    const announcementRef = collection(db, 'announcement');
    const announcementDoc = doc(announcementRef, data[0].id);
    const announcementData = {
      showAnnouncement,
      duration: duration,
      announcementText: text,
    };
    updateDoc(announcementDoc, announcementData)
      .then(() => {
        setformIsLoading(false);
        toast.success('Announcement updated successfully');
      })
      .catch((error) => {
        setformIsLoading(false);
        processError(error);
      });
  }

  useEffect(() => {
    if (isFetched) {
      form.setValue('showAnnouncement', data[0].showAnnouncement);
      form.setValue('text', data[0].announcementText);
      const createdDate = new Date(data[0]?.duration.seconds * 1000); // Convert seconds to milliseconds

      form.setValue('duration', createdDate);
    }
  }, [isFetched]);
  return (
    <section className='flex flex-col  gap-4   '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('flex flex-col gap-8')}>
          <section className=' grid grid-cols-1 gap-8 md:max-w-[80%] md:gap-6   '>
            <FormField
              control={form.control}
              name='text'
              render={({ field }) => (
                <FormItem>
                  <div className='relative'>
                    <label className='mb-2 inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                      Text
                    </label>
                    <FormControl>
                      <Input
                        className='placeholder:t rounded-[8px] py-6 text-base placeholder:text-sm'
                        {...field}
                        type='text'
                        placeholder='Text'
                      />
                    </FormControl>
                  </div>
                  <FormMessage className='mt-1 text-sm' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='showAnnouncement'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg  p-3 shadow-sm'>
                  <div className=''>
                    <FormLabel className='font-semibold text-black'>show announcement</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className=' inline-block rounded-full bg-white px-1 text-sm font-semibold   '>
                    Expiry date
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
