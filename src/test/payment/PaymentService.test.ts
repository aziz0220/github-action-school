import { PaymentDetails, PaymentMethod } from '../../app/payment/PaymentDetails';
import { PaymentService } from '../../app/payment/PaymentService';
import { PaymentAdapter } from '../../app/payment/PaymentAdapter';

describe('Payment Service', () => {
  const paymentAdapterMock = {
    processPayment: jest.fn(),
  };
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService(paymentAdapterMock);
  });

  test('should successfully process a valid payment', () => {
    // Arrange
    //TODO: Create paymentDetails object initialized with fake data
    const mockPaymentDetails: PaymentDetails = { amount: 50, currency: 'tnd', method: PaymentMethod.CreditCard };
    //TODO: Create mockProcessPaymentResponse object containing success status and a fake transactiondId
    const mockProcessPaymentResponse :{ status: string, transactionId: string } = { status: 'success', transactionId: 'txn_1234567890' };
    //TODO: Mock processPayment implementation
    paymentAdapterMock.processPayment.mockImplementation((mockPaymentDetails: PaymentDetails) => mockProcessPaymentResponse);


    // Act
    const result = paymentService.makePayment(mockPaymentDetails);
    // Assert
    // Check the returned result is equal to the success message returned by makePayment with thefake  transactionId you have defined in mockProcessPaymentResponse
        expect(result).toEqual(`Payment successful. Transaction ID: ${mockProcessPaymentResponse.transactionId}`);
    // Check that processPayment inside makePayment has been called with paymentDetails
        expect(paymentAdapterMock.processPayment).toHaveBeenCalledWith(mockPaymentDetails);
  });

  test('should throw an error for payment failure', () => {
    // Arrange
    //TODO: Create paymentDetails object initialized with fake data
      const mockPaymentDetails: PaymentDetails = { amount: 50, currency: 'tnd', method: PaymentMethod.BankTransfer };

    //TODO: Create mockProcessPaymentResponse object containing failure status
      const mockProcessPaymentResponse = { status: 'failure' };
    //TODO: Mock processPayment implementation
      paymentAdapterMock.processPayment.mockImplementation((mockPaymentDetails: PaymentDetails) => mockProcessPaymentResponse);

    // Act & Assert
    expect(() => paymentService.makePayment(mockPaymentDetails)).toThrow('Payment failed');
  });

  test('should throw an error for invalid payment amount', () => {
    // Arrange

    //TODO: Create paymentDetails object initialized with fake data where amount should be negative or undefined
        const mockPaymentDetails: PaymentDetails = { amount: -50, currency: 'tnd', method: PaymentMethod.CreditCard };
        const mockProcessPaymentResponse = { status: 'failure' };
        paymentAdapterMock.processPayment.mockImplementation((mockPaymentDetails: PaymentDetails) => mockProcessPaymentResponse);

        // Act & Assert
       expect(() => paymentService.makePayment(mockPaymentDetails)).toThrow('Invalid payment amount');
  });
});
