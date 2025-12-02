import { createIncidentsRepo } from './repoFactory';

// Export the singleton instance of the repository.
// The factory will decide whether to use InMemory or Google Sheets
// based on the environment variables.
export const storageService = createIncidentsRepo();