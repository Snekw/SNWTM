import type { NextPage, NextPageContext } from 'next'
import Head from 'next/head'
import { Footer } from '../../components/footer'
import { UserModel } from '../../db/models/user'
import dbConnect from '../../db'
import { parseCookies, setSession } from '../../lib/cookie'
import { ChangeEvent, useRef, useState } from 'react'
import { atom, useAtom, PrimitiveAtom } from "jotai";
import { splitAtom, useHydrateAtoms } from "jotai/utils";
import { textParse } from '../../lib/textParser'
import { useRouter } from 'next/router'
import { generate as shortUUID } from "short-uuid";

const textTemplate = `Map: "{mapName}" by {mapAuthor} AT: {mapAuthorTime}`

export const getServerSideProps = async (context: NextPageContext) => {
  const data = parseCookies(context.req)
  await dbConnect()
  if (context.res) {
    if (!data || Object.keys(data).length === 0 || data.token === undefined) {
      const user = await UserModel.create({
        texts: [Buffer.from(JSON.stringify({ text: textTemplate, id: shortUUID().toString() })).toString('base64')]
      })
      setSession(context.res, {
        token: user.token
      })
      return {
        redirect: {
          permanent: false,
          destination: `/map`
        }
      }
    }
    const user = await UserModel.findOne({ token: data.token })
    if (user) {
      console.log(user)
      setSession(context.res, {
        token: user.token
      })
      return {
        props: {
          viewToken: user.viewToken,
          token: user.token,
          map: user.map || null,
          texts: user.texts.map((text: string) => JSON.parse(Buffer.from(text, 'base64').toString())),
          host: process.env.SNW_TM_HOST
        },
      }
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: `/map`
    },
  }
}
interface StateIndexProps {
  token: string
  map?: string
  viewToken: string
  texts: Text[]
  host: string
}

const mapInfoAtom = atom<Record<string, string | Record<string, string>>>({})
interface Text {
  text: string,
  id: string
}
const textsAtom = atom<Text[]>([])
const textsAtomAtom = splitAtom(textsAtom)
const viewTokenAtom = atom<string>('')
const tokenAtom = atom<string>('')

const Text = (props: {
  text: PrimitiveAtom<Text>
  host: string
}) => {
  const [text, setText] = useAtom<Text, Text, void>(props.text)
  const [mapInfo] = useAtom(mapInfoAtom)
  const [preview, setPreview] = useState(textParse(text.text, mapInfo))
  const [token] = useAtom(tokenAtom)
  const [viewToken] = useAtom(viewTokenAtom)
  const [, removeTextAtom] = useAtom(textsAtomAtom)

  const handleTextEdit = (e: ChangeEvent<HTMLInputElement>) => {
    setText({ ...text, text: e.target.value })
    setPreview(textParse(e.target.value, mapInfo))
  }

  const save = async () => {
    const res = await fetch(`/api/map/edit/string`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        text: text.text,
        id: text.id
      })
    })
  }

  const deleteText = async () => {
    const res = await fetch(`/api/map/edit/string`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        text: text.text,
        id: text.id
      })
    })

    removeTextAtom(props.text)
  }

  return (
    <div className='p-2 border rounded'>
      <input className='border rounded p-1 w-full' onChange={handleTextEdit} value={text.text}></input>
      <span>Preview:</span>
      <pre className={'bg-gray-100 rounded p-1 ' + (text.text.length > 400 ? 'bg-red-100' : '')}><code>{preview}</code></pre>
      <span>URL:</span>
      <pre className='bg-gray-100 rounded p-1'><code>{`${props.host}/api/map/view/${viewToken}/${text.id}`}</code></pre>
      <button className='bg-green-100 border rounded p-1 m-1' onClick={save}>Save</button>
      <button className='bg-red-100 border rounded p-1 m-1' onClick={deleteText}>Delete</button>
    </div>
  )
}

