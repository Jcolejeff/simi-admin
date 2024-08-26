import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  MoreVertical,
  MoreVerticalIcon,
} from 'lucide-react';

import { Button } from 'components/shadcn/ui/button';
import { Checkbox } from 'components/shadcn/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from 'components/shadcn/dropdown-menu';
import { Input } from 'components/shadcn/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/shadcn/ui/table';
import { Link } from 'react-router-dom';
import CONSTANTS from 'constant';
import Icon from 'utils/Icon';
import API from 'services';
import toast, { formatCurrentDateTime } from 'helper';
import { processError } from 'helper/error';
import Spinner from 'components/shadcn/ui/spinner';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from 'store';
import { cn, checkStatus, formatDate, getCreatedDateFromDocument, formatToNaira } from 'lib/utils';
import DeleteModal from 'components/modal/DeleteModal';
import NormalTableInfoCard from 'components/general/tableInfoCard/NormalTableInfoCard';
import DoubleTableInfoCard from 'components/general/tableInfoCard/DoubleTableInfoCard';
import SampleAccordion from 'components/sampleAccordion';
import { de } from 'date-fns/locale';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from 'firebase';
import { set } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import FeaturedLoader from 'components/Loaders/FeaturedLoader';
import EditOrderModal from 'components/modal/EditOrderModal';
import { Filter } from 'lucide-react';
import SearchComboBox from 'components/general/SearchComboBox';
export type User = {
  id: string;
  number: string;
  name: string;
  city: string;
  status: string;
  email: string;
  orders: number;
  created: string;
  total: string;
};

