/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { BSCTestnet, Config, DAppProvider } from '@usedapp/core';
import { IntlProvider } from 'react-intl';
import Vitenamese from './lang/vi.json';
import English from './lang/en.json';
const locale = navigator.language;
let lang;
if (locale === 'vi') {
  lang = Vitenamese;
} else {
  lang = English;
}
// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const config: Config = {
  readOnlyChainId: BSCTestnet.chainId,
  readOnlyUrls: {
    [BSCTestnet.chainId]: BSCTestnet.rpcUrl || '',
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IntlProvider locale={locale} messages={Vitenamese}>
      {/* <DAppProvider config={config}> */}
      <RouterProvider router={router} />
      {/* </DAppProvider> */}
    </IntlProvider>
  </React.StrictMode>,
);
