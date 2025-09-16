import { BackendStatus } from './components/BackendStatus';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-4">
          Tailwind CSS
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Se você está vendo este card estilizado, o Tailwind está funcionando corretamente!
        </p>
        <BackendStatus />
      </div>
    </div>
  );
}

export default App;