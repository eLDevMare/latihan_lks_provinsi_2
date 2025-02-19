import axios from "axios"
import image from "../assets/thumbnail.png"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const User = () => {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username") 
    const navigate = useNavigate()
    const [data, setData] = useState([])

    const getUser = async() => {
        const response = await axios.get(`http://localhost:8000/api/v1/users/${username}`, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })

        console.log(response.data.data[0])
        setData(response.data.data[0])
    }   


    useEffect(() => {
        if(!token){
            navigate("/signup")
        }

        getUser()
    },[])
    return(
        <div>
                <main>
      <div class="hero py-5 bg-light">
         <div class="container text-center"> 
            <h2 class="mb-1">
              {data.username}
            </h2> 
            <h5 class="mt-2">Last Login {data.registeredTimestamp}</h5>
         </div>
      </div>

      <div class="py-5">
         <div class="container"> 

            <div class="row justify-content-center ">
               <div class="col-lg-5 col-md-6"> 
                        
              <h5>Highscores per Game</h5>
              <div class="card-body">
                <ol>
                    {
                        data.hightScore?.map((item) => (
                            <li><a href={`/detail/${item.game.slug}`}>{item.game.title} ({item.score})</a></li>
                        ))
                    }
                </ol>
              </div>
              <h5>Authored Games</h5>
              {
                data.authoredGames?.map((item) => (
                    <a href={`/detail/${item.slug}`} class="card card-default mb-3">
                        <div class="card-body">
                        <div class="row">
                            <div class="col-4">
                            <img src={image} alt="Demo Game 1 Logo" style={{width: "100%"}}/>
                            </div>
                            <div class="col">
                            <h5 class="mb-1">{item.title} <small class="text-muted">By {username}</small></h5>
                            <div>{item.descrition}</div>
                            <hr class="mt-1 mb-1"/>
                            </div>
                        </div>
                        </div>
                    </a>
                ))
              }

                
                <a href="/index" class="btn btn-danger w-100">Back</a>

               </div>
             </div>  
            
         </div>
      </div>
    </main>
        </div>
    )
}

export default User;