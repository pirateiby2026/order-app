import { pool } from '../config/database.js';

export const Option = {
  // 모든 옵션 조회
  async findAll() {
    const result = await pool.query(
      'SELECT id, name, price, menu_id FROM options ORDER BY id'
    );
    return result.rows;
  },

  // 특정 메뉴에 적용 가능한 옵션 조회
  async findByMenuId(menuId) {
    const result = await pool.query(
      `SELECT id, name, price 
       FROM options 
       WHERE menu_id IS NULL OR menu_id = $1 
       ORDER BY id`,
      [menuId]
    );
    return result.rows;
  },

  // ID로 옵션 조회
  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, price, menu_id FROM options WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
};
