import connectCloudinary from '../../config/cloudinary.js';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn()
  }
}));

describe('Cloudinary Configuration', () => {
  test('should configure cloudinary with credentials', () => {
    connectCloudinary();
    expect(require('cloudinary').v2.config).toHaveBeenCalled();
  });
});
