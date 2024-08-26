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
  CheckCheck,
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
import { cn, checkStatus, formatToNaira, getCreatedDateFromDocument } from 'lib/utils';
import DeleteModal from 'components/modal/DeleteModal';
import NormalTableInfoCard from 'components/general/tableInfoCard/NormalTableInfoCard';
import DoubleTableInfoCard from 'components/general/tableInfoCard/DoubleTableInfoCard';
import EditWalletBalance from 'components/modal/EditOrderModal';
import SampleAccordion from 'components/sampleAccordion';
import { de } from 'date-fns/locale';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'firebase';
import { set } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import FeaturedLoader from 'components/Loaders/FeaturedLoader';
import { Filter } from 'lucide-react';
import SearchComboBox from 'components/general/SearchComboBox';
import { Check } from 'lucide-react';
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

function WalletsTableComponent() {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<any[]>([]);

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

  async function fetchAllUsers() {
    // Create a reference to the 'users' collection
    const usersCollectionRef = collection(db, 'wallets');

    // Await the completion of the getDocs call
    const querySnapshot = await getDocs(usersCollectionRef);

    // Initialize an array to hold user data
    const users: any = [];

    // Iterate over each document in the querySnapshot
    querySnapshot.forEach((doc) => {
      const created = getCreatedDateFromDocument(doc as any);
      users.push({ id: doc.id, ...doc.data(), created });
    });

    return users;
  }
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem] font-semibold'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => <div className='text-[0.71rem] capitalize'>{row.getValue('name')}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem] font-semibold   '
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='flex w-fit items-center   gap-2 rounded-lg'>
          <p className='text-center text-[0.71rem]  '>{row.getValue('email')}</p>
        </div>
      ),
    },
    {
      accessorKey: 'totalDeposit',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem]  font-semibold'
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total Deposits
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='flex w-fit items-center   gap-2 rounded-lg'>
          <p className='text-center text-[0.71rem]  '>
            {formatToNaira(row.getValue('totalDeposit'))}
          </p>
        </div>
      ),
    },

    {
      accessorKey: 'totalSpent',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem] font-semibold '
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Total Spent
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='flex w-fit items-center   gap-2 rounded-lg  '>
          <p className='text-center text-[0.71rem] '>{formatToNaira(row.getValue('totalSpent'))}</p>
        </div>
      ),
    },
    {
      accessorKey: 'balance',
      header: ({ column }) => {
        return (
          <Button
            className='px-0 text-[0.71rem]  font-semibold '
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Remaining Balance
            <Icon name='sort' svgProp={{ className: 'ml-2 h-3 w-2' }} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='flex w-fit items-center   gap-2 rounded-lg  '>
          <p className='text-center text-[0.71rem] '>{formatToNaira(row.getValue('balance'))}</p>
        </div>
      ),
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

      cell: ({ row }) => <div className='text-[0.71rem] capitalize'>{row.getValue('created')}</div>,
    },

    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const page = row.original;

    //     return (
    //       <div className='flex items-center gap-4'>
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button variant='ghost' className='h-8 w-8 p-0'>
    //               {/* <p>Action</p> */}
    //               <span className='sr-only'>Open menu</span>
    //               <MoreVertical className='h-4 w-4' />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align='end' className='px-4 py-2'>
    //             {
    //               <EditWalletBalance
    //                 trigger={
    //                   <Button
    //                     variant='outline'
    //                     className='flex w-full  items-center justify-start gap-2 border-0 p-0 px-2 text-[0.71rem]   capitalize  disabled:cursor-not-allowed disabled:opacity-50'
    //                     onClick={() => {
    //                       setTimeout(() => {
    //                         console.log('delete');
    //                       }, 500);
    //                     }}
    //                   >
    //                     <Icon name='editPen' svgProp={{ className: 'text-black' }}></Icon>
    //                     <p>Edit </p>
    //                   </Button>
    //                 }
    //               ></EditWalletBalance>
    //             }
    //             <DropdownMenuSeparator />
    //             <DeleteModal btnText='Delete' />
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     );
    //   },
    // },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [position, setPosition] = React.useState('bottom');

  const table = useReactTable({
    data: users,
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

  const { isLoading, data } = useQuery({
    queryKey: ['get-users'],
    queryFn: () => fetchAllUsers(),
    onSuccess: (data) => {
      setUsers(data);
    },

    onError: (err) => {
      processError(err);
    },
  });

  return (
    <div className='flex w-full flex-col gap-2 rounded-xl   '>
      <div className='mb-8 flex flex-col md:mb-4 md:flex-row md:justify-between '>
        <h3 className=' mb-6  text-base font-semibold md:mb-16 md:text-2xl'>User Wallets</h3>
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
                      {/* <Link to={`/${CONSTANTS.ROUTES['view-usersList']}/${cell.id}`}> */}
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
                    <p className='text-base font-semibold text-gray-500'>No Users Records</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </FeaturedLoader>

      <div className='flex items-center justify-end space-x-2 p-4'>
        <div className='flex-1 text-xs text-muted-foreground'>
          Showing {table.getRowModel().rows?.length ?? 0} of {users?.length} results
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

export default WalletsTableComponent;
