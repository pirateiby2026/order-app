import { pool } from '../config/database.js';

export const Order = {
  // 주문 생성
  async create(orderData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. 주문 생성
      const orderResult = await client.query(
        `INSERT INTO orders (order_time, total_amount, status)
         VALUES (CURRENT_TIMESTAMP, $1, 'pending')
         RETURNING id, order_time, total_amount, status`,
        [orderData.totalAmount]
      );
      const order = orderResult.rows[0];

      // 2. 주문 아이템 생성
      for (const item of orderData.items) {
        const itemResult = await client.query(
          `INSERT INTO order_items (order_id, menu_id, menu_name, quantity, item_price, total_price)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [
            order.id,
            item.menuId,
            item.menuName,
            item.quantity,
            item.itemPrice,
            item.totalPrice
          ]
        );
        const orderItemId = itemResult.rows[0].id;

        // 3. 옵션 저장
        if (item.selectedOptions && item.selectedOptions.length > 0) {
          for (const option of item.selectedOptions) {
            await client.query(
              `INSERT INTO order_item_options (order_item_id, option_id, option_name, option_price)
               VALUES ($1, $2, $3, $4)`,
              [
                orderItemId,
                option.optionId,
                option.optionName,
                option.optionPrice
              ]
            );
          }
        }

        // 4. 재고 차감
        const stockResult = await client.query(
          `UPDATE menus 
           SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $2 AND stock >= $1 
           RETURNING id`,
          [item.quantity, item.menuId]
        );

        if (stockResult.rows.length === 0) {
          throw new Error(`재고 부족: 메뉴 ID ${item.menuId}`);
        }
      }

      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // 모든 주문 조회
  async findAll(status = null) {
    let query = `
      SELECT 
        o.id,
        o.order_time,
        o.total_amount,
        o.status,
        o.created_at,
        o.updated_at
      FROM orders o
    `;
    const params = [];

    if (status) {
      query += ' WHERE o.status = $1';
      params.push(status);
    }

    query += ' ORDER BY o.order_time DESC';

    const result = await pool.query(query, params);
    const orders = result.rows;

    // 각 주문의 아이템과 옵션 조회
    for (const order of orders) {
      const itemsResult = await pool.query(
        `SELECT 
          oi.id,
          oi.menu_id,
          oi.menu_name,
          oi.quantity,
          oi.item_price,
          oi.total_price
         FROM order_items oi
         WHERE oi.order_id = $1
         ORDER BY oi.id`,
        [order.id]
      );

      order.items = [];

      for (const item of itemsResult.rows) {
        const optionsResult = await pool.query(
          `SELECT 
            oio.option_id,
            oio.option_name,
            oio.option_price
           FROM order_item_options oio
           WHERE oio.order_item_id = $1`,
          [item.id]
        );

        order.items.push({
          menuId: item.menu_id,
          menuName: item.menu_name,
          quantity: item.quantity,
          itemPrice: item.item_price,
          totalPrice: item.total_price,
          options: optionsResult.rows.map(opt => ({
            optionId: opt.option_id,
            optionName: opt.option_name,
            optionPrice: opt.option_price
          }))
        });
      }
    }

    return orders;
  },

  // ID로 주문 조회
  async findById(id) {
    const orderResult = await pool.query(
      `SELECT 
        id,
        order_time,
        total_amount,
        status,
        created_at,
        updated_at
       FROM orders
       WHERE id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];

    // 주문 아이템 조회
    const itemsResult = await pool.query(
      `SELECT 
        oi.id,
        oi.menu_id,
        oi.menu_name,
        oi.quantity,
        oi.item_price,
        oi.total_price
       FROM order_items oi
       WHERE oi.order_id = $1
       ORDER BY oi.id`,
      [id]
    );

    order.items = [];

    for (const item of itemsResult.rows) {
      const optionsResult = await pool.query(
        `SELECT 
          oio.option_id,
          oio.option_name,
          oio.option_price
         FROM order_item_options oio
         WHERE oio.order_item_id = $1`,
        [item.id]
      );

      order.items.push({
        menuId: item.menu_id,
        menuName: item.menu_name,
        quantity: item.quantity,
        itemPrice: item.item_price,
        totalPrice: item.total_price,
        options: optionsResult.rows.map(opt => ({
          optionId: opt.option_id,
          optionName: opt.option_name,
          optionPrice: opt.option_price
        }))
      });
    }

    return order;
  },

  // 주문 상태 업데이트
  async updateStatus(id, newStatus) {
    const validTransitions = {
      pending: ['received'],
      received: ['preparing'],
      preparing: ['completed']
    };

    // 현재 상태 조회
    const currentOrder = await this.findById(id);
    if (!currentOrder) {
      throw new Error('주문을 찾을 수 없습니다.');
    }

    const currentStatus = currentOrder.status;
    const allowedStatuses = validTransitions[currentStatus];

    if (!allowedStatuses || !allowedStatuses.includes(newStatus)) {
      throw new Error(
        `잘못된 상태 전환입니다. 현재 상태: ${currentStatus}, 요청 상태: ${newStatus}`
      );
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, status, updated_at`,
      [newStatus, id]
    );

    return result.rows[0];
  },

  // 주문 통계 조회
  async getStatistics() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'received') as received_orders,
        COUNT(*) FILTER (WHERE status = 'preparing') as preparing_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders
      FROM orders
    `);

    return {
      totalOrders: parseInt(result.rows[0].total_orders),
      receivedOrders: parseInt(result.rows[0].received_orders),
      preparingOrders: parseInt(result.rows[0].preparing_orders),
      completedOrders: parseInt(result.rows[0].completed_orders)
    };
  },

  // 주문 취소 (재고 복구 포함)
  async cancel(id) {
    const client = await pool.connect();
    try {
      // 주문 ID를 숫자로 변환
      const orderId = parseInt(id, 10);
      if (isNaN(orderId)) {
        throw new Error('유효하지 않은 주문 ID입니다.');
      }

      console.log('Order.cancel 호출, 주문 ID:', orderId);
      await client.query('BEGIN');

      // 1. 주문 정보 조회 (트랜잭션 내에서 직접 쿼리)
      const orderResult = await client.query(
        `SELECT 
          id,
          order_time,
          total_amount,
          status,
          created_at,
          updated_at
         FROM orders
         WHERE id = $1`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('주문을 찾을 수 없습니다.');
      }

      const order = orderResult.rows[0];
      console.log('조회된 주문:', `ID: ${order.id}, 상태: ${order.status}`);

      // 2. 취소 가능한 상태인지 확인 (completed 상태는 취소 불가)
      if (order.status === 'completed') {
        throw new Error('완료된 주문은 취소할 수 없습니다.');
      }

      // 3. 주문 아이템 조회 (트랜잭션 내에서)
      const itemsResult = await client.query(
        `SELECT 
          oi.id,
          oi.menu_id,
          oi.menu_name,
          oi.quantity,
          oi.item_price,
          oi.total_price
         FROM order_items oi
         WHERE oi.order_id = $1
         ORDER BY oi.id`,
        [orderId]
      );

      const items = itemsResult.rows;
      console.log('주문 아이템 수:', items.length);

      // 4. 주문 아이템의 재고 복구 (고객이 주문 전 상태로 복귀)
      if (items.length > 0) {
        console.log('재고 복구 시작');
        for (const item of items) {
          const updateResult = await client.query(
            `UPDATE menus 
             SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2
             RETURNING id, stock`,
            [item.quantity, item.menu_id]
          );
          
          if (updateResult.rows.length > 0) {
            console.log(`재고 복구: 메뉴 ID ${item.menu_id}, 수량 +${item.quantity}, 현재 재고: ${updateResult.rows[0].stock}`);
          } else {
            console.warn(`재고 복구 실패: 메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`);
          }
        }
      }

      // 5. 주문 삭제 (CASCADE로 order_items와 order_item_options도 함께 삭제됨)
      const deleteResult = await client.query('DELETE FROM orders WHERE id = $1 RETURNING id', [orderId]);
      if (deleteResult.rows.length === 0) {
        throw new Error('주문 삭제에 실패했습니다.');
      }
      console.log('주문 삭제 완료');

      await client.query('COMMIT');
      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Order.cancel 에러:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};
