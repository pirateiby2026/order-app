import './InventoryStatus.css';

function InventoryStatus({ inventory, menuData, onUpdateInventory }) {
  const getInventoryStatus = (quantity) => {
    if (quantity === 0) return { text: '품절', className: 'status-out' };
    if (quantity < 5) return { text: '주의', className: 'status-warning' };
    return { text: '정상', className: 'status-normal' };
  };

  return (
    <div className="inventory-status">
      <h2 className="inventory-title">재고 현황</h2>
      <div className="inventory-grid">
        {menuData.map(menu => {
          const quantity = inventory[menu.id] || 0;
          const status = getInventoryStatus(quantity);
          
          return (
            <div key={menu.id} className="inventory-card">
              <div className="inventory-menu-name">{menu.name}</div>
              <div className="inventory-quantity">
                <span className="quantity-number">{quantity}개</span>
                <span className={`status-badge ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <div className="inventory-controls">
                <button
                  className="inventory-button minus-button"
                  onClick={() => onUpdateInventory(menu.id, quantity - 1)}
                  disabled={quantity <= 0}
                  title="재고 감소"
                >
                  -
                </button>
                <button
                  className="inventory-button plus-button"
                  onClick={() => onUpdateInventory(menu.id, quantity + 1)}
                  title="재고 증가"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InventoryStatus;
