import prisma from '../../lib/prisma'
import Link from 'next/link'
import SearchInput from './SearchInput'
import SearchEvents from './SearchEvents'

//custom styles here
import styles from './template.module.css'


export default function Template({ children }) {
  return (
    <main className='wrappus_maximus'>

      {/* renders filtered db-stuff in here... */}
      <nav className=' bg-zinc-900 p-5'>
        <h1 className='font-bold text-left text-4xl'>Filter your events here:</h1>
        <SearchInput/>
      </nav>

      <SearchEvents/>

      {/* Here comes the page content */}
      {/* <div className='all_that_page_stuff'>
        {children}
      </div> */}
    </main>
    );
}








