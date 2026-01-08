import { useState } from 'react';
import Header from './components/Header';
import MenuCard from './components/MenuCard';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import InventoryStatus from './components/InventoryStatus';
import OrderStatus from './components/OrderStatus';
import { menuData } from './data/menuData';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderIdCounter, setOrderIdCounter] = useState(1);
  
  // 재고 초기화 (각 메뉴별 10개)
  const [inventory, setInventory] = useState(() => {
    const initialInventory = {};
    menuData.forEach(menu => {
      initialInventory[menu.id] = 10;
    });
    return initialInventory;
  });

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

  const handleOrder = () => {
    if (cartItems.length === 0) return;

    // 재고 확인
    const insufficientItems = [];
    cartItems.forEach(item => {
      if (inventory[item.menuId] < item.quantity) {
        insufficientItems.push(item.menuName);
      }
    });

    if (insufficientItems.length > 0) {
      alert(`재고가 부족합니다:\n${insufficientItems.join(', ')}`);
      return;
    }

    // 재고 차감
    cartItems.forEach(item => {
      setInventory(prev => ({
        ...prev,
        [item.menuId]: prev[item.menuId] - item.quantity
      }));
    });

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
    
    // 새 주문 생성
    const newOrder = {
      id: orderIdCounter,
      orderTime: new Date().toISOString(),
      items: cartItems.map(item => ({
        menuId: item.menuId,
        menuName: item.menuName,
        selectedOptions: item.selectedOptions,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      })),
      totalAmount: totalAmount,
      status: 'pending' // pending -> received -> preparing -> completed
    };

    // 주문 목록에 추가
    setOrders(prev => [newOrder, ...prev]);
    setOrderIdCounter(prev => prev + 1);

    // 주문 완료 알림
    alert('주문이 완료되었습니다!');
    
    // 장바구니 초기화
    setCartItems([]);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleUpdateInventory = (menuId, newQuantity) => {
    setInventory(prev => ({
      ...prev,
      [menuId]: Math.max(0, newQuantity)
    }));
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'order' && (
        <div className="order-page">
          <div className="menu-section">
            <h1 className="section-title">메뉴</h1>
            <div className="menu-grid">
              {menuData.map(menu => (
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

      {currentPage === 'admin' && (
        <div className="admin-page">
          <AdminDashboard orders={orders} />
          <InventoryStatus 
            inventory={inventory} 
            onUpdateInventory={handleUpdateInventory}
            menuData={menuData}
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
