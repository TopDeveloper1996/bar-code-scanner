const isProd = import.meta.env.MODE === 'production';

export const config = {
  apiUrl: isProd 
    ? 'https://bls.unitopsmedia.com'
    : 'http://localhost:5000'
} as const; 