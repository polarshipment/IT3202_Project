module.exports = {
    preset: 'ts-jest', 
    testEnvironment: 'jsdom', 
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    
    
  };
  