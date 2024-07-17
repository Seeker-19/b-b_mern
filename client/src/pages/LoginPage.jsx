import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Context, server } from "../main.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  const { isAuthenticated, setIsAuthenticated, loading, setLoading } =
    useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${server}/users/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setIsAuthenticated(true);
      setLoading(false);

      history("/");
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      toast.error(error.response.data.message);
      setEmail("");
      setPassword("");
    }
  };
  return (
    <div className="mt-4 flex grow items-center justify-around">
      <div className="mb-40">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto " onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="your@email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="prim">Login</button>
          <div className="text-center py-2 mt-3 text-gray-400">
            Don't have an account yet?{" "}
            <Link to={"/register"} className="underline text-black">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
