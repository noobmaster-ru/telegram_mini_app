import React from "react";

const ProductCard = ({ product, onClick }) => (
  <div className="product-card" onClick={() => onClick(product)}>
    <h3>{product.name}</h3>
    <p>{product.price}₽</p>
    <img src={product.image} alt={product.name} />
  </div>
);

export default ProductCard;