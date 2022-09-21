import { EmojiHappyIcon, PhotographIcon, XIcon } from "@heroicons/react/outline"
import { useState, useRef } from "react"
import { db, storage } from "../firebase"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, uploadString, ref } from "firebase/storage"
import { useRecoilState } from "recoil"
import { userState } from "../atom/userAtom"
import { signOut, getAuth } from "firebase/auth"

export default function Input() {     
    const [input, setInput] = useState("")
    const [currentUser, setCurrentUser] = useRecoilState(userState)
    const [selectedFile, setSelectedFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const filePickerRef = useRef(null)
    const auth = getAuth()

    const sendPost = async () => {
        if(loading) return

        setLoading(true)

        const docRef = await addDoc(collection(db, "posts"), {
            id: currentUser.uid,
            text: input,
            userImg: currentUser.userImg,
            timestamp: serverTimestamp(),
            name: currentUser.name,
            username: currentUser.username,
        })

        const imageRef = ref(storage, `posts/${docRef.id}/image`)

        if(selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url")
                    .then(async () => {
                        const downloadURL = await getDownloadURL(imageRef)
                        await updateDoc(doc(db, "posts", docRef.id), {
                            image: downloadURL,
                        })
                    })
        }

        setInput("")
        setSelectedFile(null)
        setLoading(false)
    }

    const addImageToPost = (e) => {
        const reader = new FileReader()

        if(e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }

    }

    function onSignOut() {
        signOut(auth)
        setCurrentUser(null)
    }

  return (
    <>
        {currentUser && (
            <div className="flex border-b border-gray-200 p-3 space-x-3">
            <img 
                onClick={onSignOut}
                src={currentUser?.userImg} alt="profile-picture" 
                className="h-10 w-10 rounded-full xl:mr-2 cursor-pointer" 
            />
            <div className="w-full divide-y divide-gray-200">
                <div className="">
                    <textarea className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 min-h-[50px] text-gray-700"           
                        rows="2"  
                        placeholder="What's happening?" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}>
                    </textarea>
                </div>
                {selectedFile && (
                    <div className="relative">
                        <XIcon className="h-9 text-black bg-white rounded-full p-2 absolute cursor-pointer 
                        shadow-md top-1 left-1" 
                        onClick={() => setSelectedFile(null)} />
                        <img src={selectedFile} className={`${loading && "animate-pulse"}`} />
                    </div>
                )}
                <div className="flex items-center justify-between pt-3">
                    {!loading && (
                        <>
                            <div className="flex">
                                <div className="" onClick={() => filePickerRef.current.click()}>
                                    <PhotographIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                                    <input type="file" hidden ref={filePickerRef} onChange={addImageToPost} />
                                </div>                        
                                <EmojiHappyIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                            </div>
                            <button className="bg-blue-400 text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-blue-500 disabled:opacity-50" disabled={!input.trim()} onClick={sendPost}>
                                Tweet
                            </button>
                        </>                        
                    )}                    
                </div>
            </div>
        </div>
        )}   
    </>    
  )
}
