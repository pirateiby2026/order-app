import './Cart.css';

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onOrder }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  const formatOptions = (options) => {
    if (!options || options.length === 0) return '';
    return ` (${options.map(opt => opt.name).join(', ')})`;
  };

  return (
    <div className="cart">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="cart-empty">장바구니가 비어있습니다</p>
          ) : (
            cartItems.map((item, index) => {
              const uniqueKey = `${item.menuId}-${JSON.stringify(item.selectedOptions)}-${index}`;
              return (
                <div key={uniqueKey} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">
                      {item.menuName}{formatOptions(item.selectedOptions)} X {item.quantity}
                    </span>
                    <span className="cart-item-price">
                      {(item.totalPrice * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="quantity-button"
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => onRemoveItem(index)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-summary">
          <div className="cart-total">
            <span className="total-label">총 금액</span>
            <span className="total-amount">{totalAmount.toLocaleString()}원</span>
          </div>
          <button
            className="order-button"
            onClick={onOrder}
            disabled={cartItems.length === 0}
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
