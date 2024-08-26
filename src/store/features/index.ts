import { StateCreator } from 'zustand';

export type FeaturesStateType = {
  categories: any;
  setCategories: (arg: any) => void;
  subcategories: any;
  setSubcategories: (arg: any) => void;
  isLoading: boolean;
  setLoading: (arg: boolean) => void;
  isEditing: boolean;
  setIsEditing: (arg: boolean) => void;
  editId: string;
  setEditId: (arg: string) => void;
  editData: any;
  setEditData: (arg: any) => void;
};

const featuresSlice: StateCreator<FeaturesStateType, [['zustand/devtools', never]], []> = (
  set,
) => ({
  categories: [],
  subcategories: [],
  isLoading: false,
  isEditing: false,
  editId: '',
  editData: {},
  setEditData: (arg) => {
    set({ editData: arg });
  },
  setEditId: (arg) => {
    set({ editId: arg });
  },
  setIsEditing: (arg) => {
    set({ isEditing: arg });
  },

  setLoading: (arg) => {
    set({ isLoading: arg });
  },
  setSubcategories: (arg) => {
    set({ subcategories: arg });
  },
  setCategories: (arg) => {
    set({ categories: arg });
  },
});

export default featuresSlice;
