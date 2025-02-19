import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admins = () => {
    const token = localStorage.getItem("token")
    const [data,setData] = useState([])
    const navigate = useNavigate()

    const getData = async(e) => {

        try{
            const response = await axios.get("http://localhost:8000/api/v1/admins", {
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
    
            console.log(response.data.content)
            setData(response.data.content)
        }catch(e){
            console.log(e)
        }
    } 

    useEffect(() => {
        if(!token){
            navigate("/index")
        }
        getData()
    },  [])

    return(
        <div>
            <Navbar/>
            <main>
                <div class="list-form py-5">
                <div class="container">
                    <h6 class="mb-3">List Admin Users</h6>

                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Created at</th>
                                <th>Last login</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((item) => (
                                    <tr>
                                        <td>{item.username}</td>
                                        <td>{item.created_at}</td>
                                        <td>{item.last_login_at ?? "2024-04-05 20:55:40"}</td>
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

export default Admins;