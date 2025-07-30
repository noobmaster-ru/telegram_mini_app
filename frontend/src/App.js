import React, { useState, useEffect } from 'react';
import './App.css';
import SearchPage from './SearchPage';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchData, setSearchData] = useState(null); // ← данные от /render
  const [history, setHistory] = useState([]); // Добавляем состояние для истории:

  const tg = window.Telegram?.WebApp;
  const themeParams = tg?.themeParams;
  console.log('Telegram initDataUnsafe:', tg?.initDataUnsafe);

  const parseTelegramUserId = () => {
    const searchParams = new URLSearchParams(tg?.initData || '');
    const userParam = searchParams.get('user');
    if (userParam) {
      try {
        const user = JSON.parse(userParam);
        return user.id;
      } catch (e) {
        console.error("Ошибка парсинга user:", e);
      }
    }
    return 0;
  };

  const userId = parseTelegramUserId();
  useEffect(() => {
    if (tg) tg.expand();
  }, [tg]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError("Введите ключевую фразу");
      return;
    }

    setLoading(true);
    setError('');
    setSearchData(null); // очищаем предыдущие данные

    try {
      const response = await fetch('/handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_id: tg?.initDataUnsafe?.query_id ?? '',
          user_id: userId, //tg?.initDataUnsafe?.user?.id ?? 0,
          search_text: query
        })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        const renderResponse = await fetch('/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: data.items,
            keyword: data.keyword
          })
        });

        const renderData = await renderResponse.json();

        // ✅ сохраняем данные для SearchPage
        setSearchData({
          keyword: renderData.keyword,
          leftProducts: renderData.left_products,
          rightProducts: renderData.right_products
        });
        // Это добавит текущий query в начало истории и удалит дубли.
        setHistory((prev) => [query, ...prev.filter(q => q !== query)]);
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

  const renderSearchTab = () => (
    <>
      <input
        type="text"
        value={query}
        placeholder="Введите ключевую фразу..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={loading}
        className="search-input"
      />
      <button onClick={handleSubmit} disabled={loading} className="search-button">
        {loading ? "Поиск..." : "Найти"}
      </button>
      {error && <p className="error">{error}</p>}
      {searchData && (
        <SearchPage
          keyword={searchData.keyword}
          leftProducts={searchData.leftProducts}
          rightProducts={searchData.rightProducts}
        />
      )}
    </>
  );

const renderCatalogTab = () => (
    <div className="history-list">
      {history.length === 0 ? (
        <p>Введите ключевую фразу во вкладке Поиск</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              <button
                className="history-item"
                style={{
                  color: themeParams?.text_color || '#000'
                }}
                onClick={() => {
                  setQuery(item);
                  setActiveTab('search');
                  setTimeout(() => handleSubmit(), 0); // немного позже, чтобы успел переключиться
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="App">
      <div className="content">
        {activeTab === 'search' ? renderSearchTab() : renderCatalogTab()}
      </div>

      <div className="bottom-panel">
        <button
          className={activeTab === 'catalog' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('catalog')}
        >
          История запросов
        </button>
        <button
          className={activeTab === 'search' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('search')}
        >
          Поиск
        </button>
      </div>
    </div>
  );
}

export default App;