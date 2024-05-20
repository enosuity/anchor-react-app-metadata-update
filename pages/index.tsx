import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'
// import { BalanceDisplay } from '../components/BalanceDisplay'
import { PingButton } from '../components/PingButton'
import Head from 'next/head'

const Home: NextPage = (props) => {

  return (
    <div className={styles.App}>
      <Head>
        <title>Wallet-Adapter</title>
        <meta
          name="description"
          content="Wallet-Adapter"
        />
         <link rel="icon" href="/sol.ico" />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <PingButton />
          <div>
            Note: Click on button to update metadata of a token
          </div>
        </div>
      </WalletContextProvider >
    </div>
  );
}

export default Home;