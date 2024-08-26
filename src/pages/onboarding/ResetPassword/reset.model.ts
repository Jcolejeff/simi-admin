import { z } from 'zod';

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Password must be at least 8 characters long',
    }),
    otp: z
      .string()
      .min(4, {
        message: 'OTP must be at least 4 characters long',
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type resetPasswordInterface = z.infer<typeof resetPasswordFormSchema>;
