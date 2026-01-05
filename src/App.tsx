import { useEffect, useState } from 'react';
import { MdBrush, MdChat, MdFrontHand } from 'react-icons/md';

import { getRandomGesturePhrase, getRandomNounA, getRandomNounB } from './data/data';

function App() {
  const [explain, setExplain] = useState('');
  const [draw, setDraw] = useState('');
  const [gesture, setGesture] = useState('');

  const getExplainWord = async () => {
    return getRandomNounB();
  };

  const getDrawWord = async () => {
    return getRandomNounA();
  };

  const getGestureWord = async () => {
    return getRandomGesturePhrase();
  };

  useEffect(() => {
    Promise.all([getExplainWord(), getDrawWord(), getGestureWord()])
      .then(([explain, draw, gesture]) => {
        setExplain(explain);
        setDraw(draw);
        setGesture(gesture);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке слов:', err);
      });
  }, []);

  function handleClick(type: 'explain' | 'draw' | 'gesture') {
    const map = {
      explain: setExplain,
      draw: setDraw,
      gesture: setGesture,
    };

    const loaders = {
      explain: getExplainWord,
      draw: getDrawWord,
      gesture: getGestureWord,
    };

    map[type]('...');

    loaders[type]()
      .then(map[type])
      .catch((err) => {
        console.error('Ошибка при смене слова:', err);
        map[type]('Ошибка');
      });
  }

  return (
    <div className='app-container'>
      <h1 className='title'>Pozitivium 2.0</h1>

      <div className='cards-container'>
        <div className='card red'>
          <MdChat className='icon' color='red' size={48} />
          <p className='word'>{explain || 'Загрузка...'}</p>
          <button className='button' onClick={() => handleClick('explain')}>
            Сменить слово
          </button>
        </div>

        <div className='card blue'>
          <MdBrush className='icon' color='blue' size={48} />
          <p className='word'>{draw || 'Загрузка...'}</p>
          <button className='button' onClick={() => handleClick('draw')}>
            Сменить слово
          </button>
        </div>

        <div className='card green'>
          <MdFrontHand className='icon' color='green' size={48} />
          <p className='word'>{gesture || 'Загрузка...'}</p>
          <button className='button' onClick={() => handleClick('gesture')}>
            Сменить слово
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
