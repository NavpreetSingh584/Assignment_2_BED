// Mock Firebase Admin usage project-wide
jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
  },
  db: {
    collection: jest.fn().mockReturnValue({
      add: jest.fn(),
      doc: jest.fn().mockReturnValue({
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
      }),
      get: jest.fn(),
    }),
    runTransaction: jest.fn(),
    batch: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetModules();
});
