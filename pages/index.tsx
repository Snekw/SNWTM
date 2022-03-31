import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Footer } from '../components/footer'

const Home: NextPage = () => {
  return (
    <div className='flex h-full flex-col'>
      <Head>
        <title>TM Tools</title>
        <meta name="description" content="Snekw's TM tools" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-screen content">
        <ul>
          <li><a href={'/map'}>TM Game State</a></li>
        </ul>
      </main>

      <Footer />
    </div>
  )
}

export default Home
