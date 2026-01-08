import { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import InventoryStatus from './components/InventoryStatus';
import OrderStatus from './components/OrderStatus';
import { menuAPI, orderAPI, inventoryAPI, optionAPI } from './services/api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [inventory, setInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메뉴 및 옵션 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const menusData = await menuAPI.getAllMenus();
        
        // 각 메뉴의 옵션 로드
        const menusWithOptions = await Promise.all(
          menusData.map(async (menu) => {
            const options = await optionAPI.getOptionsByMenuId(menu.id);
            return { ...menu, options };
          })
        );
        
        setMenus(menusWithOptions);
        setError(null);
      } catch (err) {
        console.error('메뉴 로드 실패:', err);
        setError(err.message || '메뉴를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  // 재고 로드
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const inventoryData = await inventoryAPI.getAllInventory();
        const inventoryMap = {};
        inventoryData.forEach(item => {
          inventoryMap[item.menuId] = item.stock;
        });
        setInventory(inventoryMap);
      } catch (err) {
        console.error('재고 로드 실패:', err);
      }
    };

    loadInventory();
  }, []);

  // 주문 목록 로드
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await orderAPI.getAllOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('주문 목록 로드 실패:', err);
      }
    };

    loadOrders();
    
    // 주기적으로 주문 목록 갱신 (5초마다)
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (item) => {
    // 함수형 업데이트를 사용하여 항상 최신 상태를 참조
    setCartItems(prev => {
      // 동일한 메뉴와 옵션 조합이 있는지 확인
      const existingIndex = prev.findIndex(cartItem => 
        cartItem.menuId === item.menuId &&
        JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
      );

      if (existingIndex !== -1) {
        // 기존 아이템의 수량을 정확히 1씩만 증가 (불변성 유지)
        return prev.map((cartItem, index) => {
          if (index === existingIndex) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1
            };
          }
          return cartItem;
        });
      } else {
        // 새 아이템 추가 (quantity는 항상 1로 시작)
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      // API로 주문 생성 (재고 확인 및 차감은 서버에서 처리)
      const orderItems = cartItems.map(item => ({
        menuId: item.menuId,
        quantity: item.quantity,
        selectedOptionIds: item.selectedOptions.map(opt => opt.id || opt.optionId)
      }));

      await orderAPI.createOrder(orderItems);

      // 주문 목록 새로고침
      const ordersData = await orderAPI.getAllOrders();
      setOrders(ordersData);

      // 재고 새로고침
      const inventoryData = await inventoryAPI.getAllInventory();
      const inventoryMap = {};
      inventoryData.forEach(item => {
        inventoryMap[item.menuId] = item.stock;
      });
      setInventory(inventoryMap);

      // 주문 완료 알림
      alert('주문이 완료되었습니다!');
      
      // 장바구니 초기화
      setCartItems([]);
    } catch (err) {
      console.error('주문 생성 실패:', err);
      if (err.message.includes('재고') || err.details) {
        // 재고 부족 에러 처리
        let errorMessage = '주문 실패: 재고가 부족합니다.\n\n';
        if (err.details && Array.isArray(err.details)) {
          err.details.forEach(detail => {
            errorMessage += `• ${detail.menuName}\n`;
            if (detail.available === 0) {
              errorMessage += `  → 재고 소진, 빠르게 준비하겠습니다.\n\n`;
            } else {
              errorMessage += `  → 최대 ${detail.available}개만 주문 가능합니다.\n\n`;
            }
          });
        } else {
          errorMessage += err.message;
        }
        alert(errorMessage);
      } else {
        alert(`주문 생성에 실패했습니다: ${err.message}`);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      
      // 주문 목록 새로고침
      const ordersData = await orderAPI.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('주문 상태 업데이트 실패:', err);
      alert(`주문 상태 업데이트에 실패했습니다: ${err.message}`);
    }
  };

  const handleUpdateInventory = async (menuId, newQuantity) => {
    try {
      await inventoryAPI.updateInventory(menuId, newQuantity);
      
      // 재고 새로고침
      const inventoryData = await inventoryAPI.getAllInventory();
      const inventoryMap = {};
      inventoryData.forEach(item => {
        inventoryMap[item.menuId] = item.stock;
      });
      setInventory(inventoryMap);
    } catch (err) {
      console.error('재고 업데이트 실패:', err);
      alert(`재고 업데이트에 실패했습니다: ${err.message}`);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('정말로 이 주문을 취소하시겠습니까? 취소된 주문의 재고는 복구됩니다.')) {
      return;
    }

    try {
      console.log('주문 취소 시도:', orderId);
      await orderAPI.cancelOrder(orderId);
      
      // 주문 목록 새로고침
      const ordersData = await orderAPI.getAllOrders();
      setOrders(ordersData);

      // 재고 새로고침 (재고가 복구되었으므로)
      const inventoryData = await inventoryAPI.getAllInventory();
      const inventoryMap = {};
      inventoryData.forEach(item => {
        inventoryMap[item.menuId] = item.stock;
      });
      setInventory(inventoryMap);

      alert('주문이 취소되었습니다.');
    } catch (err) {
      console.error('주문 취소 실패:', err);
      console.error('주문 ID:', orderId);
      alert(`주문 취소에 실패했습니다: ${err.message}`);
    }
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'order' && (
        <>
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
          )}
          {error && !loading && (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              color: 'red',
              backgroundColor: '#ffe6e6',
              margin: '1rem',
              borderRadius: '8px',
              border: '1px solid #ff9999'
            }}>
              <h2>연결 오류</h2>
              <p>{error}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                백엔드 서버가 실행 중인지 확인하세요.<br/>
                터미널에서 <code>cd server &amp;&amp; npm start</code> 명령을 실행하세요.
              </p>
            </div>
          )}
          {!loading && !error && (
            <div className="order-page">
              <div className="menu-section">
                <h1 className="section-title">메뉴</h1>
                <div className="menu-grid">
                  {menus.map(menu => (
                    <MenuCard
                      key={menu.id}
                      menu={menu}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
              
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onOrder={handleOrder}
              />
            </div>
          )}
        </>
      )}

      {currentPage === 'admin' && (
        <div className="admin-page">
          <AdminDashboard orders={orders} />
          <InventoryStatus 
            inventory={inventory} 
            onUpdateInventory={handleUpdateInventory}
            menuData={menus}
          />
          <OrderStatus 
            orders={orders} 
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCancelOrder={handleCancelOrder}
          />
        </div>
      )}
    </div>
  );
}

export default App;
