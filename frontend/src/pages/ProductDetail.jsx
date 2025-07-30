import React from "react";

const ProductDetail = ({ product }) => {
  if (!product) return <div>Выберите товар</div>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>Цена: {product.price}₽</p>
      <p>Описание: {product.description}</p>
    </div>
  );
};

export default ProductDetail;