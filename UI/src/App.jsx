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
    setCartItems(prev => {
      // 동일한 메뉴와 옵션 조합이 있는지 확인
      const existingIndex = prev.findIndex(cartItem => 
        cartItem.menuId === item.menuId &&
        JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
      );

      if (existingIndex !== -1) {
        // 기존 아이템의 수량 증가
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // 새 아이템 추가
        return [...prev, item];
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
      if (err.message.includes('재고')) {
        alert(`주문 실패: ${err.message}`);
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
          />
        </div>
      )}
    </div>
  );
}

export default App;
