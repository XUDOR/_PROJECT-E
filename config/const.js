
// const.js 
module.exports = {
  // Service URLs
  PROJECT_F_URL: 'http://localhost:3006/api/messages',
  PROJECT_B_URL: 'http://localhost:3002',
  PROJECT_A_URL: 'http://localhost:3001/api/receive-jobs',
  PROJECT_E_URL: 'http://localhost:3005',

  // Parser-specific configurations
  PARSER: {
      UPLOAD_FOLDER: 'uploads/',
      MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_FORMATS: ['pdf', 'docx', 'txt'],
      TEMP_STORAGE: 'temp/'
  },

  // API endpoints
  API_ENDPOINTS: {
      PARSE: '/api/parse',
      OPTIMIZE: '/api/optimize',
      STATUS: '/api/status',
      CONVERT: '/api/convert'
  },

  // Communication endpoints
  COMM_ENDPOINTS: {
      NOTIFICATION: '/api/notifications',
      LOG: '/api/communication'
  },

  // Database operations
  DB_OPERATIONS: {
      STORE_PARSE: '/store-parse',
      GET_DOCUMENT: '/get-document',
      UPDATE_STATUS: '/update-status'
  }
};