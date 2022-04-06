/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-2xl">LOOKSCOMMON</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="shadow border rounded px-1 mr-6 text-purple-700 hover:bg-gray-200">
              Home
            </a>
          </Link>
          <Link href="/create-nft">
            <a className="shadow border rounded px-1 mr-6 text-purple-700 hover:bg-gray-200">
              Create
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="shadow border rounded px-1 mr-6 text-purple-700 hover:bg-gray-200">
              My Portfolio
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="shadow border rounded px-1 mr-6 text-purple-700 hover:bg-gray-200">
              Dashboard
            </a>
          </Link>
          <Link href="/make-transfer">
            <a className="shadow border rounded px-1 mr-6 text-purple-700 hover:bg-gray-200">
              Transfer
            </a>
          </Link>
          <Link href="/schedule-transfers">
            <a className="shadow border rounded px-1 mr-6 text-purple-700 hover:bg-gray-200">
              Schedule Transfer
            </a>
          </Link>
          
          <input class="shadow border rounded text-gray-700 leading-tight hover:bg-gray-200 focus:outline-none focus:shadow-outline focus:bg-white" 
                 type="text" id="address" name="address" placeholder="Address of a user"/>
          <Link href="/user-nfts">
            <a className="shadow border rounded px-1 mr-6 text-purple-700 hover:bg-gray-200">
              Search
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp