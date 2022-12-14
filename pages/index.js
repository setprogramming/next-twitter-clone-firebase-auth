import Head from 'next/head'
import CommentModal from '../components/CommentModal'
import Feed from '../components/Feed'
import Sidebar from '../components/Sidebar'
import Widgets from '../components/Widgets'

export default function Home({newsResults, randomUsersResults}) {
  return (
    <div className="">
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex min-h-screen mx-auto'>
        {/* SIDEBAR */}
        <Sidebar />

        {/* FEED */}
        <Feed />

        {/* WIDGETS */}
        <Widgets newsResults={newsResults.articles} randomUsersResults={randomUsersResults.results} />

        {/* MODAL */}
        <CommentModal />
      </main>
      
    </div>
  )
}


export async function getServerSideProps() {
  const newsResults = await fetch("https://saurav.tech/NewsAPI/top-headlines/category/entertainment/us.json")
                      .then((res) => res.json())

  // Who to follow section
  let randomUsersResults = []

  try {
    const res = await fetch(
      "https://randomuser.me/api/?results=30&inc=name,login,picture"
    )

    randomUsersResults = await res.json()
  } catch (e) {
    randomUsersResults = []
  }

  return {
    props: {
      newsResults,
      randomUsersResults
    },
  }
}
