/**
 * Test utilities for ScripturePanelRCL tests
 * Provides consistent timeout handling and mock utilities
 */

export const TEST_TIMEOUT = 8000; // Increased from 5000
export const WAIT_FOR_TIMEOUT = 6000; // Increased from 3000
export const MOCK_ASYNC_TIMEOUT = 1000; // For mock operations
export const PROSKOMMA_TIMEOUT = 3000; // Specific timeout for proskomma operations

// Track active timeouts and intervals for cleanup
let activeTimeouts = new Set();
let activeIntervals = new Set();

/**
 * Creates a promise that rejects after a timeout
 */
export const createTimeoutPromise = (ms = TEST_TIMEOUT, message = "Test operation timed out") => {
  return new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      activeTimeouts.delete(timeoutId);
      reject(new Error(message));
    }, ms);
    activeTimeouts.add(timeoutId);
  });
};

/**
 * Wraps a promise with a timeout and automatic cleanup
 */
export const withTimeout = (promise, ms = TEST_TIMEOUT, message = "Operation timed out") => {
  const timeoutPromise = createTimeoutPromise(ms, message);

  return Promise.race([
    promise.finally(() => {
      // Clean up the timeout when promise resolves/rejects
      timeoutPromise.catch(() => {}); // Suppress unhandled rejection
    }),
    timeoutPromise,
  ]);
};

/**
 * Cleanup function to clear all active timeouts and intervals
 */
export const cleanupTimeouts = () => {
  activeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  activeTimeouts.clear();
  activeIntervals.forEach((intervalId) => clearInterval(intervalId));
  activeIntervals.clear();
};

/**
 * Standard waitFor options with timeout
 */
export const waitForOptions = {
  timeout: WAIT_FOR_TIMEOUT,
  interval: 100, // Increased from 50 for less CPU usage
};

/**
 * Enhanced waitFor options for slow operations
 */
export const slowWaitForOptions = {
  timeout: TEST_TIMEOUT,
  interval: 200,
};

/**
 * Creates an abort controller with timeout
 */
export const createAbortController = (timeoutMs = TEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    activeTimeouts.delete(timeoutId);
  }, timeoutMs);
  activeTimeouts.add(timeoutId);

  return controller;
};

/**
 * Mock proskomma hooks with timeout protection
 */
export const createMockProskommaHooks = () => ({
  useProskomma: () => ({
    proskomma: {
      bookIds: () => ["GEN", "TIT"],
      gqlQuerySync: () => ({
        docSet: {
          document: {
            bookCode: "GEN",
            headers: [],
            mainSequence: {
              blocks: [
                {
                  scopeLabels: ["chapter/1", "verse/1"],
                  text: "In the beginning God created the heavens and the earth.",
                },
                {
                  scopeLabels: ["chapter/1", "verse/2"],
                  text: "The earth was without form and void, and darkness was over the face of the deep.",
                },
              ],
            },
          },
        },
      }),
      gqlQuery: () =>
        Promise.resolve({
          docSet: {
            document: {
              bookCode: "GEN",
              headers: [],
              mainSequence: {
                blocks: [
                  {
                    scopeLabels: ["chapter/1", "verse/1"],
                    text: "In the beginning God created the heavens and the earth.",
                  },
                  {
                    scopeLabels: ["chapter/1", "verse/2"],
                    text: "The earth was without form and void, and darkness was over the face of the deep.",
                  },
                ],
              },
            },
          },
        }),
    },
    state: { docSetIds: ["docSet1"] },
    error: null,
  }),
  useImport: (options = {}) => ({
    importing: false,
    done: true,
    errors: [],
    // Ensure import completes within timeout
    ...options,
  }),
  usePassage: (options = {}) => ({
    loading: false,
    data: {
      mainSequence: {
        blocks: [
          {
            type: "heading",
            content: [{ text: "Chapter 1" }],
            scopeLabels: ["chapter/1"],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "verse",
                number: "1",
                content: [{ text: "Paul, a servant of God and an apostle of Jesus Christ" }],
                scopeLabels: ["chapter/1", "verse/1"],
              },
              {
                type: "verse",
                number: "2",
                content: [{ text: "in hope of eternal life" }],
                scopeLabels: ["chapter/1", "verse/2"],
              },
            ],
            scopeLabels: ["chapter/1"],
          },
        ],
      },
    },
    errors: [],
    ...options,
  }),
  useSearchForPassages: (query = "", options = {}) => ({
    loading: false,
    passages: [],
    errors: [],
    // Provide timeout-aware search results
    ...options,
  }),
  useCatalog: () => ({
    catalog: {
      docSets: [],
    },
    data: {
      nDocSets: 0,
      nDocuments: 0,
    },
  }),
  useQuery: (query, options = {}) => ({
    loading: false,
    data: {
      docSet: {
        document: {
          bookCode: "GEN",
          headers: [],
          mainSequence: {
            blocks: [
              {
                scopeLabels: ["chapter/1", "verse/1"],
                text: "In the beginning God created the heavens and the earth.",
              },
              {
                scopeLabels: ["chapter/1", "verse/2"],
                text: "The earth was without form and void, and darkness was over the face of the deep.",
              },
            ],
          },
        },
      },
    },
    errors: [],
    ...options,
  }),
});

