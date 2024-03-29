import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Footer } from '../components/footer'

const Home: NextPage = () => {
  return (
    <div className='flex h-full w-full flex-col background-image'>
      <Head>
        <title>TM Tools</title>
        <meta name="description" content="Snekw's TM tools" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className="flex w-screen content justify-center">
        <div className='self-center'>
          <ul>
            <li><button className='button'><a href={'/map'}>TM Game State</a></button></li>
          </ul>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
