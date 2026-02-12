import DOMPurify from 'dompurify';

/**
 * Sanitizes input string to prevent XSS attacks.
 * Uses DOMPurify to strip dangerous tags and attributes.
 */
export const sanitizeInput = (content: string): string => {
    return DOMPurify.sanitize(content);
};
