import { LazyLoadImage } from 'react-lazy-load-image-component';
import pointingGirl from 'assets/image/pointing-girl.png?format=webp&imagetools';
import Icon from 'utils/Icon';
import { useNavigate } from 'react-router-dom';
import { Input } from 'components/shadcn/input';
import CONSTANTS from 'constant';
import InputErrorWrapper from 'components/Hocs/InputError';
import { authDetailsInterface } from 'types';
import { processError } from 'helper/error';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import customerService from 'services/customer';
import { useMutation } from '@tanstack/react-query';
import { resetPasswordFormSchema, resetPasswordInterface } from './reset.model';

import useStore from 'store';
import { ArrowLeft } from 'lucide-react';
const ResetPassword = () => {
  const navigate = useNavigate();
  const { setAuthDetails, setLoggedIn } = useStore((store) => store);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<resetPasswordInterface>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'all',
  });

  const { mutate, isLoading } = useMutation<authDetailsInterface, any, resetPasswordInterface>({
    mutationFn: ({ password, confirmPassword }) =>
      customerService.customerLogin({
        email: confirmPassword,
        password,
      }),
    onSuccess: (data) => {
      setAuthDetails(data);
      setLoggedIn(true);
      navigate(`/app/${CONSTANTS.ROUTES['dashboard']}`);
    },
    onError: (err) => {
      processError(err);
    },
  });

  const onSubmit: SubmitHandler<resetPasswordInterface> = (data) => {
    mutate(data);
  };

  return (
    <div className='flex h-full w-full items-center bg-secondary-1'>
      <div className='mx-auto w-full  px-4 md:max-w-[calc(96px+494px)] md:px-[3rem]'>
        <div className='mx-auto flex w-full flex-col items-start justify-center gap-8'>
          <div className='flex w-full flex-col items-center gap-8'>
            <div className=' flex cursor-pointer items-center' onClick={() => navigate(`/`)}>
              <Icon name='nfmLogo' svgProp={{ className: 'w-[8rem] h-[5rem]' }} />
            </div>

            <h5 className='tracking-[0.18px]] font-inter text-[20px] font-[600] leading-[32px]'>
              Reset Password
            </h5>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='mx-auto flex w-full flex-col gap-4 rounded-lg  bg-white p-6 px-8 pb-8 shadow-sm '
          >
            <div className='relative'>
              <label className='  text-[0.8rem] font-medium'>Old password</label>
              <InputErrorWrapper error={errors?.password?.message}>
                <Input
                  {...register('password')}
                  className='mt-2 w-full  py-3 placeholder:text-primary-9/[0.38]'
                  // placeholder='Email'
                />
              </InputErrorWrapper>
            </div>
            <div className='relative'>
              <label className='  text-[0.8rem] font-medium'>New password</label>
              <InputErrorWrapper error={errors?.confirmPassword?.message}>
                <Input
                  {...register('confirmPassword')}
                  className='mt-2 w-full  py-3 placeholder:text-primary-9/[0.38]'
                  // placeholder='Email'
                />
              </InputErrorWrapper>
            </div>
            <button
              onClick={() => navigate(`/app/${CONSTANTS.ROUTES['dashboard']}`)}
              className=' w-full rounded-[8px] bg-primary-1 py-2 text-xs font-[500] text-white shadow-3 transition-opacity duration-300 ease-in-out hover:opacity-90'
            >
              <span className='leading-[0.46px]'>Reset Password</span>
            </button>
          </form>
          <button
            onClick={() => navigate(`/${CONSTANTS.ROUTES['login']}`)}
            className='flex cursor-pointer items-center gap-1 place-self-center text-xs font-medium leading-[21px] tracking-[0.15px] text-primary-4 hover:underline'
          >
            {/* <Icon name='arrowBackTailess' svgProp={{ width: 14 }} /> */}
            <ArrowLeft className='text-primary-4' size={14} />
            <span> Return to log in</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