/**
 * Mock scriptureService with timeout handling
 */
export const createMockScriptureService = () => ({
  fetchBook: (params) => {
    const mockUSFM = `\\id GEN
\\c 1
\\v 1 In the beginning God created the heavens and the earth.
\\v 2 The earth was without form and void, and darkness was over the face of the deep.`;

    // Simulate network delay but with timeout protection
    return withTimeout(
      new Promise((resolve) => {
        setTimeout(() => resolve(mockUSFM), 100); // Quick response
      }),
      MOCK_ASYNC_TIMEOUT,
      `fetchBook timed out for ${params?.bookId || "unknown"}`
    );
  },
});

/**
 * Enhanced mock for search operations with timeout
 */
export const createMockSearchHook = (options = {}) => {
  const {
    loading = false,
    passages = [],
    errors = [],
    shouldTimeout = false,
    timeoutMs = 5000,
  } = options;

  if (shouldTimeout) {
    return {
      loading: true,
      passages: [],
      errors: [],
      // Mock will timeout after specified time
      _timeout: setTimeout(() => {
        throw new Error("Search operation timed out");
      }, timeoutMs),
    };
  }

  return {
    loading,
    passages,
    errors,
  };
};

/**
 * Test helper to create a component with timeout protection
 */
export const renderWithTimeout = async (renderFn, timeoutMs = TEST_TIMEOUT) => {
  const controller = createAbortController(timeoutMs);

  try {
    const result = await withTimeout(
      Promise.resolve(renderFn()),
      timeoutMs,
      "Component render timed out"
    );
    return result;
  } catch (error) {
    controller.abort();
    throw error;
  }
};

/**
 * Test cleanup utility
 */
export const testCleanup = async () => {
  cleanupTimeouts();
  // Clear any pending promises
  await new Promise((resolve) => setTimeout(resolve, 0));
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
};

/**
 * Creates a timeout-protected proskomma operation
 */
export const withProskommaTimeout = (operation, timeoutMs = PROSKOMMA_TIMEOUT) => {
  return withTimeout(operation, timeoutMs, "Proskomma operation timed out");
};

/**
 * Helper to wait for proskomma import completion with timeout
 */
export const waitForImportComplete = (importHook, options = {}) => {
  const { timeout = PROSKOMMA_TIMEOUT, checkInterval = 100 } = options;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      if (importHook.done) {
        clearInterval(intervalId);
        activeIntervals.delete(intervalId);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(intervalId);
        activeIntervals.delete(intervalId);
        reject(new Error(`Import did not complete within ${timeout}ms`));
      }
    }, checkInterval);

    activeIntervals.add(intervalId);
  });
};

/**
 * Create a mock hook that simulates timeout behavior
 */
export const createTimeoutMockHook = (hookName, timeoutMs = 2000) => {
  return () => {
    const [state, setState] = React.useState({ loading: true, done: false });

    React.useEffect(() => {
      const timeoutId = setTimeout(() => {
        setState({ loading: false, done: false, error: new Error(`${hookName} timed out`) });
      }, timeoutMs);

      return () => clearTimeout(timeoutId);
    }, []);

    return state;
  };
};
