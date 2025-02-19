import Navbar from "../components/Navbar"
import image from "../assets/thumbnail.png"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


const Manage = () => {
    const token = localStorage.getItem("token")
    const [data, setData] = useState([])
    const navigate = useNavigate()
    
    const getGames = async() => {
        const response = await axios.get("http://localhost:8000/api/v1/games", {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })

        console.log(response.data.content)
        setData(response.data.content)
    }

    const handleDeleteGame = async(value) => {
        try{

            const response = await axios.delete(`http://localhost:8000/api/v1/games/${value}`,{
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })
            window.location.reload()
            navigate("/manage")
            console.log(response.data)
        } catch(e){
            console.log(e)
        }

    }

    useEffect(() => {
        if(!token){
            navigate("/signup")
        }
        getGames()
    }, [])


    return(
        <div>
            <Navbar/>
            <main>
                <div className="hero py-5 bg-light">
                    <div className="container">
                        <a href="/add" className="btn btn-primary">
                            Add Game
                        </a>
                    </div>
                </div>

                <div className="list-form py-5">
                    <div className="container">
                        <h6 className="mb-3">List Games</h6>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th width="100">Thumbnail</th>
                                    <th width="200">Title</th>
                                    <th width="500">Description</th>
                                    <th width="180">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item) => (
                                        <tr>
                                            <td><img src={image} alt="Demo Game 1 Logo" style={{ width: "100%" }} /></td>
                                            <td> {item.title} </td>
                                            <td> {item.description} </td>
                                            <td>
                                                <a href={`/detail/${item.slug}`} className="btn btn-sm btn-primary">Detail</a>
                                                <a href={`/update/${item.slug}`} className="btn btn-sm btn-secondary">Update</a>
                                                <a href="#" onClick={() => handleDeleteGame(item.slug)} className="btn btn-sm btn-danger">Delete</a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Manage