import { validateEnvironment } from './config/env.validation';

describe('Environment & Foundation Unit Tests', () => {
  it('validates a well-formed environment configuration', () => {
    const validEnv = {
      NODE_ENV: 'development',
      PORT: '8080',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/krishi_vidhan_db?sslmode=require',
      JWT_SECRET: 'super_secret_key_that_is_at_least_32_characters_long_12345',
      FRONTEND_URL: 'http://localhost:3000',
    };

    const validated = validateEnvironment(validEnv);
    expect(validated.PORT).toBe(8080);
    expect(validated.NODE_ENV).toBe('development');
  });

  it('rejects weak JWT secrets shorter than 32 characters (SEC-06)', () => {
    const weakEnv = {
      NODE_ENV: 'development',
      PORT: '8080',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/krishi_vidhan_db',
      JWT_SECRET: 'short_secret',
      FRONTEND_URL: 'http://localhost:3000',
    };

    expect(() => validateEnvironment(weakEnv)).toThrow(
      /JWT_SECRET must be at least 32 characters long/,
    );
  });
});

