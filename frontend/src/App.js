import React, { useState, useEffect } from 'react';
import './App.css';
import SearchPage from './SearchPage';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchData, setSearchData] = useState(null); // ← данные от /render

  const tg = window.Telegram?.WebApp;

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
          user_id: tg?.initDataUnsafe?.user?.id ?? 0,
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
    <div className="catalog-placeholder">
      <p>Каталог пока в разработке 🛠</p>
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
          Каталог
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