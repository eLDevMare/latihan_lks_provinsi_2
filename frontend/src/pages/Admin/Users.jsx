import axios from "axios";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const token = localStorage.getItem("token")
    const [data,setData] = useState([])
    const navigate = useNavigate()

    const getData = async() => {
        const response = await axios.get("http://localhost:8000/api/v1/users", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        console.log(response.data.content)
        setData(response.data.content)
    }

    const handleDelete = async(value) => {
        const response = await axios.delete(`http://localhost:8000/api/v1/users/${value}`, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })

        window.location.reload()
    }

    useEffect(() => {
        if(!token){
            navigate("/index")
        }


        getData()
    }, [])
    return(
        <div>
            <Navbar/>
                <main>
                    <div class="hero py-5 bg-light">
                    <div class="container">
                        <a href="/adduser" class="btn btn-primary">
                            Add User
                        </a>
                    </div>
                    </div>

                    <div class="list-form py-5">
                    <div class="container">
                        <h6 class="mb-3">List Users</h6>

                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Created at</th>
                                    <th>Last login</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item) => (
                                        <tr>
                                            <td><a href="../Gaming Portal/profile.html" target="_blank">{item.username}</a></td>
                                            <td>{item.created_at ?? "2024-04-05 20:55:40"}</td>
                                            <td>{item.last_login_at ?? "2024-04-05 20:55:40"}</td>
                                            <td>
                                                <a href={`/updateuser/${item.username}`} class="btn btn-sm btn-secondary">Update</a>
                                                <a onClick={() => handleDelete(item.id)} class="btn btn-sm btn-danger">Delete</a>
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

export default Users;