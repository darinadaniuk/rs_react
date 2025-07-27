import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from '@rs-react/app.tsx';
import { CardDetails } from '@rs-react/components';
import { About, Cards } from '@rs-react/pages/index.ts';

import './index.css';

const rootElement = document.getElementById('root');

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          element: <Cards />,
          children: [
            {
              path: '',
              element: null,
            },
            {
              path: 'details/:id',
              element: <CardDetails />,
            },
          ],
        },
        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ],
  {
    basename: '/rs_react/',
  }
);

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
