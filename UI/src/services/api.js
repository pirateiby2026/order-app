// 환경 변수에서 API URL 가져오기 (배포 시 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        // 재고 부족 에러의 경우 details도 함께 전달
        const error = new Error(data.error || '주문 생성에 실패했습니다.');
        if (data.details) {
          error.details = data.details;
        }
        throw error;
      }
      
      return data.data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      throw error;
    }
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
  },

  // 주문 취소
  async cancelOrder(id) {
    try {
      if (!id) {
        throw new Error('주문 ID가 필요합니다.');
      }
      
      const url = `${API_BASE_URL}/orders/${id}/cancel`;
      console.log('주문 취소 API 호출:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('주문 취소 응답 상태:', response.status);
      
      if (!response.ok) {
        // 404 또는 다른 HTTP 에러 처리
        if (response.status === 404) {
          const errorData = await response.json().catch(() => ({}));
          console.error('404 에러 응답:', errorData);
          throw new Error(errorData.error || '주문을 찾을 수 없습니다.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        console.error('에러 응답:', errorData);
        throw new Error(errorData.error || `주문 취소에 실패했습니다. (${response.status})`);
      }
      
      const data = await response.json();
      console.log('주문 취소 성공:', data);
      
      if (!data.success) {
        throw new Error(data.error || '주문 취소에 실패했습니다.');
      }
      
      return data;
    } catch (error) {
      console.error('주문 취소 API 에러:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      throw error;
    }
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
