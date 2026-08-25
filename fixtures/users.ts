/**
 * Swag Labs provides several pre-seeded users. This file loads values from
 * environment variables when present, allowing credentials to be overridden
 * via a `.env` file for local runs.
 */
import * as dotenv from 'dotenv';
dotenv.config();

const envOr = (name: string, fallback: string) => process.env[name] ?? fallback;

export const USERS = {
  standard: {
    username: envOr('USERS_STANDARD_USERNAME', 'standard_user'),
    password: envOr('USERS_STANDARD_PASSWORD', 'secret_sauce'),
  },
  lockedOut: {
    username: envOr('USERS_LOCKEDOUT_USERNAME', 'locked_out_user'),
    password: envOr('USERS_LOCKEDOUT_PASSWORD', 'secret_sauce'),
  },
  problem: {
    username: envOr('USERS_PROBLEM_USERNAME', 'problem_user'),
    password: envOr('USERS_PROBLEM_PASSWORD', 'secret_sauce'),
  },
  performanceGlitch: {
    username: envOr('USERS_PERF_USERNAME', 'performance_glitch_user'),
    password: envOr('USERS_PERF_PASSWORD', 'secret_sauce'),
  },
  errorUser: {
    username: envOr('USERS_ERROR_USERNAME', 'error_user'),
    password: envOr('USERS_ERROR_PASSWORD', 'secret_sauce'),
  },
  visual: {
    username: envOr('USERS_VISUAL_USERNAME', 'visual_user'),
    password: envOr('USERS_VISUAL_PASSWORD', 'secret_sauce'),
  },
} as const;

export type UserKey = keyof typeof USERS;

export const CHECKOUT_INFO = {
  firstName: envOr('CHECKOUT_FIRST_NAME', 'Stella'),
  lastName: envOr('CHECKOUT_LAST_NAME', 'Gonzalez'),
  postalCode: envOr('CHECKOUT_POSTAL_CODE', 'C1000'),
};
