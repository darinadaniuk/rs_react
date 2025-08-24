import { create } from 'zustand';

type PhotoState = {
  base64: string;
  saveBase64: (b64: string) => void;
  clear: () => void;
};

export const usePhotoStore = create<PhotoState>((set) => ({
  base64: '',
  saveBase64: (b64) => set({ base64: b64 }),
  clear: () => set({ base64: '' }),
}));
