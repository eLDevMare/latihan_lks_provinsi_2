import axios from "axios"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const AddUser = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const usernameRef = useRef("")
    const passwordRef = useRef("")

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        const data = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }

        try{
            const response = await axios.post("http://localhost:8000/api/v1/auth/signup", data, {
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })

            navigate("/user")
            console.log(response)
        } catch(e){
            console.log(e)
        }
    }
    
    useEffect(() => {
        if(!token){
            navigate("/signup")
        }
    }, [])
    
    return (
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
                              <input id="username" ref={usernameRef} type="text" placeholder="Username" class="form-control" name="username"/>
                           </div>  
                        </div>
                     </div>
                     <div class="form-item card card-default my-4">
                        <div class="card-body">
                           <div class="form-group">
                              <label for="password" class="mb-1 text-muted">Password <span class="text-danger">*</span></label>
                              <input id="password" ref={passwordRef} type="password" placeholder="Password" class="form-control" name="userpasswordname"/>
                           </div>  
                        </div>
                     </div>
   
                     <div class="mt-4 row">
                        <div class="col">
                           <button onClick={handleSubmit} class="btn btn-primary w-100">Submit</button>
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

export default AddUser