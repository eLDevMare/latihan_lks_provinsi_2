import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const Update = () => {
    const {slug} = useParams()
    const token = localStorage.getItem("token")
    const [dataDetail, setDatDetail] = useState([])
    const titleRef = useRef()
    const descriptionRef = useRef()
    const fileRef = useRef(false)
    const navigate = useNavigate()


    const getDataDetail = async() => {
        const response = await axios.get(`http://localhost:8000/api/v1/games/${slug}`, {
            headers:{
                "Authorization" : `Bearer ${token}`
            }
        })

        console.log(response.data.content)
        setDatDetail(response.data.content)
    }


    const handlePostDetail = async(e) => {
        e.preventDefault()

        const file = fileRef.current.files[0]
        const formData = new FormData()
        formData.append("zipfile", file)
        
        const data = {
            title: titleRef.current.value,
            description: descriptionRef.current.value
        }


        try {
            if(file){
                await axios.post(`http://localhost:8000/api/v1/games/${slug}/upload`, formData, {
                    headers: {
                        "Authorization" : `Bearer ${token}`,
                        "Content-Type" : "multipart/form-data"
                    }
                })
            }
        } catch (e) {
            console.log(e)
        }

        try{
            const response = await axios.put(`http://localhost:8000/api/v1/games/${slug}`, data,{
                headers: {
                    "Authorization" : `Bearer ${token}`,
                }
            })
            navigate("/manage")
            console.log(response)
        } catch(e) {
            console.log(e)
        }
    }


    useEffect(() => {
        getDataDetail()
        if(!token){
            navigate("/signup")
        }
    }, [])

    return(
        <div>
            <main>
                <div class="hero py-5 bg-light">
                    <div class="container text-center"> 
                        <h2 class="mb-3">
                        Manage Games - Gaming Portal
                        </h2>
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
                                        <label for="title" class="mb-1 text-muted">Title <span class="text-danger">*</span></label>
                                        <input id="title" ref={titleRef} defaultValue={dataDetail.title} type="text" placeholder="Title" class="form-control" name="title"/>
                                    </div>  
                                    </div>
                                </div>
                                <div class="form-item card card-default my-4">
                                    <div class="card-body">
                                    <div class="form-group">
                                        <label for="description" class="mb-1 text-muted">Description <span class="text-danger">*</span></label>
                                        <textarea name="description" ref={descriptionRef} class="form-control" placeholder="Description" id="description" cols="30" rows="5" defaultValue={dataDetail.description}></textarea>
                                    </div>  
                                    </div>
                                </div>
                                <div class="form-item card card-default my-4">
                                    <div class="card-body">
                                    <div class="form-group">
                                        <label for="game" class="mb-1 text-muted">File Game <span class="text-danger">(select the file if you want to update it)</span></label>
                                        <input type="file" name="game" ref={fileRef} class="form-control" id="game"/>
                                    </div>  
                                    </div>
                                </div>
            
                                <div class="mt-4 row">
                                    <div class="col">
                                    <button onClick={handlePostDetail} class="btn btn-primary w-100">Submit</button>
                                    </div>
                                    <div class="col">
                                    <a href="/manage" class="btn btn-danger w-100">Back</a>
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


export default Update