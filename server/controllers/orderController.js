import { Order } from '../models/Order.js';
import { Menu } from '../models/Menu.js';

export const orderController = {
  // 주문 생성
  async createOrder(req, res) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: '주문 아이템이 필요합니다.'
        });
      }

      // 재고 확인 및 가격 계산
      const insufficientItems = [];
      let totalAmount = 0;
      const processedItems = [];

      for (const item of items) {
        // 메뉴 정보 조회
        const menu = await Menu.findById(item.menuId);
        if (!menu) {
          return res.status(400).json({
            success: false,
            error: `메뉴를 찾을 수 없습니다. (ID: ${item.menuId})`
          });
        }

        // 재고 확인
        const stockCheck = await Menu.checkStock(item.menuId, item.quantity);
        if (!stockCheck.sufficient) {
          insufficientItems.push({
            menuId: item.menuId,
            menuName: menu.name,
            requested: item.quantity,
            available: stockCheck.stock
          });
          continue;
        }

        // 옵션 가격 계산
        let optionPrice = 0;
        const selectedOptions = [];
        
        if (item.selectedOptionIds && item.selectedOptionIds.length > 0) {
          const { Option } = await import('../models/Option.js');
          for (const optionId of item.selectedOptionIds) {
            const option = await Option.findById(optionId);
            if (option) {
              optionPrice += option.price;
              selectedOptions.push({
                optionId: option.id,
                optionName: option.name,
                optionPrice: option.price
              });
            }
          }
        }

        const itemPrice = menu.price + optionPrice;
        const totalPrice = itemPrice * item.quantity;
        totalAmount += totalPrice;

        processedItems.push({
          menuId: item.menuId,
          menuName: menu.name,
          quantity: item.quantity,
          itemPrice: itemPrice,
          totalPrice: totalPrice,
          selectedOptions: selectedOptions
        });
      }

      // 재고 부족 아이템이 있으면 에러 반환
      if (insufficientItems.length > 0) {
        return res.status(400).json({
          success: false,
          error: '재고가 부족합니다.',
          details: insufficientItems
        });
      }

      // 주문 생성
      const order = await Order.create({
        totalAmount,
        items: processedItems
      });

      res.status(201).json({
        success: true,
        data: {
          orderId: order.id,
          orderTime: order.order_time,
          totalAmount: order.total_amount,
          status: order.status
        }
      });
    } catch (error) {
      console.error('주문 생성 오류:', error);
      
      if (error.message.includes('재고 부족')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: '주문 생성에 실패했습니다.'
      });
    }
  },

  // 모든 주문 조회
  async getAllOrders(req, res) {
    try {
      const { status } = req.query;
      const orders = await Order.findAll(status);
      
      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('주문 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '주문 목록을 불러오는데 실패했습니다.'
      });
    }
  },

  // 특정 주문 조회
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: '주문을 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('주문 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '주문을 불러오는데 실패했습니다.'
      });
    }
  },

  // 주문 상태 업데이트
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: '상태 값이 필요합니다.'
        });
      }

      const order = await Order.updateStatus(id, status);

      res.json({
        success: true,
        data: {
          id: order.id,
          status: order.status,
          updatedAt: order.updated_at
        }
      });
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error);
      
      if (error.message.includes('잘못된 상태 전환') || error.message.includes('찾을 수 없습니다')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: '주문 상태 업데이트에 실패했습니다.'
      });
    }
  },

  // 주문 통계 조회
  async getOrderStatistics(req, res) {
    try {
      const statistics = await Order.getStatistics();
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('주문 통계 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '주문 통계를 불러오는데 실패했습니다.'
      });
    }
  },

  // 주문 취소
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      console.log('주문 취소 요청 - 원본 ID:', id, '타입:', typeof id);
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: '주문 ID가 필요합니다.'
        });
      }
      
      // 주문 ID를 숫자로 변환하여 검증
      const orderId = parseInt(id, 10);
      if (isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          error: '유효하지 않은 주문 ID입니다.'
        });
      }
      
      console.log('주문 취소 처리 시작 - 변환된 ID:', orderId);
      await Order.cancel(orderId);
      
      console.log('주문 취소 성공');
      res.json({
        success: true,
        message: '주문이 취소되었습니다.'
      });
    } catch (error) {
      console.error('주문 취소 오류:', error);
      console.error('에러 스택:', error.stack);
      
      if (error.message.includes('찾을 수 없습니다') || 
          error.message.includes('취소할 수 없습니다') ||
          error.message.includes('유효하지 않은')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: error.message || '주문 취소에 실패했습니다.'
      });
    }
  }
};
