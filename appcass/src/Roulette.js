import React, { useState, useEffect } from 'react';
import './Roulette.css';

const numbers = [
  '0', '32', '15', '19', '4', '21', '2', '25', '17', '34', '6', '27', '13', '36', '11', '30', '8', '23', '10', '5', '24',
  '16', '33', '1', '20', '14', '31', '9', '22', '18', '29', '7', '28', '12', '35', '3', '26'
];

const initialBalance = 1000; // Saldo inicial

const Roulette = () => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [ballPosition, setBallPosition] = useState(0);
  const [bet, setBet] = useState(null);
  const [betAmount, setBetAmount] = useState(10); // Valor da aposta inicial
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('Jogou agora! os cinzas pagam 36x e os verdes 50x');
  const [balance, setBalance] = useState(initialBalance);
  const [greenNumbers, setGreenNumbers] = useState([]); // Estado para armazenar os números verdes
  const [turboMultiplier, setTurboMultiplier] = useState(1); // Multiplicador inicial do turbo spin

  // Função para escolher aleatoriamente os números verdes
  const chooseGreenNumbers = () => {
    const numGreen = Math.floor(Math.random() * 18) + 1; // Escolhe até 18 números verdes
    const greenSet = new Set();
    while (greenSet.size < numGreen) {
      const greenNumber = numbers[Math.floor(Math.random() * numbers.length)];
      greenSet.add(greenNumber);
    }
    setGreenNumbers(Array.from(greenSet));
  };

  useEffect(() => {
    chooseGreenNumbers();
  }, [spinning]); // Atualiza os números verdes toda vez que a roleta gira

  const getRandomNumber = () => {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    return numbers[randomIndex];
  };

  const spin = () => {
    if (bet === null) {
      alert('Por favor, escolha um número para apostar.');
      return;
    }

    if (betAmount > balance) {
      alert('Saldo insuficiente para esta aposta.');
      return;
    }

    setSpinning(true);
    setResult(null);
    const winningNumber = getRandomNumber();
    const randomIndex = numbers.indexOf(winningNumber);
    const totalSpins = numbers.length + randomIndex; // Total de posições que a bola irá percorrer
    let position = ballPosition;

    const spinRoulette = (remainingSpins) => {
      if (remainingSpins <= 0) {
        setSpinning(false);
        setCurrentNumber(winningNumber);

        if (winningNumber === bet) {
          if (greenNumbers.includes(winningNumber)) {
            setBalance(prevBalance => prevBalance + betAmount * 50); // Pagamento de 50 para 1 para números verdes
            setResult('Você ganhou no verde!'); // Mensagem de ganho específica
          } else {
            setBalance(prevBalance => prevBalance + betAmount * 36); // Pagamento de 36 para 1 para números normais
            setResult('Você ganhou!'); // Mensagem de ganho padrão
          }
        } else {
          setBalance(prevBalance => prevBalance - betAmount);
          setResult('Você perdeu.'); // Mensagem de perda
        }
        return;
      }

      position = (position + 1) % numbers.length;
      setBallPosition(position);

      setTimeout(() => spinRoulette(remainingSpins - 1), 10);
    };

    spinRoulette(totalSpins);
  };

  const handleTurboSpin = (multiplier) => {
    if (spinning) return; // Evitar iniciar novo turbo spin se já estiver girando

    if (betAmount * multiplier > balance) {
      alert('Saldo insuficiente para esta aposta múltipla.');
      return;
    }

    setTurboMultiplier(multiplier);
    spinMultiple(multiplier);
  };

  const spinMultiple = (multiplier) => {
    // Cada spin no modo Turbo Spin deve consumir o valor da aposta do saldo
    for (let i = 0; i < multiplier; i++) {
      setTimeout(() => {
        spin();
        setBalance(prevBalance => prevBalance - betAmount); // Deduzir aposta do saldo a cada spin
      }, i * 500); // Espera 500ms entre cada spin (ajustável conforme necessário)
    }
  };

  return (
    <div className="roulette-container">
      <p>Saldo: {balance} unidades</p>
      <div>
        <label>
          Valor da Aposta:
          <input 
            type="number" 
            value={betAmount} 
            onChange={(e) => setBetAmount(Number(e.target.value))}
            disabled={spinning}
          />
        </label>
      </div>
      {bet && <p>Você apostou no número: {bet} com {betAmount} unidades</p>}
      {result && <p>{result}</p>}
      <div className="roulette-wheel">
        {numbers.map((number, index) => (
          <div
            key={index}
            className={`roulette-number ${ballPosition === index ? 'ball' : ''} ${currentNumber === number ? 'selected' : ''} ${greenNumbers.includes(number) ? 'green' : ''}`}
            onClick={() => !spinning && setBet(number)}
          >
            {number}
          </div>
        ))}
      </div>
      <button onClick={spin} disabled={spinning}>Spin</button>
      <div className="turbo-spin">
        <p>Turbo Spin:</p>
        <button onClick={() => handleTurboSpin(5)}>5x</button>
        <button onClick={() => handleTurboSpin(10)}>10x</button>
        <button onClick={() => handleTurboSpin(50)}>50x</button>
      </div>
    </div>
  );
};

export default Roulette;