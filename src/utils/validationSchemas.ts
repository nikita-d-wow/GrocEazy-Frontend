import { z } from 'zod';

export const PATTERNS = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/,
    minLength: 8
};

export const passwordSchema = z
    .string()
    .min(PATTERNS.minLength, 'Password must be at least 8 characters')
    .regex(PATTERNS.uppercase, 'Password must contain at least one uppercase letter')
    .regex(PATTERNS.lowercase, 'Password must contain at least one lowercase letter')
    .regex(PATTERNS.number, 'Password must contain at least one number')
    .regex(PATTERNS.special, 'Password must contain at least one special character');
