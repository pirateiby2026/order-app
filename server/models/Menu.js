import { pool } from '../config/database.js';

export const Menu = {
  // 모든 메뉴 조회
  async findAll(includeStock = false) {
    const query = includeStock
      ? 'SELECT id, name, description, price, image, stock FROM menus ORDER BY id'
      : 'SELECT id, name, description, price, image FROM menus ORDER BY id';
    
    const result = await pool.query(query);
    return result.rows;
  },

  // ID로 메뉴 조회
  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, description, price, image, stock FROM menus WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // 재고 업데이트
  async updateStock(id, stock) {
    const result = await pool.query(
      'UPDATE menus SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, stock',
      [stock, id]
    );
    return result.rows[0] || null;
  },

  // 재고 차감
  async decreaseStock(id, quantity) {
    const result = await pool.query(
      `UPDATE menus 
       SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND stock >= $1 
       RETURNING id, name, stock`,
      [quantity, id]
    );
    return result.rows[0] || null;
  },

  // 재고 확인
  async checkStock(id, quantity) {
    const result = await pool.query(
      'SELECT id, name, stock FROM menus WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return {
      ...result.rows[0],
      sufficient: result.rows[0].stock >= quantity
    };
  }
};
