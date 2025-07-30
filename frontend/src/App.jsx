import React, { useState } from "react";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="App">
      <h1>Каталог</h1>
      <ProductList onProductClick={setSelectedProduct} />
      <ProductDetail product={selectedProduct} />
    </div>
  );
}

export default App;