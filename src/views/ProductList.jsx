import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/3');
        setProducts([response.data.product]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <p>Name: {product.name}</p>
            <p>Price: {product.price}</p>
            <p>Brand: {product.brand}</p>
            <div>
              {product.images && product.images.length > 0 && (
                <div>
                  <p>Images:</p>
                  <ul>
                    {product.images.map((image) => (
                      <li key={image.id}>
                        <img 
                          src={`http://localhost:8000/storage/${image.image_path}`} 
                          alt={`Product ${product.id} Image`} 
                          style={{ width: '100px', height: 'auto', margin: '5px' }} 
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;


