import { useState } from 'react';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (optionName) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionName)) {
        return prev.filter(name => name !== optionName);
      } else {
        return [...prev, optionName];
      }
    });
  };

  const calculateTotalPrice = () => {
    const optionPrice = selectedOptions.reduce((total, optionName) => {
      const option = menu.options.find(opt => opt.name === optionName);
      return total + (option ? option.price : 0);
    }, 0);
    return menu.price + optionPrice;
  };

  const handleAddToCart = () => {
    const selectedOptionsData = menu.options.filter(opt => 
      selectedOptions.includes(opt.name)
    );
    
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      selectedOptions: selectedOptionsData,
      quantity: 1,
      totalPrice: calculateTotalPrice()
    });

    // 옵션 초기화
    setSelectedOptions([]);
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        <div className="image-placeholder">
          <span>이미지</span>
        </div>
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{menu.price.toLocaleString()}원</p>
        <p className="menu-description">{menu.description}</p>
      </div>
      {menu.options && menu.options.length > 0 && (
        <div className="menu-options">
          {menu.options.map((option) => (
            <label key={option.name} className="option-checkbox">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.name)}
                onChange={() => handleOptionChange(option.name)}
              />
              <span>
                {option.name} {option.price > 0 && `(+${option.price.toLocaleString()}원)`}
              </span>
            </label>
          ))}
        </div>
      )}
      <div className="menu-footer">
        <div className="menu-total-price">
          총: {calculateTotalPrice().toLocaleString()}원
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          담기
        </button>
      </div>
    </div>
  );
}

export default MenuCard;
