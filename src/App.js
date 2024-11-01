import React, { useState, useEffect } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { MdAddShoppingCart, MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response?.json();
        setProducts(data?.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (productId) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart?.findIndex((item) => item?.id === productId);
      if (existingProductIndex >= 0) {
        return prevCart?.map((item, index) =>
          index === existingProductIndex ? { ...item, count: item?.count + 1 } : item
        );
      } else {
        return [...prevCart, { id: productId, count: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existingProduct = prevCart?.find((item) => item?.id === productId);
      if (existingProduct) {
        if (existingProduct?.count > 1) {
          return prevCart?.map((item) =>
            item?.id === productId ? { ...item, count: item?.count - 1 } : item
          );
        } else {
          return prevCart?.filter((item) => item?.id !== productId);
        }
      }
      return prevCart;
    });
  };

  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * (discount / 100)));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
        {isLoading
          ? Array.from({ length: 20 })?.map((_, index) => (
              <div
                key={index}
                className="animate-pulse border p-4 rounded-lg shadow-lg bg-white"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))
          : products?.map((product) => {
              const cartItem = cart?.find((item) => item?.id === product?.id);
              const itemCount = cartItem ? cartItem?.count : 0;

              return (
                <div
                  key={product?.id}
                  className="hover:bg-white hover:rounded-lg p-2 hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
                >
                  <div className="relative">
                    <div className="absolute top-2 left-2 bg-orange-500 text-white font-semibold text-xs px-2 py-1 rounded-tr-lg rounded-bl-lg">
                      -৳ {Math.round(product?.price * (product?.discountPercentage / 100))}
                      <div className="absolute top-0 left-0 h-0 w-0 border-t-[10px] border-t-transparent border-l-[10px] border-l-orange-500"></div>
                    </div>
                    <img
                      src={product?.images[0]}
                      alt="Product"
                      loading="lazy"
                      className="w-full h-56 object-contain rounded-lg mb-4"
                    />
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40 rounded-lg">
                      <div className="absolute top-3 right-3">
                        <button className="text-white hover:text-white">
                          <FaRegHeart className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 flex flex-wrap items-center justify-center space-y-2">
                        <div className="flex gap-2 w-60 hover:backdrop-blur-sm bg-transparent/10 px-4 py-1 text-white border-2 border-white/35 hover:border-[#03A629] rounded-lg hover:bg-[#03A629] hover:text-white transition">
                          {itemCount > 0 && (
                            <RiDeleteBin6Line
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => removeFromCart(product?.id)}
                            />
                          )}
                          <button
                            className="w-full flex gap-2 items-center justify-center"
                            onClick={() => addToCart(product?.id)}
                          >
                            {itemCount > 0 ? <span>{itemCount}</span> : <MdAddShoppingCart className="w-5 h-5" />}
                            {itemCount > 0 ? `Added in Cart` : 'Add to Cart'}
                          </button>
                          {itemCount > 0 && (
                            <FiPlus
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => addToCart(product?.id)}
                            />
                          )}
                        </div>
                        <div className="flex gap-2 w-60 hover:backdrop-blur-sm bg-transparent/10 px-4 py-1 text-white border-2 border-white/35 hover:border-[#03A629] rounded-lg hover:bg-[#03A629] hover:text-white transition">
                          <button
                            className="w-full flex gap-2 items-center justify-center"
                            onClick={() => addToCart(product?.id)}
                          >
                            <MdOutlineRemoveRedEye className="w-5 h-5" />
                            Quick View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{product?.category}</p>
                    <p className="text-xl font-semibold text-[#1A2B3D]">{product?.title}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-blue-500 font-bold text-xl">
                        ৳ {calculateDiscountedPrice(product?.price, product?.discountPercentage)}
                      </span>
                      {product?.discountPercentage > 0 && (
                        <span className="text-gray-400 line-through text-md">৳ {product?.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default App;
