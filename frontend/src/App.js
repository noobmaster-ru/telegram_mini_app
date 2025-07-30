// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tg = window.Telegram?.WebApp;
  if (tg) tg.expand();

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError("Введите ключевую фразу");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_id: tg?.initDataUnsafe?.query_id ?? '',
          user_id: tg?.initDataUnsafe?.user?.id ?? 0,
          search_text: query
        })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        const renderResponse = await fetch('/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: data.items, keyword: data.keyword })
        });

        const html = await renderResponse.text();
        document.open();
        document.write(html);
        document.close();
      } else {
        setError(data.result || "Ничего не найдено.");
      }
    } catch (err) {
      setError("Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="App">
      <h2>Введите ключевую фразу</h2>
      <input
        type="text"
        value={query}
        placeholder="Введите ключевую фразу..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={loading}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Поиск..." : "Отправить"}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

export default App;