"use client";
import React, { useState, useEffect } from 'react';

const DiceBettingGame = () => {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [selectedBet, setSelectedBet] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [balance, setBalance] = useState(100000);
  const [betAmount, setBetAmount] = useState(5000);

  const betOptions = [
    { id: 'below', label: 'Below 7', condition: (sum) => sum < 7, payout: 2 },
    { id: 'equal', label: 'Equal to 7', condition: (sum) => sum === 7, payout: 5 },
    { id: 'above', label: 'Above 7', condition: (sum) => sum > 7, payout: 2 }
  ];

  const rollDice = () => {
    if (!selectedBet || isRolling) return;
    
    setIsRolling(true);
    setShowResult(false);
    setGameResult(null);
    
    // Deduct bet amount
    setBalance(prev => prev - betAmount);
    
    // Animate dice rolling for 2 seconds
    const rollAnimation = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollAnimation);
      
      // Final dice values
      const finalDice1 = Math.floor(Math.random() * 6) + 1;
      const finalDice2 = Math.floor(Math.random() * 6) + 1;
      const sum = finalDice1 + finalDice2;
      
      setDice1(finalDice1);
      setDice2(finalDice2);
      
      // Check if bet won
      const selectedOption = betOptions.find(opt => opt.id === selectedBet);
      const won = selectedOption.condition(sum);
      
      if (won) {
        setBalance(prev => prev + (betAmount * selectedOption.payout));
      }
      
      setGameResult({
        sum,
        won,
        payout: won ? betAmount * selectedOption.payout : 0,
        betType: selectedOption.label
      });
      
      setIsRolling(false);
      setTimeout(() => setShowResult(true), 500);
    }, 2000);
  };

  const resetGame = () => {
    setSelectedBet(null);
    setGameResult(null);
    setShowResult(false);
  };

  const DiceFace = ({ value, isRolling }) => {
    const dots = [];
    const dotPositions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [75, 25], [25, 75], [75, 75]],
      5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
      6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
    };

    dotPositions[value].forEach((pos, index) => {
      dots.push(
        <div
          key={index}
          className="absolute w-3 h-3 bg-gray-800 rounded-full"
          style={{
            left: `${pos[0]}%`,
            top: `${pos[1]}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      );
    });

    return (
      <div className={`
        relative w-20 h-20 bg-white rounded-xl shadow-lg border-2 border-gray-300
        transition-all duration-200 transform
        ${isRolling ? 'animate-spin scale-110' : 'hover:scale-105'}
      `}>
        {dots}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎲 DADU DATU</h1>
          <div className="text-xl text-yellow-300 font-semibold">
            Balance: Rp {balance.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Dice Container */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          <DiceFace value={dice1} isRolling={isRolling} />
          <div className="text-3xl text-white font-bold">+</div>
          <DiceFace value={dice2} isRolling={isRolling} />
        </div>

        {/* Sum Display */}
        <div className="text-center mb-6">
          <div className="text-2xl text-white font-bold">
            Sum: {dice1 + dice2}
          </div>
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-2">
            Bet Amount: Rp {betAmount.toLocaleString('id-ID')}
          </label>
          <input
            type="range"
            min="1000"
            max="20000"
            step="1000"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            disabled={isRolling}
          />
        </div>

        {/* Betting Options */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {betOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedBet(option.id)}
              disabled={isRolling}
              className={`
                p-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${selectedBet === option.id
                  ? 'bg-yellow-500 text-black scale-105 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                }
                ${isRolling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div>{option.label}</div>
              <div className="text-xs opacity-80">{option.payout}x payout</div>
            </button>
          ))}
        </div>

        {/* Roll Button */}
        <button
          onClick={rollDice}
          disabled={!selectedBet || isRolling || balance < betAmount}
          className={`
            w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
            ${!selectedBet || isRolling || balance < betAmount
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-lg'
            }
          `}
        >
          {isRolling ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Rolling...
            </div>
          ) : balance < betAmount ? (
            'Insufficient Balance'
          ) : !selectedBet ? (
            'Select a Bet First'
          ) : (
            `Roll Dice - Bet Rp ${betAmount.toLocaleString('id-ID')}`
          )}
        </button>

        {/* Result Display */}
        {showResult && gameResult && (
          <div className={`
            mt-6 p-4 rounded-xl text-center transition-all duration-500 transform
            ${gameResult.won 
              ? 'bg-green-500/20 border-2 border-green-400 animate-pulse' 
              : 'bg-red-500/20 border-2 border-red-400'
            }
          `}>
            <div className={`text-xl font-bold mb-2 ${gameResult.won ? 'text-green-300' : 'text-red-300'}`}>
              {gameResult.won ? '🎉 anjing menang dah' : '😞 TOLOL GOBLOK!'}
            </div>
            <div className="text-white text-sm">
              Sum was {gameResult.sum} • Bet: {gameResult.betType}
            </div>
            {gameResult.won && (
              <div className="text-yellow-300 font-semibold mt-1">
                Won: Rp {gameResult.payout.toLocaleString('id-ID')}
              </div>
            )}
            <button
              onClick={resetGame}
              className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Game Rules */}
        <div className="mt-6 text-xs text-white/70 text-center">
          <div className="mb-1">Below 7 & Above 7: 2x payout</div>
          <div>Equal to 7: 5x payout</div>
        </div>
      </div>
    </div>
  );
};

export default DiceBettingGame;