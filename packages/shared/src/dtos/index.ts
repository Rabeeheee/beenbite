// ============================================
// Shared DTOs with Zod Validation - BeenBite
// ============================================

import { z } from 'zod';
import { UserRole, SubscriptionPlan, IndustryType, RewardType } from '../types';

// === Auth DTOs ===
export const RegisterDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  phone: z.string().optional(),
});
export type RegisterDtoType = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginDtoType = z.infer<typeof LoginDto>;

export const RefreshTokenDto = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
export type RefreshTokenDtoType = z.infer<typeof RefreshTokenDto>;

export const ForgotPasswordDto = z.object({
  email: z.string().email('Invalid email address'),
});
export type ForgotPasswordDtoType = z.infer<typeof ForgotPasswordDto>;

export const ResetPasswordDto = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
});
export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;

// === User DTOs ===
export const UpdateUserDto = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});
export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;

// === Company DTOs ===
export const CreateCompanyDto = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number format'
    ),
  industry: z.nativeEnum(IndustryType),
  email: z.string().email('Invalid business email'),
  phone: z.string().min(10, 'Invalid phone number'),
  website: z.string().url('Invalid website URL').optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(5, 'Invalid zip code'),
    country: z.string().default('India'),
  }),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional(),
});
export type CreateCompanyDtoType = z.infer<typeof CreateCompanyDto>;

export const UpdateCompanyDto = CreateCompanyDto.partial();
export type UpdateCompanyDtoType = z.infer<typeof UpdateCompanyDto>;

// === Theme Customization DTO ===
export const ThemeCustomizationDto = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  sidebarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  headerColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional(),
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
});
export type ThemeCustomizationDtoType = z.infer<typeof ThemeCustomizationDto>;

// === Subscription DTOs ===
export const CreateSubscriptionDto = z.object({
  companyId: z.string().uuid('Invalid company ID'),
  plan: z.nativeEnum(SubscriptionPlan),
  paymentMethodId: z.string().optional(),
});
export type CreateSubscriptionDtoType = z.infer<typeof CreateSubscriptionDto>;

// === Reward DTOs ===
export const CreateRewardDto = z.object({
  name: z.string().min(2, 'Reward name must be at least 2 characters'),
  description: z.string().max(500).optional(),
  type: z.nativeEnum(RewardType),
  value: z.number().positive('Reward value must be positive'),
  minPurchaseAmount: z.number().min(0).optional(),
  maxRedemptions: z.number().int().positive().optional(),
  categoryId: z.string().uuid().optional(),
  industryType: z.nativeEnum(IndustryType).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  conditions: z
    .object({
      minPoints: z.number().optional(),
      minVisits: z.number().optional(),
      specificDays: z.array(z.string()).optional(),
      requiresGoogleReview: z.boolean().optional(),
      requiresSocialFollow: z.boolean().optional(),
    })
    .optional(),
});
export type CreateRewardDtoType = z.infer<typeof CreateRewardDto>;

export const UpdateRewardDto = CreateRewardDto.partial();
export type UpdateRewardDtoType = z.infer<typeof UpdateRewardDto>;

// === Product DTOs ===
export const CreateProductDto = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().max(1000).optional(),
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().uuid('Invalid category ID'),
  images: z.array(z.string().url()).optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});
export type CreateProductDtoType = z.infer<typeof CreateProductDto>;

// === Category DTOs ===
export const CreateCategoryDto = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().max(500).optional(),
  parentId: z.string().uuid().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});
export type CreateCategoryDtoType = z.infer<typeof CreateCategoryDto>;

// === Payment DTOs ===
export const CreatePaymentDto = z.object({
  subscriptionId: z.string().uuid('Invalid subscription ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  provider: z.enum(['stripe', 'razorpay']),
});
export type CreatePaymentDtoType = z.infer<typeof CreatePaymentDto>;

// === Pagination DTO ===
export const PaginationDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});
export type PaginationDtoType = z.infer<typeof PaginationDto>;
