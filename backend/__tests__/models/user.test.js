import User from '../../models/user.js';

describe('User Model', () => {
  test('should validate required fields', () => {
    const user = new User({});
    const validationError = user.validateSync();
    expect(validationError).toBeTruthy();
    expect(validationError.errors.email).toBeDefined();
    expect(validationError.errors.password).toBeDefined();
  });

  test('should hash password before saving', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123'
    });
    await user.save();
    expect(user.password).not.toBe('password123');
  });
});