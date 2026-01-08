import { Option } from '../models/Option.js';

export const optionController = {
  // 모든 옵션 조회
  async getAllOptions(req, res) {
    try {
      const options = await Option.findAll();
      
      res.json({
        success: true,
        data: options
      });
    } catch (error) {
      console.error('옵션 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '옵션 목록을 불러오는데 실패했습니다.'
      });
    }
  },

  // 특정 메뉴의 옵션 조회
  async getOptionsByMenuId(req, res) {
    try {
      const { menuId } = req.params;
      const options = await Option.findByMenuId(menuId);
      
      res.json({
        success: true,
        data: options
      });
    } catch (error) {
      console.error('옵션 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: '옵션을 불러오는데 실패했습니다.'
      });
    }
  }
};
