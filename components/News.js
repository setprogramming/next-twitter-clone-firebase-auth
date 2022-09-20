

export default function News({article}) {
  return (
    <a rel="noreferrer" href={article.url} target="_blank">
        <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200
         transition duration-500 ease-out">
            <div className="">
                <h6 className="text-sm font-bold text-gray-600">{article.title}</h6>                
            </div>
            <img className="rounded-lg" width="70" src={article.urlToImage} alt="" />
        </div>
    </a>
  )
}
