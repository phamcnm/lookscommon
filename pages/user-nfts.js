/* pages/my-nfts.js */
var Web3 = require('web3');
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'



import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function MyAssets() {

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [address, setAddress] = useState("")
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [document.getElementById("address")])
  async function loadNFTs() {
    setAddress(document.getElementById("address").value)
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    var data
    var isValidAddress
    if (!web3.utils.isAddress(document.getElementById("address").value)) {
      data = await marketplaceContract.fetchUserNFTs("0x0000000000000000000000000000000000000000")
      isValidAddress = false
    } else {
      data = await marketplaceContract.fetchUserNFTs(document.getElementById("address").value)
      isValidAddress = true
    }
    
    // document.getElementById("address").innerHTML = ""
    // document.getElementById("demo").innerHTML = document.getElementById("address-form").elements['address'].value;
    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        tokenURI
      }
      return item
    }))
    setNfts(items)
    if (isValidAddress) {
      setLoadingState('loaded') 
    } else {
      setLoadingState('not-valid-address') 
    }
    
  }
  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }
  if (!window.ethereum) return (<h1 className="py-10 px-20 text-3xl">No wallet is connected</h1>)
  if (loadingState === 'not-valid-address') return (<h1 className="py-10 px-20 text-3xl">Not a valid address</h1>)
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No items owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <h2 className="text-2xl py-2">User {document.getElementById("address").value}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                  <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => listNFT(nft)}>List</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}