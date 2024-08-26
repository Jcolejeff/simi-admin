import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/shadcn/ui/alert-dialog';
import { Button } from 'components/shadcn/ui/button';
import { tr } from 'date-fns/locale';
import Icon from 'utils/Icon';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from 'firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'helper';
import Spinner from 'components/shadcn/ui/spinner';

export default function DeleteModal({
  btnText,
  title,
  description,
  action,
  cancel,
  documentId,
  collectionName,
}: {
  btnText?: string;
  title?: string;
  description?: string;
  action?: string;
  cancel?: string;
  collectionName?: string;
  documentId?: string;
}) {
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  /**
   * Deletes a document from a specified Firestore collection.
   *
   * @param {string} collectionName The name of the collection containing the document to delete.
   * @param {string} documentId The ID of the document to delete.
   */

  async function deleteItemFromCollection(collectionName: string, documentId: string) {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, collectionName, documentId));
      navigate(-1);
      console.log(`Document with ID ${documentId} successfully deleted from ${collectionName}.`);
      toast.success('Successfully deleted');
      // Optionally, add more UI feedback here (e.g., showing a success message to the user)
    } catch (error) {
      console.error('Error deleting document:', error);
      // Optionally, add more UI feedback here (e.g., showing an error message to the user)
    }
    setIsLoading(false);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* <Button
          variant='outline'
          className=' h-[3.15rem] w-[3.1rem] rounded-full  p-4 text-xl font-light shadow-md focus:border-none active:border-none'
        >
          x
        </Button> */}
        <Button
          variant='outline'
          className='flex w-full items-center  justify-start gap-2 border-0 p-0 px-2 text-[0.71rem] capitalize text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={() => {
            setTimeout(() => {
              console.log('delete');
            }, 500);
          }}
        >
          <Icon name='trash' svgProp={{ className: 'text-black' }}></Icon>
          <p>{btnText}</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader className='flex flex-col items-center'>
          <AlertDialogTitle className='text-center capitalize'>{btnText}</AlertDialogTitle>
          {/* <AlertDialogDescription className='text-center text-gray-400'>
            Deleting this patient’s profile removes all the information for this patient completely
          </AlertDialogDescription> */}
          <AlertDialogDescription className='text-center font-semibold text-red-600'>
            This action can not be reversed!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='sm:justify-center'>
          <Button
            type='submit'
            disabled={isloading}
            className={`bg-red-600 capitalize transition-all duration-150 ease-in-out md:px-8 ${
              isloading ? 'cursor-not-allowed opacity-40' : ''
            }`}
            onClick={() => {
              deleteItemFromCollection(collectionName || '', documentId || '');
            }}
          >
            {isloading ? <Spinner /> : btnText}
          </Button>
          <AlertDialogCancel className='md:px-8'>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
