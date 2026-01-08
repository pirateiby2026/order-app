import { useState, useEffect } from 'react';
import { inventoryAPI, menuAPI } from '../services/api';
import './InventoryStatus.css';

function InventoryStatus({ inventory, menuData = [], onUpdateInventory }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localInventory, setLocalInventory] = useState(inventory);

  // inventory prop이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setLocalInventory(inventory);
  }, [inventory]);

  // menuData가 없으면 API에서 로드 시도
  useEffect(() => {
    const loadMenusIfNeeded = async () => {
      if (!menuData || menuData.length === 0) {
        try {
          setLoading(true);
          const menus = await menuAPI.getAllMenusWithStock();
          // menus는 이미 stock 정보를 포함하고 있음
          const inventoryMap = {};
          menus.forEach(menu => {
            inventoryMap[menu.id] = menu.stock || 0;
          });
          setLocalInventory(inventoryMap);
        } catch (err) {
          console.error('메뉴 로드 실패:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMenusIfNeeded();
  }, [menuData]);

  const getInventoryStatus = (quantity) => {
    if (quantity === 0) return { text: '품절', className: 'status-out' };
    if (quantity < 5) return { text: '주의', className: 'status-warning' };
    return { text: '정상', className: 'status-normal' };
  };

  const handleUpdate = async (menuId, newQuantity) => {
    try {
      await onUpdateInventory(menuId, newQuantity);
      // 로컬 상태도 즉시 업데이트
      setLocalInventory(prev => ({
        ...prev,
        [menuId]: newQuantity
      }));
    } catch (err) {
      console.error('재고 업데이트 실패:', err);
      alert(`재고 업데이트에 실패했습니다: ${err.message}`);
    }
  };

  // menuData가 없고 로딩 중일 때
  if ((!menuData || menuData.length === 0) && loading) {
    return (
      <div className="inventory-status">
        <h2 className="inventory-title">재고 현황</h2>
        <p style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          재고 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  // menuData가 없고 에러가 있을 때
  if ((!menuData || menuData.length === 0) && error) {
    return (
      <div className="inventory-status">
        <h2 className="inventory-title">재고 현황</h2>
        <p style={{ padding: '1rem', textAlign: 'center', color: '#d32f2f' }}>
          재고 정보를 불러올 수 없습니다: {error}
        </p>
      </div>
    );
  }

  // menuData가 없을 때
  if (!menuData || menuData.length === 0) {
    return (
      <div className="inventory-status">
        <h2 className="inventory-title">재고 현황</h2>
        <p style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
          메뉴 데이터가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="inventory-status">
      <h2 className="inventory-title">재고 현황</h2>
      <div className="inventory-grid">
        {menuData.map(menu => {
          const quantity = localInventory[menu.id] || 0;
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
                  onClick={() => handleUpdate(menu.id, quantity - 1)}
                  disabled={quantity <= 0}
                  title="재고 감소"
                >
                  -
                </button>
                <button
                  className="inventory-button plus-button"
                  onClick={() => handleUpdate(menu.id, quantity + 1)}
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
