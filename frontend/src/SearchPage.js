import React from 'react';
import './SearchPage.css';

const SearchPage = ({ keyword, leftProducts = [], rightProducts = [] }) => {
  const isEmpty = leftProducts.length === 0 && rightProducts.length === 0;

  if (isEmpty) {
    return <p className="no-results">Ничего не найдено</p>;
  }

  return (
    <div className="search-page">
      <h2 className="keyword-title">Результаты по запросу: <span>"{keyword}"</span></h2>
      <div className="products-grid">
        <div className="product-column">
          {leftProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <div className="product-column">
          {rightProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => (
  <div className="product-card">
    <a href={product.link} target="_blank" rel="noopener noreferrer">
      <img src={product.link_to_photo} alt="product" />
    </a>
    <div className="product-info">
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="product-name">
        {product.name}
      </a>
      <div className="product-price">{product.price}₽ (СПП = 30%)</div>
      <div className="product-meta">
        ⭐ {product.nmReviewRating} ({product.nmFeedbacks} отзывов)<br />
        Органическая позиция: {product.organic_position}<br />
        Промо позиция: {product.promo_position}<br />
        Страница в поиске: {product.page}<br />
        Остатки: {product.remains}
      </div>
    </div>
  </div>
);

export default SearchPage;


// import React from 'react';
// import './SearchPage.css';

// function SearchPage({ keyword, leftProducts = [], rightProducts = [] }) {
//   const isEmpty = leftProducts.length === 0 && rightProducts.length === 0;

//   if (isEmpty) {
//     return <p style={{ padding: '10px' }}>Ничего не найдено</p>;
//   }

//   return (
//     <div className="search-container">
//       <h2 className="search-title">
//         Результаты по запросу: <strong style={{ color: 'blue' }}>"{keyword}"</strong>
//       </h2>
//       <div className="columns-container">
//         <div className="column">
//           {leftProducts.map((product, index) => (
//             <ProductCard key={index} product={product} />
//           ))}
//         </div>
//         <div className="column">
//           {rightProducts.map((product, index) => (
//             <ProductCard key={index} product={product} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ProductCard({ product }) {
//   return (
//     <div className="product-card">
//       <a href={product.link} target="_blank" rel="noreferrer">
//         <img className="product-image" src={product.link_to_photo} alt="Товар" />
//       </a>
//       <div className="product-details">
//         <a className="product-name" href={product.link} target="_blank" rel="noreferrer">
//           {product.name}
//         </a>
//         <div className="product-price">
//           <span className="current-price">{product.price} ₽</span>
//         </div>
//         <div className="product-meta">
//           <div>⭐ {product.nmReviewRating} ({product.nmFeedbacks} отзывов)</div>
//           <div>Орг. позиция: {product.organic_position}</div>
//           <div>Промо позиция: {product.promo_position}</div>
//           <div>Страница: {product.page}</div>
//           <div>Остатки: {product.remains}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SearchPage;