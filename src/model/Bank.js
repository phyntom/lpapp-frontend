export class Bank {
  constructor(bankName, bankType, maxSumInsured, discount) {
    this.bankName = bankName;
    this.bankType = bankType;
    this.maxSumInsured = maxSumInsured;
    this.discount = discount;
  }

  static initParse(stringJson) {
    const bankName = JSON.parse(stringJson).bankName;
    const bankType = JSON.parse(stringJson).bankType;
    const maxSumInsured = JSON.parse(stringJson).maxSumInsured;
    const discount = JSON.parse(stringJson).discount;
    return new Bank(bankName, bankType, maxSumInsured, discount);
  }
}
