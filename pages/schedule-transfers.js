/* pages/create-nft.js */
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Lease() {
  const [params, updateParams] = useState({ h: '', tokenId: '', addressTo: '', h2: ''})
  const [state, updateState] = useState("leasing");
  useEffect(() => {
    Lease();
  }, [state])
  const router = useRouter()

  async function SendInSchedule() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const success = await marketplaceContract.setTransferTime(document.getElementById("h").value, document.getElementById("tokenId").value, document.getElementById("addressTo").value, document.getElementById("h2").value)
    if (success) {
      setState("Success");
    } else {
      setState("Failure")
    }
  }
  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }
  if (state === "Success") {
    return (
      <div>
      <h1 className="py-10 px-20 text-3xl">Successfully scheduled the lease</h1>
      <button onClick={e => updateState("leasing")}>
        OK
      </button>
      </div>
    )
  }
  if (state === "Failure") {
    return (
      <div>
      <h1 className="py-10 px-20 text-3xl">Failed to schedule the lease</h1>
      <button onClick={e => updateState("leasing")}>
        OK
      </button>
      </div>
    )
  }
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <h2 className="mt-2 text-2xl py-5">Token ID to transfer</h2>
        <input 
          id = "leaseTokenId"
          placeholder="Token ID"
          className="mt-2 border rounded p-4"
          onChange={e => updateParams({ ...params, tokenId: e.target.value })}
        />
        <input
          id = "h"
          placeholder="Transfer time: a decimal/integer measurement in hours, e.g., 1 or 0.5"
          className="mt-2 border rounded p-4"
          onChange={e => updateParams({ ...formInput, h: e.target.value })}
        />
        <input
          id = "toAddress"
          placeholder="Destination Address"
          className="mt-2 border rounded p-4"
          onChange={e => updateParams({ ...formInput, addressTo: e.target.value })}
        />
        <input
          id = "h2"
          placeholder="Return time: a decimal/integer measurement in hours after the transfer time, e.g., 1 or 0.5"
          className="mt-2 border rounded p-4"
          onChange={e => updateParams({ ...formInput, h2: e.target.value })}
        />
        <button onClick={SendInSchedule} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Schedule Transfer
        </button>
      </div>
    </div>
  )
}