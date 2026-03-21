import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setFilters, resetFilters } from '../redux/productSlice';

const ProductFilters: React.FC = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.product.filters);

  const categories = ['Kitap', 'Eğitim', 'Yazılım', 'Tasarım', 'Müzik'];
  const fileTypes = ['pdf', 'video', 'audio', 'archive', 'image'];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>🔍 Filtrele</h3>
        <button onClick={() => dispatch(resetFilters())}>Temizle</button>
      </div>

      <div className="filter-group">
        <label>Ara</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          placeholder="Ürün ara..."
        />
      </div>

      <div className="filter-group">
        <label>Kategori</label>
        <select
          value={filters.category}
          onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
        >
          <option value="">Tümü</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Dosya Tipi</label>
        <select
          value={filters.fileType}
          onChange={(e) => dispatch(setFilters({ fileType: e.target.value }))}
        >
          <option value="">Tümü</option>
          {fileTypes.map(type => (
            <option key={type} value={type}>{type.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Fiyat Aralığı</label>
        <div className="price-range">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => dispatch(setFilters({ minPrice: Number(e.target.value) }))}
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => dispatch(setFilters({ maxPrice: Number(e.target.value) }))}
            placeholder="Max"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Sıralama</label>
        <select
          value={filters.sortBy}
          onChange={(e) => dispatch(setFilters({ sortBy: e.target.value as any }))}
        >
          <option value="newest">En Yeni</option>
          <option value="price_asc">Fiyat (Düşük → Yüksek)</option>
          <option value="price_desc">Fiyat (Yüksek → Düşük)</option>
          <option value="name_asc">İsim (A → Z)</option>
          <option value="name_desc">İsim (Z → A)</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;