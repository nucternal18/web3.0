import React from "react";
import type { AppProps /*, AppContext */ } from "next/app";
import "../styles/globals.css";

import { TransactionProvider } from "../context/TransactionContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  );
}

export default MyApp;
