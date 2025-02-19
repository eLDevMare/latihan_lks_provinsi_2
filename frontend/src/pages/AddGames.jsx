import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddGames = () => {
    const token = localStorage.getItem('token')
    const [slug, setSlug] = useState()
    const titleRef = useRef("");
    const descriptionRef = useRef("")
    const fileRef = useRef("")
    const navigate = useNavigate()

    const handleAddGame = async(e) => {
        e.preventDefault()
        const data = {
            title: titleRef.current.value,
            description: descriptionRef.current.value
        }

        try{
            const response = await axios.post(`http://localhost:8000/api/v1/games`, data,{
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            })

            console.log(response.data.slug)
            setSlug(response.data.slug)
        } catch(e){
            console.log(e)
        }
    }

    useEffect( () => {

        const postFile = async() => {
            const formData = new FormData()
            const file = fileRef.current.files[0]
            formData.append("zipfile", file)
            try{
                if(file){
                    const response =  await axios.post(`http://localhost:8000/api/v1/games/${slug}/upload`,formData, {
                        headers: {
                            "Authorization" : `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    })
        
                    console.log(response)
                }
            } catch(e){
                console.log(e)
            }
        } 

        if(!token){
            navigate("signup")
        }

        if(slug){
            postFile()
            navigate("/manage8")
        }

    }, [slug])

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
                              <input id="title" ref={titleRef} type="text" placeholder="Title" class="form-control" name="title"/>
                           </div>  
                        </div>
                     </div>
                     <div class="form-item card card-default my-4">
                        <div class="card-body">
                           <div class="form-group">
                              <label for="description" class="mb-1 text-muted">Description <span class="text-danger">*</span></label>
                              <textarea name="description" ref={descriptionRef} class="form-control" placeholder="Description" id="description" cols="30" rows="5"></textarea>
                           </div>  
                        </div>
                     </div>
                     <div class="form-item card card-default my-4">
                        <div class="card-body">
                           <div class="form-group">
                              <label for="game" class="mb-1 text-muted">File Game <span class="text-danger">*</span></label>
                              <input type="file" ref={fileRef} name="game" class="form-control" id="game"/>
                           </div>  
                        </div>
                     </div>
   
                     <div class="mt-4 row">
                        <div class="col">
                           <button onClick={handleAddGame} class="btn btn-primary w-100">Submit</button>
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


export default AddGames;