import { useState } from "react";
import { loginUser } from "../services/auth";
import axios from "axios";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      console.log("Token sauvegardé dans localStorage");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Erreur de connexion :", err.response?.data);
      } else if (err instanceof Error) {
        console.error("Erreur inconnue :", err.message);
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>
          Connexion
        </h2>

        <div>
          <label className='block mb-1 text-gray-700'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-400'
            required
          />
        </div>

        <div>
          <label className='block mb-1 text-gray-700'>Mot de passe</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-400'
            required
          />
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
