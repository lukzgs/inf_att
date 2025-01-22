import { useState } from 'react';
import Logo from '../assets/ufrgs_logo.svg'; 

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticação aqui
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="min-w-[320px] min-h-screen flex justify-center items-center">
      <div className="bg-white w-96 min-h-[32rem] rounded-lg shadow-lg flex flex-col bg-gray-200">
        {/* Topo */}
        <div className="flex justify-center items-center p-4 border-b">
          <img src={Logo} alt="Logo" className="h-16 rounded-full" />
        </div>

        {/* Centro 1*/}
        <div className="flex justify-center items-center p-4 border-b text-black">
          Inf Att
        </div>
        
        {/* Centro 2*/}
        <div className="flex-grow flex flex-col justify-center items-center p-12">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="my-2">
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                Login
              </label>
              <input
                type="login"
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div className="my-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200 mt-8"
            >
              Login
            </button>
          </form>
        </div>
        
        {/* Rodapé */}
        <div className="flex justify-center items-center p-4 border-t">
          <p className="text-sm text-gray-600">© 2025 Instituto de Informática</p>
        </div>
      </div>
    </div>
  );
}

export default Login;