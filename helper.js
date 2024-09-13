const fs = require('fs').promises;
const path = require('path');

class Helper {
    constructor() {
        this.logFile = path.join(__dirname, 'app.log');
    }

    // Mapping function to transform Notion API responses
    mapNotionResponse(response, mapFunction) {
        if (Array.isArray(response.results)) {
            return response.results.map(mapFunction);
        }
        return mapFunction(response);
    }

    // Logging function
    async log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}\n`;
        
        try {
            await fs.appendFile(this.logFile, logEntry);
            console.log(logEntry.trim()); // Also log to console
        } catch (error) {
            console.error('Error writing to log file:', error);
        }
    }

    // Error logging function
    async logError(error, context = '') {
        const errorMessage = error.stack || error.message || String(error);
        await this.log(`${context} ${errorMessage}`, 'ERROR');
    }

    // Function to ensure a value is an array
    ensureArray(value) {
        return Array.isArray(value) ? value : [value];
    }

    // Function to chunk an array into smaller arrays
    chunk(array, size) {
        return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
            array.slice(i * size, i * size + size)
        );
    }

    // Function to retry an async operation
    async retry(operation, retries = 3, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }

    // Function to safely access nested object properties
    getNestedProperty(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    // Function to generate a unique ID
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Function to debounce a function call
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

module.exports = new Helper();