import axios from "axios";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const getMe = async() => {
        const response = await axios.get("http://localhost:8000/api/v1/auth/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        localStorage.setItem("username", response.data)
        console.log(response.data)
    }

    useEffect(() => {
        if(!token){
            navigate("/signup")
        }
        getMe()
    }, [])
    return (
        <div>
            <Navbar/>
            <main>
                <div class="hero py-5 bg-light">
                <div class="container text-center">
                    <h1 class="mb-0 mt-0">Dashboard</h1>
                </div>
                </div>

                <div class="list-form py-5">
                <div class="container">
                    <h5 class="alert alert-info">
                    Welcome, Administrator. Don't forget to sign out when you are finished using this page
                    </h5>
                </div>
                </div>

            </main>
        </div>
    )
}

export default Index;