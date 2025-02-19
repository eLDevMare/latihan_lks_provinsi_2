import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const [data,setData] = useState()
    const {slug} = useParams()
    const token = localStorage.getItem("token")
    const navigate = useNavigate()


    const getData = async() => {
        const response = await axios.get(`http://localhost:8000/api/v1/users/${slug}`, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        console.log(response.data.data[0])
        setData(response.data.data[0])
    }

    const handleUpdate = async(e) => {
        e.preventDefault();

        const payload = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }

        if(payload.password){
            try{
                const response = await axios.put(`http://localhost:8000/api/v1/userss/${data.id}`, payload, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                navigate("/user")
                console.log(response)
            } catch(e){
                console.log(e)
            }
        } else {
            console.log("gagal")
        }
    }


    useEffect(() => {
        if(!token) {
            navigate("/signup")
        }

        getData()
    },[])
    
    return(
        <div>
                <main>
                    <div class="hero py-5 bg-light">
                        <div class="container text-center"> 
                            <h2 class="mb-3">
                            Manage User - Administrator Portal
                            </h2> 
                            <div class="text-muted">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                            </div>
                        </div>
                    </div>

                    <div class="py-5">
                        <div class="container"> 

                            <div class="row justify-content-center ">
                            <div class="col-lg-5 col-md-6"> 
                                
                                <form>
                                    <div class="form-item card card-default my-4">
                                        <div class="card-body">
                                        <div class="form-group">
                                            <label for="username" class="mb-1 text-muted">Username <span class="text-danger">*</span></label>
                                            <input id="username" required ref={usernameRef} defaultValue={data?.username} type="text" placeholder="Username" class="form-control" name="username"/>
                                        </div>  
                                        </div>
                                    </div>
                                    <div class="form-item card card-default my-4">
                                        <div class="card-body">
                                        <div class="form-group">
                                            <label for="password" class="mb-1 text-muted">Password <span class="text-danger">*</span></label>
                                            <input id="password" required ref={passwordRef} type="password" placeholder="Password" class="form-control" name="userpasswordname"/>
                                        </div>  
                                        </div>
                                    </div>
                
                                    <div class="mt-4 row">
                                        <div class="col">
                                        <button onClick={handleUpdate}  class="btn btn-primary w-100">Submit</button>
                                        </div>
                                        <div class="col">
                                        <a href="/user" class="btn btn-danger w-100">Back</a>
                                        </div>
                                    </div>
                                </form>

                            </div>
                            </div>  
                            
                        </div>
                    </div>
                </main>
        </div>
    )
}

export default UpdateUser;