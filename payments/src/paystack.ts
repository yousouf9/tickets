import paystack from 'paystack'

export const Paystack = paystack(process.env.PAYSTACK_TEST_KEY!)

