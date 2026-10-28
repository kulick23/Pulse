import { describe, expect, it } from 'vitest';
import {
  applyPayment,
  BankLedger,
  cancelLedgerPayment,
  repeatLedgerPayment,
} from './bankLedger';

const ledger = (balance = 500): BankLedger => ({
  eurBalance: balance,
  transactions: [],
});

const payment = {
  recipient: 'Sofia Laurent',
  amount: 120,
  categoryRu: 'SEPA-перевод',
  categoryEn: 'SEPA transfer',
} as const;

describe('bank ledger money flows', () => {
  it('rejects a transfer when the balance is insufficient', () => {
    const current = ledger(50);
    expect(applyPayment(current, payment)).toBeNull();
    expect(current).toEqual(ledger(50));
  });

  it('creates a reversible transfer and subtracts the exact amount', () => {
    const next = applyPayment(
      ledger(),
      payment,
      new Date('2026-10-25T10:00:00Z'),
      'TX-1'
    );
    expect(next?.eurBalance).toBe(380);
    expect(next?.transactions[0]).toMatchObject({
      id: 'TX-1',
      amount: -120,
      status: 'completed',
      reversible: true,
    });
  });

  it('cancels a transfer once and restores its balance', () => {
    const paid = applyPayment(ledger(), payment, new Date(), 'TX-1');
    expect(paid).not.toBeNull();
    const cancelled = cancelLedgerPayment(paid!, 'TX-1');
    expect(cancelled?.eurBalance).toBe(500);
    expect(cancelled?.transactions[0]).toMatchObject({
      status: 'cancelled',
      reversible: false,
    });
    expect(cancelLedgerPayment(cancelled!, 'TX-1')).toBeNull();
  });

  it('repeats a previous transfer and links the new transaction', () => {
    const paid = applyPayment(ledger(), payment, new Date(), 'TX-1');
    const repeated = repeatLedgerPayment(
      paid!,
      'TX-1',
      new Date('2026-10-25T11:00:00Z'),
      'TX-2'
    );
    expect(repeated?.eurBalance).toBe(260);
    expect(repeated?.transactions[0]).toMatchObject({
      id: 'TX-2',
      originalTransactionId: 'TX-1',
      amount: -120,
    });
  });

  it('rejects a repeated transfer when funds are no longer available', () => {
    const paid = applyPayment(ledger(150), payment, new Date(), 'TX-1');
    expect(repeatLedgerPayment(paid!, 'TX-1')).toBeNull();
  });
});
