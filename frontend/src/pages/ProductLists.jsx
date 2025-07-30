import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const ProductList = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/handle?query=мужская%20сумка")
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
  }, []);

  return (
    <div className="product-grid">
      {products.map(p => (
        <ProductCard key={p.nm_id} product={p} onClick={onProductClick} />
      ))}
    </div>
  );
};

export default ProductList;