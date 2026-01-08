import { Menu } from '../models/Menu.js';
import { Option } from '../models/Option.js';

export const menuController = {
  // 모든 메뉴 조회
  async getAllMenus(req, res) {
    try {
      const includeStock = req.path.includes('/with-stock') || req.originalUrl.includes('/with-stock');
      const menus = await Menu.findAll(includeStock);
      
      res.json({
        success: true,
        data: menus
      });
    } catch (error) {
      console.error('메뉴 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '메뉴 목록을 불러오는데 실패했습니다.'
      });
    }
  },

  // 특정 메뉴 조회
  async getMenuById(req, res) {
    try {
      const { id } = req.params;
      const menu = await Menu.findById(id);

      if (!menu) {
        return res.status(404).json({
          success: false,
          error: '메뉴를 찾을 수 없습니다.'
        });
      }

      // 옵션 정보도 함께 조회
      const options = await Option.findByMenuId(id);
      menu.options = options;

      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      console.error('메뉴 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '메뉴를 불러오는데 실패했습니다.'
      });
    }
  }
};