const StateIndex: NextPage<StateIndexProps> = (props) => {
  useHydrateAtoms([
    [textsAtom, props.texts ? props.texts : []],
    [tokenAtom, props.token],
    [viewTokenAtom, props.viewToken],
    [mapInfoAtom, props.map ? JSON.parse(Buffer.from(props.map, 'base64').toString()) : undefined]
  ] as any)

  const [mapInfo] = useAtom(mapInfoAtom)

  const [texts, setTexts] = useAtom(textsAtom)
  const [textsAtoms, setTextsAtoms] = useAtom(textsAtomAtom)
  const [token] = useAtom(tokenAtom)
  const ref = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleAddNew = async () => {
    const newText = { text: '', id: shortUUID().toString() }
    setTexts([...texts, newText])

    const res = await fetch(`/api/map/edit/string`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        text: newText.text,
        id: newText.id
      })
    })
  }

  const restoreToken = async () => {
    const t = ref.current?.value
    if (!t || t === '') {
      return
    }

    const res = await fetch(`/api/map/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        token: t,
      })
    })

    router.reload()
  }

  return (
    <div className='flex h-full flex-col'>
      <Head>
        <title>TM Game State | TM Tools</title>
        <meta name="description" content="Trackmania game state tools" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className="flex w-screen content flex-col">
        <p>
          A tool to get the latest played map info in formatted text for chat bots.
        </p>
        <br />
        <p>
          The token should be kept <b>PRIVATE</b> and is stored as cookie so same token is used as long as the browser keeps the cookie.
          You can also restore the cookie by providing the token in the input box below and pressing <i>Restore Token</i>.
        </p>
        <br />
        <p>
          Note that the token will expire in <b>24 hours</b> if no data is sent from Trackmania with that token.
          The token will also expire if there is longer than <b>90 days</b> since last data received from Trackmania.
        </p>
        <p>
          Use with <a className='text-blue-800' href='https://openplanet.dev/plugin/snwtmmap'>SNW Map Util OpenPlanet plugin</a>.
        </p>
        <hr />
        <br />
        <div className='flex flex-row'>
          <label htmlFor='token-restore'>Restore Token</label>
          <input ref={ref} className='rounded border' id='token-restore'></input>
          <button onClick={restoreToken} className='bg-gray-100 rounded border w-fit'>Restore Token</button>
        </div>
        <p>Keep the Token private.</p>
        <details><summary>Token</summary><code>{props.token}</code></details>
        <p>
          View Token is considered not private and is visible on url.
        </p>
        <details><summary>View Token</summary> <code>{props.viewToken}</code></details>
        <br />
        <p>Endpoint: {props.host}/api/map/update</p>
        <details open>
          <summary>Latest Map Info</summary>
          {mapInfo ? (
            <ul>
              <li>Map: {mapInfo.mapName}</li>
              <li>Author: {mapInfo.mapAuthor}</li>
              <li>MapUid: {mapInfo.mapUid}</li>
            </ul>
          ) : (
            <p>No map info submitted yet</p>
          )}

        </details>
        <br />
        <details open>
          <summary>Texts</summary>
          {
            textsAtoms.map((text, index) => (
              <Text text={text} key={index} host={props.host} />
            ))
          }
          <button className='border rounded p-1' onClick={handleAddNew}>New</button>
          <details>
            <summary>Help</summary>
            <p>Available formatting options:</p>
            <ul>
              <li>mapName</li>
              <li>mapAuthor</li>
              <li>mapUid</li>
              <li>mapAuthorTime</li>
              <li>mapGoldTime</li>
              <li>mapSilvertime</li>
              <li>mapBronzeTime</li>
            </ul>
            <details>
              <summary>TMX options</summary>
              <p>Details <a href='https://api2.mania.exchange/Method/Index/37'>https://api2.mania.exchange/Method/Index/37</a></p>
              <p>These options are available if the map is uploaded to Trackmania Exchange</p>
              <p>Usage: &#123;tmx.TrackID&#125;</p>
              <ul>
                <li>TrackID</li><li>UserID</li><li>Username</li><li>GbxMapName</li><li>AuthorLogin</li><li>MapType</li><li>TitlePack</li><li>TrackUID</li><li>Mood</li><li>DisplayCost</li><li>ModName</li><li>Lightmap</li><li>ExeVersion</li><li>ExeBuild</li><li>AuthorTime</li><li>ParserVersion</li><li>UploadedAt</li><li>UpdatedAt</li><li>Name</li><li>Tags</li><li>TypeName</li><li>StyleName</li><li>EnvironmentName</li><li>VehicleName</li><li>UnlimiterRequired</li><li>RouteName</li><li>LengthName</li><li>DifficultyName</li><li>Laps</li><li>ReplayWRID</li><li>ReplayWRTime</li><li>ReplayWRUserID</li><li>ReplayWRUsername</li><li>TrackValue</li><li>Comments</li><li>MappackID</li><li>Unlisted</li><li>Unreleased</li><li>Downloadable</li><li>RatingVoteCount</li><li>RatingVoteAverage</li><li>HasScreenshot</li><li>HasThumbnail</li><li>HasGhostBlocks</li><li>EmbeddedObjectsCount</li><li>EmbeddedItemsSize</li><li>IsMP4</li><li>SizeWarning</li><li>AwardCount</li><li>CommentCount</li><li>ReplayCount</li><li>ImageCount</li><li>VideoCount</li>
              </ul>
            </details>
          </details>

          <details open>
            <summary>Chat Bots</summary>
            <h2>Nightbot</h2>
            <p></p>
            <pre className='bg-gray-100 rounded p-1'><code>!commands add !map $(urlfetch https://tm.snekw.com/api/map/view/ew3pDGcne3EUc2h3civN2z/eUwwEtejsrL2QnFjt872K9 )</code></pre>
          </details>
        </details>
      </main>
      <Footer />
    </div >
  )
}

export default StateIndex