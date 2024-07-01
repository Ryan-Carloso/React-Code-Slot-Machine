import React, { useState, useEffect } from 'react';

const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '⭐', '🔔'];

function App() {
  const [reels, setReels] = useState(['❓', '❓', '❓']);
  const [result, setResult] = useState('');
  const [spinning, setSpinning] = useState(false);

  const spinReels = () => {
    setSpinning(true);
    setTimeout(() => {
      const newReels = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
      setReels(newReels);
      if (newReels.every(symbol => symbol === newReels[0])) {
        setResult('Você ganhou!');
      } else {
        setResult('Tente novamente.');
      }
      setSpinning(false);
    }, 1000);
  };

  useEffect(() => {
    if (spinning) {
      const interval = setInterval(() => {
        const newReels = reels.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        setReels(newReels);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [spinning, reels]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-8">Caça-Níqueis</h1>
      <div className="flex space-x-4 mb-8">
        {reels.map((reel, index) => (
          <span
            key={index}
            className={`text-6xl p-4 border-2 border-gray-300 rounded-lg bg-white shadow-lg ${
              spinning && index !== 1 ? 'animate-spin' : ''
            }`}
          >
            {reel}
          </span>
        ))}
      </div>
      <button
        onClick={spinReels}
        className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition duration-200"
        disabled={spinning}
      >
        Girar
      </button>
      <p className="mt-6 text-2xl text-green-600">{result}</p>
    </div>
  );
}

export default App;
