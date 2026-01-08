const API_BASE_URL = 'http://localhost:3000/api';

// API 호출 헬퍼 함수
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // 네트워크 오류 또는 서버 오류
      if (response.status === 0 || response.status >= 500) {
        throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `서버 오류 (${response.status})`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || '요청 처리에 실패했습니다.');
    }
    
    return data.data;
  } catch (error) {
    // 네트워크 오류 처리
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    }
    throw error;
  }
}

// 메뉴 API
export const menuAPI = {
  // 모든 메뉴 조회
  async getAllMenus() {
    return await apiCall(`${API_BASE_URL}/menus`);
  },

  // 재고 포함 메뉴 조회 (관리자용)
  async getAllMenusWithStock() {
    return await apiCall(`${API_BASE_URL}/menus/with-stock`);
  },

  // 특정 메뉴 조회
  async getMenuById(id) {
    return await apiCall(`${API_BASE_URL}/menus/${id}`);
  }
};

// 옵션 API
export const optionAPI = {
  // 모든 옵션 조회
  async getAllOptions() {
    return await apiCall(`${API_BASE_URL}/options`);
  },

  // 특정 메뉴의 옵션 조회
  async getOptionsByMenuId(menuId) {
    return await apiCall(`${API_BASE_URL}/options/menu/${menuId}`);
  }
};

// 주문 API
export const orderAPI = {
  // 주문 생성
  async createOrder(items) {
    return await apiCall(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });
  },

  // 모든 주문 조회
  async getAllOrders(status = null) {
    const url = status 
      ? `${API_BASE_URL}/orders?status=${status}`
      : `${API_BASE_URL}/orders`;
    return await apiCall(url);
  },

  // 특정 주문 조회
  async getOrderById(id) {
    return await apiCall(`${API_BASE_URL}/orders/${id}`);
  },

  // 주문 상태 업데이트
  async updateOrderStatus(id, status) {
    return await apiCall(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
  },

  // 주문 통계 조회
  async getOrderStatistics() {
    return await apiCall(`${API_BASE_URL}/orders/statistics`);
  }
};

// 재고 API
export const inventoryAPI = {
  // 모든 재고 조회
  async getAllInventory() {
    return await apiCall(`${API_BASE_URL}/inventory`);
  },

  // 재고 업데이트
  async updateInventory(menuId, stock) {
    return await apiCall(`${API_BASE_URL}/inventory/${menuId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stock })
    });
  }
};
