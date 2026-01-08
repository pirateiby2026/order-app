import { Menu } from '../models/Menu.js';

export const inventoryController = {
  // 모든 재고 조회
  async getAllInventory(req, res) {
    try {
      const menus = await Menu.findAll(true);
      const inventory = menus.map(menu => ({
        menuId: menu.id,
        menuName: menu.name,
        stock: menu.stock
      }));
      
      res.json({
        success: true,
        data: inventory
      });
    } catch (error) {
      console.error('재고 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '재고 정보를 불러오는데 실패했습니다.'
      });
    }
  },

  // 재고 업데이트
  async updateInventory(req, res) {
    try {
      const { menuId } = req.params;
      const { stock } = req.body;

      if (stock === undefined || stock === null) {
        return res.status(400).json({
          success: false,
          error: '재고 수량이 필요합니다.'
        });
      }

      if (stock < 0) {
        return res.status(400).json({
          success: false,
          error: '재고는 0 이상이어야 합니다.'
        });
      }

      const menu = await Menu.updateStock(menuId, stock);

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: '메뉴를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: {
          menuId: menu.id,
          menuName: menu.name,
          stock: menu.stock
        }
      });
    } catch (error) {
      console.error('재고 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        error: '재고 업데이트에 실패했습니다.'
      });
    }
  }
};
