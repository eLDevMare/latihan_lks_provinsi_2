import { useEffect, useState } from "react"
import image from "../assets/thumbnail.png"
import axios from "axios"
import { useParams } from "react-router-dom"

const Detail = () => {
    const token = localStorage.getItem("token")
    const [data, setData] = useState([])
    const [score, setScore] = useState([])
    const {slug} = useParams()

    const getData = async() => {

        try{
            const response = await axios.get(`http://localhost:8000/api/v1/games/${slug}`, {
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })

            const responseScore = await axios.get(`http://localhost:8000/api/v1/games/${slug}/scores`,{
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })
            

            console.log(response.data.content)
            console.log(responseScore.data.scores)

            setScore(responseScore.data.scores)
            setData(response.data.content)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return(
        <div>
                <main>
                    <div class="hero py-5 bg-light">
                        <div class="container text-center"> 
                            <h2 class="mb-1">
                            {data.title}
                            </h2> 
                            
                            <a href="profile.html" class="btn btn-success">{data.author}</a>
                            <div class="text-muted">
                            {data.description}
                            </div>
                            <h5 class="mt-2">Last Versions v{data.scoreCount} ({data.uploadTimeStamp})</h5>
                        </div>
                    </div>

                    <div class="py-5">
                        <div class="container"> 

                            <div class="row justify-content-center ">
                            <div class="col-lg-5 col-md-6"> 
                                                
                                <div class="row">
                                <div class="col">
                                    <div class="card mb-3">
                                    <div class="card-body">
                                        <h5>Top 10 Leaderboard</h5>
                                        <ol>
                                            {
                                                score?.splice(0,10).map((item) => (
                                                    <li>{item.username} ({item.score})</li>
                                                ))
                                            }
                                        </ol>
                                    </div>
                                    </div>
                                </div>
                                <div class="col">
                                    <img src={image} alt="Demo Game 1 Logo" style={{width: "100%"}}/>
                                    <a href={`http://localhost:8000/api/games/${slug}/v${data.scoreCount}`} class="btn btn-primary w-100 mb-2 mt-2">Download Game</a>
                                </div>
                                </div>

                                
                                <a href="/manage" class="btn btn-danger w-100">Back</a>

                            </div>
                            </div>  
                            
                        </div>
                    </div>
                </main>
        </div>
    )
}


export default Detail