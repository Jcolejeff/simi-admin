import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTrigger } from 'components/shadcn/dialog';
import Icon from 'utils/Icon';
import { useNavigate } from 'react-router-dom';
import TextInfoSTack from 'components/general/InfoStack/InfoStack';
import { Checkbox } from 'components/shadcn/checkbox';
import { db } from 'firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { processError } from 'helper/error';
import { useQuery } from '@tanstack/react-query';
import ContentLoader from 'components/general/ContentLoader';
import { Order } from 'types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/shadcn/ui/table';
import { formatToNaira } from 'lib/utils';
import Spinner from 'components/shadcn/ui/spinner';

interface Iprop {
  trigger: JSX.Element;
  triggerClassName?: string;
  title?: string;
  orderId: string;
  refetchAllOrders: () => void;
}

const ViewOrderDetailsModal = ({
  trigger,
  triggerClassName,
  title,
  orderId,
  refetchAllOrders,
}: Iprop) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const fetchSingleOrder = async () => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('orderId', '==', orderId));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        return { id: firstDoc.id, ...firstDoc.data() };
      } else {
        console.log('No matching documents found.');
        return null;
      }
    } catch (error) {
      console.error('Error querying documents: ', error);
      return null;
    }
  };

  const { isLoading, data, refetch } = useQuery<any, any, Order>({
    queryKey: ['get-single-order', orderId],
    queryFn: () => fetchSingleOrder(),
    onError: (err) => {
      processError(err);
    },
  });

  const order = data as Order;
  const TableHeadings = ['Product', 'Price', 'Quantity', 'Subtotal'];
  const [orderStatus, setOrderStatus] = useState(order?.status);

  const updateOrderStatus = useMutation(
    async (newStatus: string) => {
      if (order?.id) {
        setUpdating(true);
        const orderRef = doc(db, 'orders', order.id);
        await updateDoc(orderRef, { status: newStatus });
        refetch();
        refetchAllOrders();
        setUpdating(false);
      }
    },
    {
      onError: (err) => {
        processError(err);
      },
    },
  );

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(event.target.value);
    updateOrderStatus.mutate(event.target.value);
  };

  return (
    <Dialog onOpenChange={(i) => setModalOpen(i)} open={modalOpen}>
      <DialogTrigger className={triggerClassName}>{trigger}</DialogTrigger>
      <DialogContent className='no-scrollbar mt-4  h-full w-full max-w-full overflow-scroll  bg-white  px-6 md:!max-w-[1000px] lg:px-[2rem]'>
        <ContentLoader isLoading={isLoading}>
          <section className='flex h-full w-full flex-col '>
            <div className='flex items-center gap-2 border-b px-4 py-4 text-[14px]  text-[#4D4D4D]'>
              <h1 className='text-[20px] font-[500]'>Order Details</h1>
              <p>•</p>
              <p>{order?.createdDate}</p>
              <p>•</p>
              <p></p>
            </div>
            <div className='my-4 grid gap-4 px-4 md:grid-cols-[2fr,1fr]'>
              <div className='grid rounded-xl border md:grid-cols-2'>
                <div>
                  <div className='p-4'>
                    <div className='mb-8'>
                      <p className='mb-2 text-[16px] leading-[24px] text-[#1A1A1A]'>
                        {order?.address}
                      </p>
                      <p className='text-[14px] text-[#666666]'>{order?.address}</p>
                    </div>
                    <div className='mb-2'>
                      <p className=' text-[12px] uppercase text-[#999999]'>Email</p>
                      <p className='break-all text-[14px] text-[#1A1A1A]'>{order?.email}</p>
                    </div>
                    <div>
                      <p className='text-[12px] uppercase text-[#999999]'>Phone</p>
                      <p className='text-[14px] text-[#1A1A1A]'>{order?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='rounded-xl border'>
                <div className='flex gap-4 border-b p-4'>
                  <div>
                    <p className='mb-[4px] text-[12px] uppercase text-[#999999]'>Order ID:</p>
                    <p className='text-[14px] text-[#1A1A1A]'>{order?.orderId}</p>
                  </div>
                  <div></div>
                </div>
                <div className='flex flex-col gap-6 p-4'>
                  <div className='flex justify-between text-[18px]'>
                    <p className='capitalize text-[#1A1A1A]'>Total</p>
                    <p className='font-medium text-[#2C742F]'>
                      {formatToNaira(order?.totalAmount)}
                    </p>
                  </div>
                </div>
                <div className='px-4 text-base md:py-12'>
                  <p className='capitalize text-[#1A1A1A]'>Status</p>
                  {updating ? (
                    <Spinner />
                  ) : (
                    <select
                      value={orderStatus}
                      onChange={handleStatusChange}
                      className='mt-2 rounded border p-2'
                    >
                      <option value='Pending'>Pending</option>
                      <option value='En route'>En route</option>
                      <option value='Delivered'>Delivered</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* desktop */}
            <div className='hidden w-full overflow-auto px-4 md:block'>
              <Table className='w-full py-[0px]'>
                <TableHeader className='bg-[#F2F2F2]'>
                  <TableRow className='border-none px-6'>
                    {TableHeadings.map((heading, idx) => (
                      <TableHead key={idx} className='text-xs uppercase'>
                        {heading}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.cartItems.map((item, idx) => (
                    <TableRow className='border-none text-[#333333]' key={idx}>
                      <TableCell className='flex items-center gap-2'>
                        <img alt='product-image' src={item.image} className='h-[45px] w-[45px]' />
                        <span>{item.name}</span>
                      </TableCell>
                      <TableCell className=''>{formatToNaira(item.price)}</TableCell>
                      <TableCell>x{item.no_of_items}</TableCell>
                      <TableCell className=''>
                        {formatToNaira(item.no_of_items * item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* mobile */}
            <div className='px-4 md:hidden'>
              <div className='mb-8 flex flex-col gap-4'>
                {order?.cartItems.map((item, idx) => (
                  <div key={idx} className='flex items-center gap-4 rounded-xl bg-slate-100 p-4'>
                    <img alt='product-image' className='h-[80px] w-[80px]' src={item.image} />
                    <div>
                      <p className='mb-2 text-[14px] font-[500] text-[#1A1A1A]'>{item.name}</p>
                      <div className='flex items-end gap-4'>
                        <p className='text-[10px] text-[#767676]'>
                          Price:{' '}
                          <span className='text-[14px] font-[500] text-[#1A1A1A]'>
                            {formatToNaira(item.price)}
                          </span>
                        </p>
                        <p className='text-[10px] text-[#767676]'>
                          Qty:{' '}
                          <span className='text-[14px] font-[500] text-[#1A1A1A]'>
                            {item.no_of_items}
                          </span>
                        </p>
                      </div>
                      <p className='text-[10px] text-[#767676]'>
                        Sub total:{' '}
                        <span className='text-[14px] font-[500] text-[#1A1A1A]'>
                          {formatToNaira(item.no_of_items * item.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ContentLoader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDetailsModal;
