import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Gender = 'female' | 'male' | 'other';

export type UserData = {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: Gender;
  country?: string;
  tc: boolean;
  pictureBase64?: string | null;
};

type UserStore = {
  data: Partial<UserData>;
  save: (data: UserData) => void;
  reset: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      data: {},
      save: (data) => set({ data }),
      reset: () => set({ data: {} }),
    }),
    {
      name: 'user-data',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
