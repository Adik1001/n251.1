import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

const ReactiveTimerMotivator = () => {
  // State management
  const [name, setName] = useState(() => localStorage.getItem('timerName') || '');
  const [selectedTime, setSelectedTime] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionCount, setCompletionCount] = useState(() => 
    parseInt(localStorage.getItem('completionCount') || '0')
  );
  const [currentMotivation, setCurrentMotivation] = useState('');
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true'
  );
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Motivational phrases
  const motivationalPhrases = [
    'Ты справился, {name}! 💪',
    'Отлично, {name}! Продолжай в том же духе! 🔥',
    'Молодец, {name}! Ты настоящий чемпион! 🏆',
    'Браво, {name}! Твоя сила воли впечатляет! ⭐',
    'Великолепно, {name}! Ты достиг цели! 🎯',
    'Потрясающе, {name}! Ты не сдаешься! 💎',
    'Фантастика, {name}! Ты превосходишь себя! 🚀',
    'Невероятно, {name}! Твоя дисциплина восхищает! 👑'
  ];

  const encouragementPhrases = [
    'Давай, {name}! Ты можешь! 💪',
    'Держись, {name}! Почти готово! 🔥',
    'Не сдавайся, {name}! Осталось немного! ⚡',
    'Ты сильнее, {name}! Продолжай! 💎',
    'Вперед, {name}! Победа близко! 🎯'
  ];

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('timerName', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('completionCount', completionCount.toString());
  }, [completionCount]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Timer logic
  useEffect(() => {
    let interval;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            setCompletionCount(count => count + 1);
            
            // Random completion phrase
            const randomPhrase = motivationalPhrases[
              Math.floor(Math.random() * motivationalPhrases.length)
            ].replace('{name}', name || 'Герой');
            setCurrentMotivation(randomPhrase);
            
            // Play completion sound
            if (soundEnabled) {
              playCompletionSound();
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, name, soundEnabled, motivationalPhrases]);

  // Sound effect
  const playCompletionSound = useCallback(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  // Handlers
  const startTimer = () => {
    if (!name.trim()) {
      alert('Пожалуйста, введите ваше имя!');
      return;
    }
    setTimeLeft(selectedTime);
    setIsRunning(true);
    setIsCompleted(false);
    setCurrentMotivation('');
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(false);
    setCurrentMotivation('');
  };

  const tryAgain = () => {
    resetTimer();
    setTimeout(startTimer, 100);
  };

  // Progress calculation
  const progress = selectedTime > 0 ? ((selectedTime - timeLeft) / selectedTime) * 100 : 0;

  // Get current status message
  const getStatusMessage = () => {
    if (isCompleted) return currentMotivation;
    if (isRunning && name) {
      const encouragement = encouragementPhrases[
        Math.floor(Date.now() / 3000) % encouragementPhrases.length
      ].replace('{name}', name);
      return `${encouragement} Осталось ${timeLeft} сек`;
    }
    if (timeLeft > 0 && !isRunning) return `Пауза. Осталось ${timeLeft} сек`;
    return 'Готов к новому вызову!';
  };

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800';

  return (
    <div className={`min-h-screen p-4 transition-all duration-500 ${themeClasses}`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Таймер-Мотиватор
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-full transition-all ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                } shadow-lg`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-all ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                } shadow-lg`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {completionCount > 0 && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Побед: {completionCount}</span>
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-sm ${
          darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/70 border border-white/50'
        }`}>
          
          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Ваше имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя..."
              disabled={isRunning}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Время таймера</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
              disabled={isRunning}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value={10}>10 секунд</option>
              <option value={20}>20 секунд</option>
              <option value={30}>30 секунд</option>
              <option value={60}>1 минута</option>
              <option value={300}>5 минут</option>
            </select>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-4 ${
              isCompleted ? 'text-green-500' : 
              timeLeft <= 3 && timeLeft > 0 ? 'text-red-500 animate-pulse' : 
              'text-purple-500'
            }`}>
              {timeLeft}
            </div>
            
            {/* Progress Bar */}
            {(isRunning || timeLeft > 0) && (
              <div className={`w-full h-3 rounded-full mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Status Message */}
            <div className={`text-lg font-medium min-h-[1.5rem] ${
              isCompleted ? 'text-green-500' : 'text-gray-600'
            }`}>
              {getStatusMessage()}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            {!isRunning && timeLeft === 0 && (
              <button
                onClick={startTimer}
                disabled={!name.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                  name.trim()
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5" />
                Старт
              </button>
            )}

            {isRunning && (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Pause className="w-5 h-5" />
                Пауза
              </button>
            )}

            {!isRunning && timeLeft > 0 && (
              <button
                onClick={() => setIsRunning(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Продолжить
              </button>
            )}

            {(timeLeft > 0 || isCompleted) && (
              <button
                onClick={resetTimer}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  darkMode 
                    ? 'bg-gray-600 text-white hover:bg-gray-500' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <RotateCcw className="w-5 h-5" />
                Сброс
              </button>
            )}

            {isCompleted && (
              <button
                onClick={tryAgain}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Ещё раз!
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 opacity-70">
          <p className="text-sm">
            Сделано с ❤️ для мотивации и продуктивности
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReactiveTimerMotivator;