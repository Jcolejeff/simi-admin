import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authSlice, { AuthStateType } from './auth';
import featuresSlice, { FeaturesStateType } from './features';

export type StoreType = AuthStateType & FeaturesStateType;

const useStore = create<StoreType>()(
  persist(
    devtools((...a) => ({
      ...authSlice(...a),
      ...featuresSlice(...a),
    })),
    {
      name: 'store',
    },
  ),
);

export default useStore;
