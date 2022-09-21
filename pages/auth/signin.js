import {db} from "../../firebase"
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useRouter } from "next/router"

export default function Signin() {
    const router = useRouter()

    const onGoogleClick = async() => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            const user = auth.currentUser.providerData[0]
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    username: user.displayName.split(" ").join("").toLocaleLowerCase(),
                    userImg: user.photoURL,
                    uid: user.uid,
                    timestamp: serverTimestamp()
                })
            }

            router.push("/")
        } catch (error) {
            console.log(error)
        }
        
    }

  return (
    <div className="flex justify-center mt-20 space-x-4">
        <img className="hidden md:inline-flex object-cover md:w-60" src="/images/twitter_phone.png" alt="twitter-phone" />
        <div className="">            
                <div className="flex flex-col items-center">
                    <img src="/images/twitter-logo.png" 
                        alt="twitter-logo"
                        className="w-40 object-cover"
                     />
                    <p className="text-sm my-8">
                        This app was created solely for learning purposes
                    </p>
                    <button className="bg-red-400 text-white rounded-full px-6 py-3 hover:bg-red-500
                    shadow-md" onClick={onGoogleClick}>
                        Sign in with Google
                    </button>
                </div>            
        </div>
    </div>
  )
}

