import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { useEffect } from "react";
import Layout from "../src/components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const APP_ID = process.env.NEXT_PUBLIC_APPID;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVERURL;
  let isServerInfo = APP_ID && SERVER_URL ? true : false;

  if (!APP_ID || !SERVER_URL) {
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file."
    );
  }

  if (isServerInfo) {
    return (
      <MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MoralisProvider>
    );
  }
}

export default MyApp;
