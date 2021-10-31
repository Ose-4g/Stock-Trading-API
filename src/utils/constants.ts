const constants = {
  mongooseModels: {
    USER: 'User',
    TRANSACTION: 'Transaction',
    SHARE: 'Share',
  },
  environments: {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development',
    TEST: 'test',
  },
  test: {
    TEST_USER: {
      firstName: 'test',
      lastName: 'user',
      email: 'user@image.com',
      password: 'password',
      passwordConfirm: 'password',
    },
  },

  transactionTypes: {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    BUY: 'buy',
    SELL: 'sell',
  },

  transactionStatus: {
    INITIATED: 'initiated',
    FAILURE: 'failure',
    SUCCESS: 'success',
    PENDING: 'pending',
  },
};

export default constants;
