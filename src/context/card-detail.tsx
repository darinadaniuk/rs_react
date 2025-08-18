'use client';

import { createContext } from 'react';

import type { CardItem } from '@rs-react/interfaces';

export const CardDetailContext = createContext<CardItem | undefined>(undefined);
