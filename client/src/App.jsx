import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-purple-500 selection:text-white">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          EduMEasy Client
        </h1>
        <p className="text-lg text-slate-400">
          React 19, Vite, Tailwind CSS v4, and React Router v6 setup is complete.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition duration-300 rounded-lg font-semibold shadow-lg shadow-purple-500/20 active:scale-95 cursor-pointer"
          >
            Count is {count}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
