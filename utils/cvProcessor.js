const fs = require('fs').promises;
const path = require('path');

class CVProcessor {
  constructor() {
    this.supportedFormats = ['.pdf', '.doc', '.docx'];
  }

  async validateCV(filePath) {
    try {
      const ext = path.extname(filePath).toLowerCase();
      
      if (!this.supportedFormats.includes(ext)) {
        throw new Error('Unsupported file format');
      }

      const stats = await fs.stat(filePath);
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (stats.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      return {
        valid: true,
        size: stats.size,
        format: ext
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  async extractFileName(filePath) {
    return path.basename(filePath);
  }

  getFileExtension(filename) {
    return path.extname(filename).toLowerCase();
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

module.exports = new CVProcessor();