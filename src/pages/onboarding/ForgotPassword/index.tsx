import { LazyLoadImage } from 'react-lazy-load-image-component';
import pointingGirl from 'assets/image/pointing-girl.png?format=webp&imagetools';
import Icon from 'utils/Icon';
import { useNavigate } from 'react-router-dom';
import { Input } from 'components/shadcn/input';
import CONSTANTS from 'constant';
import InputErrorWrapper from 'components/Hocs/InputError';
import { customerLoginFormInterface, customerLoginFormSchema } from '../Login/login.model';
import { authDetailsInterface } from 'types';
import { processError } from 'helper/error';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import customerService from 'services/customer';
import { useMutation } from '@tanstack/react-query';

import useStore from 'store';
import { ArrowLeft } from 'lucide-react';
const ForgotPassword = () => {
  const navigate = useNavigate();
  const { setAuthDetails, setLoggedIn } = useStore((store) => store);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<customerLoginFormInterface>({
    resolver: zodResolver(customerLoginFormSchema),
    mode: 'all',
  });

  const { mutate, isLoading } = useMutation<authDetailsInterface, any, customerLoginFormInterface>({
    mutationFn: ({ email, password }) =>
      customerService.customerLogin({
        email,
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

  const onSubmit: SubmitHandler<customerLoginFormInterface> = (data) => {
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
              Forgot Password?
            </h5>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='mx-auto flex w-full flex-col gap-4 rounded-lg  bg-white p-6 px-8 pb-8 shadow-sm '
          >
            <div className='relative'>
              <label className=' text-[0.8rem] font-medium'>Email Address</label>
              <InputErrorWrapper error={errors?.email?.message}>
                <Input
                  {...register('email')}
                  className='mt-2 w-full  py-3 placeholder:text-primary-9/[0.38]'
                  // placeholder='Email'
                />
              </InputErrorWrapper>
            </div>
            <button
              onClick={() => navigate(`/${CONSTANTS.ROUTES['reset-password']}?key=forgot-password`)}
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

export default ForgotPassword;
