"use client"
import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Image from "next/image"
import axios  from 'axios'
import toast  , {Toaster } from 'react-hot-toast';

interface IncomingData {
    predicted_class: string, 
    confidence: number ,
     precaution: [string]  |null, 
     causes: string | null
    }


export default function TomatoLeafDetection() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [data , setdata] = useState<IncomingData | null>(null)

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile.type.startsWith('image/')) {
      setFile(droppedFile)
    } else {
      alert('Please upload an image file')
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
   
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
    } else {
      alert('Please upload an image file')
    }
  }, [])

  const handleUpload = useCallback(async()=>{
    if(file !==null){
        const url = process.env.NEXT_PUBLIC_SERVER_URL as string

        const loadingToastId = toast.loading("Uploading ...");
        const formData = new FormData();
        formData.append('file', file)
        const data = await axios.post(url  , formData , {
            
        })
        setdata(data.data)
        toast.dismiss(loadingToastId)
        
  
    }
   
  },[file])

  return (
    <div className="flex flex-col min-h-screen">
     <Toaster/> 
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tomato Leaf Detection</h1>
          <Button variant="secondary">About</Button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div>
              <Image
                src={URL.createObjectURL(file)}
                alt="Uploaded tomato leaf"
                className="max-w-full max-h-64 mx-auto mb-4"
                width={300} // Set a width value based on the original image aspect ratio
                height={300} // Set a height value based on the original image aspect ratio
               
              />
              <p className="text-lg font-semibold">{file.name}</p>
              <div className='flex items-center gap-x-4 justify-center'>
              <Button onClick={() => {setFile(null)  
                setdata(null)}} className="mt-4">
                Remove Image
              </Button>
              <Button onClick={handleUpload} className="mt-4 ">
                Upload Image
              </Button>
              </div>
              
            </div>
          ) : (
            <div>
              <Leaf className="w-16 h-16 mx-auto mb-4 text-primary" />
              <p className="text-lg mb-4">Drag and drop your tomato leaf image here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <Button asChild>
                <label>
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                </label>
              </Button>
            </div>
          )}

{file && data && <div className='flex items-center justify-center flex-col  w-full mt-3'> 

<div> <b>Disease : </b>  <span className={`${data.predicted_class == "Tomato_healthy"?"text-green-600" : "text-red-600"}`}>  {data.predicted_class} </span> </div>
<div><b>Confidence : </b> <span className='text-green-700'>   {data.confidence}%</span>  </div>
</div>}
        </div>

     

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How to Upload an Image:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Drag and drop an image file into the designated area above.</li>
            <li>Alternatively, click the Choose File button to select an image from your device.</li>
            <li>Ensure the image is clear and focuses on the tomato leaf you want to analyze.</li>
            <li>Once uploaded, the image will be displayed, and you can remove it if needed.</li>
            <li>Click On Upload Image Button to See the Result .</li>

          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Tomato Leaf Detection. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}