function OrderTableComponent() {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState<any[]>([]);

  // refactor this
  const deletePage = async (id: string) => {
    // setIsLoading(true);
    //     try {
    //       const res = await API.delete(`/usersList/${id}`);
    //       toast.success('User deleted successfully');
    //       setTimeout(() => {
    //         refetch();
    //       }, 10);
    //     } catch (error) {
    //       processError(error);
    //     }
    // setIsLoading(false);
  };

  async function fetchOrders() {
    // Create a reference to the 'orders' collection
    const ordersCollectionRef = collection(db, 'orders');
    const ordersQuery = query(ordersCollectionRef, orderBy('created_date', 'desc'));
    // Await the completion of the getDocs call
    const querySnapshot = await getDocs(ordersQuery);

    // Initialize an array to hold user data
    const orders: any = [];

    // Iterate over each document in the querySnapshot
    querySnapshot.forEach((doc) => {
      const created = getCreatedDateFromDocument(doc as any);
      orders.push({ id: doc.id, ...doc.data(), created });
    });

    return orders;
  }
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['get-orders'],
    queryFn: () => fetchOrders(),
    onSuccess: (data) => {
      setOrders(data);
    },

    onError: (err) => {
      processError(err);
    },
  });
  const refetchAllOrders = () => {
    refetch();
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'orderId',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem] font-semibold'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Order Number
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='text-[0.71rem] capitalize text-green-600'>{row.getValue('orderId')}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem] font-semibold   '
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='flex w-fit items-center   gap-2 rounded-lg'>
          <p className='text-center text-[0.71rem]  '>{row.getValue('name')}</p>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem]  font-semibold'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='flex w-fit items-center   gap-2 rounded-lg'>
          <p className='text-center text-[0.71rem]  '>
            {formatToNaira(Number(row.getValue('totalAmount')))}
          </p>
        </div>
      ),
    },

    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem] font-semibold '
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='flex w-fit items-center   gap-2 rounded-lg  '>
          <p className='text-center text-[0.71rem] '>
            {/* {(row.getValue('user') as { name: string })?.name} */}
          </p>
          <p className='text-center text-[0.71rem] '>{row.getValue('email')}</p>
        </div>
      ),
    },

    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button className='px-0 text-[0.71rem]  font-semibold' variant='ghost'>
            Status
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className={`flex w-fit items-center  rounded-2xl    text-[0.71rem] capitalize ${checkStatus(
            row.getValue('status'),
          )}`}
        >
          {row.getValue('status')}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'created',
      accessorKey: 'created',
      header: ({ column }) => {
        return (
          <Button className='px-0 text-[0.71rem]  font-semibold' variant='ghost'>
            Created
          </Button>
        );
      },

      cell: ({ row }) => (
        <div className='text-[0.71rem] capitalize'>
          {/* {formatDate(new Date((row.getValue('created') as number) * 1000).toString())} */}
          {row.getValue('created')}
        </div>
      ),
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const page = row.original;

        return (
          <div className='flex items-center gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  {/* <p>Action</p> */}
                  <span className='sr-only'>Open menu</span>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='px-4 py-2'>
                {
                  <EditOrderModal
                    trigger={
                      <Button
                        variant='outline'
                        className='flex w-full  items-center justify-start gap-2 border-0 p-0 px-2 text-[0.71rem]   capitalize  disabled:cursor-not-allowed disabled:opacity-50'
                        onClick={() => {
                          setTimeout(() => {
                            console.log('delete');
                          }, 500);
                        }}
                      >
                        <Icon name='editPen' svgProp={{ className: 'text-black' }}></Icon>
                        <p>View Details </p>
                      </Button>
                    }
                    orderId={row.getValue('orderId')}
                    refetchAllOrders={refetchAllOrders}
                  ></EditOrderModal>
                }
                <DropdownMenuSeparator />
                <DeleteModal btnText='Delete' />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [position, setPosition] = React.useState('bottom');

  const table = useReactTable({
    data: orders,
    columns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='flex w-full flex-col gap-2 rounded-xl   '>
      <div className='mb-8 flex flex-col md:mb-4 md:flex-row md:justify-between '>
        <h3 className=' mb-6  text-base font-semibold md:mb-16 md:text-2xl'>Track Orders</h3>
        <div>
          <p className='mb-6 hidden text-end text-[0.75rem] text-gray-400 md:block'>
            {formatCurrentDateTime()}
          </p>
          <div className='flex items-center  gap-3'>
            <SearchComboBox
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
            />
            <div className='flex  items-center justify-between gap-3'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-12 w-12 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='px-4 py-4  pb-4'>
                  {/* <DropdownMenuLabel className='px-0 text-center text-sm font-normal'>
                Actions
              </DropdownMenuLabel> */}
                  <DropdownMenuItem
                    onClick={() => {
                      table.resetSorting();
                    }}
                    className='flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-center text-xs'
                  >
                    Reset Sorting
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='my-2' />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className=''>
                        <Button variant='outline' className='py-1 text-xs'>
                          Columns <ChevronDown className='ml-2 h-3 w-3' />
                        </Button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className='text-xs capitalize'
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <FeaturedLoader isLoading={isLoading}>
        <Table className=''>
          <TableHeader className='border-0 bg-primary-6 [&_tr]:border-b-0'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='border-0   '>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='border-b border-b-black/0 px-4  text-black'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn('border-0 ', index % 2 === 0 ? '' : 'bg-slate-50')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className=' py-3 font-medium'>
                      {/* <Link to={`/${CONSTANTS.ROUTES['view-ordersList']}/${cell.id}`}> */}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {/* </Link> */}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-[400px] text-center'>
                  <div>
                    <p className='text-base font-semibold text-gray-500'>No orders Records</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </FeaturedLoader>

      <div className='flex items-center justify-end space-x-2 p-4'>
        <div className='flex-1 text-xs text-muted-foreground'>
          Showing {table.getRowModel().rows?.length ?? 0} of {orders?.length} results
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            className='text-[0.71rem] '
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='text-[0.71rem] '
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <button className='ml-4 w-fit rounded-sm bg-primary-1 px-4 py-1 text-[0.71rem]  text-white  '>
        Export
      </button>
    </div>
  );
}

export default OrderTableComponent;
