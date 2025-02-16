"use client"

import { useState } from 'react'
import { fetchUploads, shortenUrl, uploadFile } from './utils/axios';
import { Shortend } from './models/models';


/*
Need a simple page - 
box for user_id
box for url to shorten
box for file to upload and then shorten

button to shorten or upload
button to get all urls for user_id
*/

type UrlListDataProps = {
  data: Shortend[] | undefined
}

function ShortenedURLList(props: UrlListDataProps) {
  const data = props.data
  const listItems = data?.map((element) => {
    return (        
        <ul key={element.user_id+element.url} className=''>
          <li className='inline-block pr-2'><a className = "underline text-blue-200 hover:text-blue-600 visited:text-purple-600" href={element.url}>{element.url}</a></li>
          <li className='inline-block'>{element['shortened-slug']}</li>
        </ul>
    )
  })
  return (<div className = 'p-2'>
            <p className='mb-2'>
              Shortened Files and URLs
            </p>
            {listItems}
        </div>)
}

export default function Home() {
  const [urls, setUrls] = useState<Shortend[]>();
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formSubmit = async (formData: FormData) => {
    // Clear Error
    setError("")
    setIsLoading(true)

    const userId = formData.get('user_id')
    const url = formData.get('url')
    const file = formData.get('file')
    const fileName = (file as File).name

    //if user_id not set return error
    if (userId === undefined) {
      setError("Must Set User Id")      
    } else if (url && fileName) {
      //if user_id set and url set and file set - return error
      setError("Can't upload file and shorten url at the same time")      
    } else if (!url && !fileName) {
      //if user_id set, and url or file blank - fetch urls
      const urls = await fetchUploads(userId!.toString())
      console.log(urls.data)
      setUrls(urls.data)
    } else if (url) {
      //if user_id set and url set - shorten url and return slug
      const shortenedUrl = await shortenUrl(userId!.toString(), url.toString())
    } else if (fileName) {
      //if user_id set and file set - upload file and return slug
      const shortened = await uploadFile(userId!.toString(), file as File)
    }
    setIsLoading(false)
  };

  return (
    <div className='p-2'>
      <main>
        <ShortenedURLList data={urls}/>
        <p className='p-2'>
          Enter just user Id to return all urls for that user id
          Enter Url to shorten to shorten an Url
          or upload a file
        </p>
        <form action={formSubmit}>
          <div className='p-2'>User ID*: <input className="w-full bg-transparent placeholder:text-slate-400 text-slate-100 text-sm border border-slate-200 rounded-md px-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="User Id" name="user_id" required /></div>
          <div className='p-2'>Url to Shorten: <input className="w-full bg-transparent placeholder:text-slate-400 text-slate-100 text-sm border border-slate-200 rounded-md px-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Url to Shorten" name="url" /></div>
          <div className='p-2'>File to Upload: <input className="text-sm text-stone-500
   file:mr-5 file:py-1 file:px-3 file:border-[1px]
   file:text-xs file:font-medium
   file:bg-stone-50 file:text-stone-700
   hover:file:cursor-pointer hover:file:bg-blue-50
   hover:file:text-blue-700" type="file" name="file" /></div>
          <div className='p-2'><button className='shadow hover:bg-blue-500 p-2 rounded text-slate-900 bg-slate-200' type="submit">Check/Upload</button></div>
        </form>
        <p className='p-2'>{error}</p>
      </main>
    </div>
  );
}
