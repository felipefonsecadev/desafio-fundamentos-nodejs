import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const balance = this.transactionsRepository.getBalance();

    if (type !== 'outcome' && type !== 'income') {
      throw new Error(
        'Invalid transaction type. Should be either income or outcome',
      );
    }

    if (value < 0) {
      throw new Error('Invalid value for transaction. Should be positive');
    }

    if (type === 'outcome' && balance.total - value < 0) {
      throw new Error('Insufficient funds to carry out transaction');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
