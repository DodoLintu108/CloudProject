// Helper to check if we're in a development environment
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

// Development fallback values (only used locally)
const DEV_CONFIG = {
  userPoolId: 'us-east-1_xIpl3sIFI',
  userPoolClientId: '4filua8kmuqvqhimtu6ij0rs1g',
  userPoolClientSecret: 'u00p9rvsj93dnm7fl96jd7qu660inoj050bldfo95rd9msvib54',
  tasksTable: 'Tasks',
  attachmentsBucket: 'task-app-attachments-12345',
  accessKeyId: 'AKIAVFIWI6Y5QRLRRWJP',
  secretAccessKey: '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',
};

export function getConfigValue(envKey: string, fallbackKey: keyof typeof DEV_CONFIG): string {
  const envValue = process.env[envKey] || process.env[`NEXT_PUBLIC_${envKey}`];
  
  if (envValue) {
    return envValue;
  }
  
  // Only use development fallbacks in development mode
  if (isDevelopment()) {
    return DEV_CONFIG[fallbackKey];
  }
  
  return '';
}
