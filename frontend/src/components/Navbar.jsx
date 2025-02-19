import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const username = localStorage.getItem("username")

    const handleLogout = async(e) => {
        e.preventDefault()
        const response = axios.post("http://localhost:8000/api/v1/auth/signout", {}, {
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        navigate("/signup")
        console.log(response.data)
    }


    useEffect(() => {
        if(!token){
            navigate("/signup")
        }
    }, [])
    
    return(
        <div>
               <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="/index">Gaming Portal</a>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          
         <li><a href="/games" class="nav-link px-2 text-white">Discover Games</a></li>
         <li><a href="/manage" class="nav-link px-2 text-white">Manage Games</a></li>
         <li><a href="/profile" class="nav-link px-2 text-white">User Profile</a></li>
         <li class="nav-item">
           <a class="nav-link active bg-dark" href="#">welcome, {username}</a>
         </li> 
         <li class="nav-item">
          <a href="" onClick={handleLogout} class="btn bg-white text-primary ms-4">Sign Out</a>
         </li>
       </ul> 
      </div>
    </nav>
        </div>
    )
}

export default Navbar