import { useEffect, useState } from "react";
import image from "../assets/thumbnail.png"
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Games = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [sortBy, setSortBy] = useState("title")
    const [sortDir, setSortDir] = useState("ASC")


    const getGames = async() => {
        const response = await axios.get(`http://localhost:8000/api/v1/games?sortby=${sortBy}&sortdir=${sortDir}`, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })

        console.log(response.data)
        setData(response.data)
    }

    useEffect(() => {
        if(!token){
            navigate("/signup")
        }

        console.log(data)
        getGames()
        console.log(sortDir)
    }, [sortBy, sortDir ])
    return (
        <div>
            <Navbar/>   
            <main>
                <div className="hero py-5 bg-light">
                    <div className="container text-center">
                        <h1>Discover Games</h1>
                    </div>
                </div>

                <div className="list-form py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2 className="mb-3">{data.totalElement} Game Available</h2>
                            </div>

                            <div className="col-lg-8 text-end">
                                <div className="mb-3">
                                    <div className="btn-group" role="group">
                                        <button type="button" className={`btn ${sortBy == "uploadTimeStamp" ? "btn-secondary" : "btn-outline-primary"}`}onClick={() => setSortBy("uploadTimeStamp")}>Recently Updated</button>
                                        <button type="button" className={`btn ${sortBy == "title" ? "btn-secondary" : "btn-outline-primary"}`}onClick={() => setSortBy("title")}>Alphabetically</button>
                                    </div>

                                    <div className="btn-group ms-2" role="group">
                                        <button type="button" onClick={() => setSortDir("ASC")} className={`btn ${sortDir == "ASC" ? "btn-secondary" : "btn-outline-primary"}`}>ASC</button>
                                        <button type="button" onClick={() => setSortDir("DESC")} className={`btn ${sortDir == "DESC" ? "btn-secondary" : "btn-outline-primary"}`} >DESC</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {
                                data.content?.map((item) => (                                    
                                    <div className="col-md-6">
                                        <a href="detail-games.html" className="card card-default mb-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <img src={image} alt="Demo Game 1 Logo" style={{ width: "100%" }} />
                                                    </div>
                                                    <div className="col">
                                                        <h5 className="mb-1"> {item.title} <small className="text-muted"> By {item.author}</small></h5>
                                                        <div> {item.description} </div>
                                                        <hr className="mt-1 mb-1" />
                                                        <div className="text-muted">#scores submitted : {item.scoreCount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Games;
