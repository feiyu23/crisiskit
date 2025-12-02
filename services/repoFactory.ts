import { IncidentsRepo } from '../types';
import { InMemoryRepo } from './InMemoryRepo';

// Declare require to avoid TypeScript errors when @types/node is not available
declare const require: any;

// This factory handles the logic to switch between InMemory and Google Sheets.
// In a real environment, this would run on the server.
export function createIncidentsRepo(): IncidentsRepo {
  // Check if we are running in a Node.js environment with access to Env Vars
  const hasEnvVars = 
    typeof process !== 'undefined' && 
    process.env && 
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (hasEnvVars) {
    try {
      // We use a dynamic require to avoid bundling 'googleapis' in the client-side browser bundle.
      // In a Next.js server component or API route, this require would resolve correctly.
      const { GoogleSheetsRepo } = require('./GoogleSheetsRepo');
      
      console.log('Initializing Google Sheets Repository...');
      return new GoogleSheetsRepo(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
        process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!,
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID!
      );
    } catch (error) {
      console.warn('Failed to load GoogleSheetsRepo (likely missing googleapis dependency or running in browser). Falling back to InMemory.', error);
    }
  }

  // Default fallback
  return new InMemoryRepo();
}