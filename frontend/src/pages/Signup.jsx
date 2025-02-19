import { useEffect, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const usernameRef = useRef("")
    const passwordRef = useRef("")
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const handleSignup = async(e) => {
        e.preventDefault()

        const data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value 
        }
        
        console.log(data)
        try {
            const response = await axios.post("http://localhost:8000/api/v1/auth/signup", data)
            localStorage.setItem("token", response.data.token)
            console.log("success signup")
            console.log(response.data)
        } catch(e){
            console.log(e.response.data.message)
        }
    }

    const handleSignin = async(e) => {
        e.preventDefault()

        const data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value 
        }
        try {
            const response = await axios.post("http://localhost:8000/api/v1/auth/signin", data)
            localStorage.setItem("token", response.data.token)
            if(response.data.status == "success user"){
                localStorage.setItem("scoiety", "user")
            }

            if(response.data.status == "success admin"){
                localStorage.setItem("scoiety", "admin")
            }
            console.log("success signin")
            console.log(response.data)
            navigate("/index")
        } catch(e){
            console.log(e.response.data.message)
        }
    }


    useEffect(() => {
        if(token){
            navigate("/index")
        }
    }, [token])
    
    return(
        <div>
            <main>
            <div class="hero py-5 bg-light">
                <div class="container text-center"> 
                    <h2 class="mb-3">
                    Sign Up - Gaming Portal
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
                                    <input id="username" ref={usernameRef} type="text" placeholder="Username" class="form-control" name="username"/>
                                </div>  
                                </div>
                            </div>
                            <div class="form-item card card-default my-4">
                                <div class="card-body">
                                <div class="form-group">
                                    <label for="password" class="mb-1 text-muted">Password <span class="text-danger">*</span></label>
                                    <input id="password"  ref={passwordRef} type="password" placeholder="Password" class="form-control" name="userpasswordname"/>
                                </div>  
                                </div>
                            </div>
        
                            <div class="mt-4 row">
                                <div class="col">
                                <button onClick={handleSignup} class="btn btn-primary w-100">Sign Up</button>
                                </div>
                                <div class="col">
                                <button onClick={handleSignin} class="btn btn-danger w-100">Sign In</button>
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

export default Signup