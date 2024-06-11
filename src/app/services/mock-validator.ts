export class ValidationMockService {
    formatCurrency: string = 'c0';
    ssnMask: string = '999-99-9999';
    validationMessage = {
      IH_added_Success: 'added Successfully'
    };

    setDate(days: number): Date {
      const time = days * 24 * 60 * 60 * 1000;
      const today = new Date().setHours(0, 0, 0, 0);
      return new Date(new Date(today).getTime() + time);
    }
}
