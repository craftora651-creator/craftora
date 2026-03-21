import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyProducts, useDeleteProduct } from '../hooks/product.hooks';
import { ProductResponse } from '../types/product.types';


const Products: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  const { data: products, isLoading, refetch } = useMyProducts();
  const deleteProduct = useDeleteProduct('');

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`"${productName}" ürününü silmek istediğinize emin misiniz?`)) {
      try {
        await deleteProduct.mutateAsync({ productId });
        refetch();
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return <div className="loading-spinner">Yükleniyor...</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>📦 Dijital Ürünlerim</h1>
        <button 
          className="btn-add"
          onClick={() => navigate('/products/add')}
        >
          + Yeni Ürün Ekle
        </button>
      </div>

      {products && products.length === 0 ? (
        <div className="empty-state">
          <p>Henüz ürün eklemediniz.</p>
          <button onClick={() => navigate('/products/add')}>
            İlk Ürünü Ekle
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products?.map((product: ProductResponse) => (
            <div key={product.id} className="product-card">
              <div className="product-icon">
                {product.file_type === 'pdf' && '📄'}
                {product.file_type === 'video' && '🎥'}
                {product.file_type === 'audio' && '🎵'}
                {product.file_type === 'archive' && '📦'}
                {product.file_type === 'image' && '🖼️'}
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-meta">
                  <span className="product-price">{formatPrice(product.base_price)}</span>
                  <span className="product-type">
                    {product.file_type === 'pdf' && 'PDF'}
                    {product.file_type === 'video' && 'Video'}
                    {product.file_type === 'audio' && 'Ses'}
                    {product.file_type === 'archive' && 'Arşiv'}
                  </span>
                </div>

                {product.file_size && (
                  <div className="product-size">
                    Boyut: {formatFileSize(product.file_size)}
                  </div>
                )}

                <div className="product-status">
                  <span className={`status-badge status-${product.status}`}>
                    {product.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>

              <div className="product-actions">
                <button 
                  className="btn-edit"
                  onClick={() => navigate(`/products/edit/${product.id}`)}
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deleteProduct.isPending && deleteProduct.variables?.productId === product.id}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;