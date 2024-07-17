import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context, server } from "../main.jsx";
import toast from "react-hot-toast";

const RegisterPage = () => {

  const history=useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const{isAuthenticated,setIsAuthenticated,loading,setLoading}=useContext(Context);

  const registerUser=async(e)=>{

  e.preventDefault();
  try{

    setLoading(true);
    const{data}=await axios.post(`${server}/users/new`,{
        name,email,password},
        {headers:{
            "Content-Type":"application/json"
        },
    withCredentials:true}

    )

    console.log(data);
    toast.success(data.message);
    setIsAuthenticated(true);
    setLoading(false);
      history("/");
      setTimeout(() => {
        window.location.reload();
      }, 1000); 

  }catch(error){

    setLoading(false);
    setIsAuthenticated(false);
    console.log(error);
    toast.error(error.response.data.message);
    
  }

  }
  return (
    <div className="mt-4 flex grow items-center justify-around">
      <div className="mb-40">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="John Doe"
            name="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="your@email"
            name="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading} className="prim">Register</button>
          <div className="text-center py-2 mt-3 text-gray-400">
            Already a member ?{" "}
            <Link to={"/login"} className="underline text-black">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
