// Format phone number
const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Add country code if not present
    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    }
    return `+${cleaned}`;
};

// Format currency
const formatCurrency = (amount) => {
    if (isNaN(amount)) return '₹0';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// Format date
const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

// Parse date from string
const parseDate = (dateStr) => {
    const match = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (!match) return null;
    const [, day, month, year] = match;
    return new Date(year, month - 1, day);
};

// Validate phone number
const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
};

// Validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Generate random ID
const generateId = (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`.toUpperCase();
};

module.exports = {
    formatPhoneNumber,
    formatCurrency,
    formatDate,
    parseDate,
    isValidPhone,
    isValidEmail,
    generateId
};
