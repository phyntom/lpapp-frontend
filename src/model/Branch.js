export class Branch {
  branchId;
  branchName;
  bank;
  province;
  district;

  constructor(branchName, bank, province, district) {
    this.branchName = branchName;
    this.bank = bank;
    this.province = province;
    this.district = district;
  }

  static initParse(stringJson) {
    const branchName = JSON.parse(stringJson).branchName;
    const bank = JSON.parse(stringJson).brank;
    const province = JSON.parse(stringJson).province;
    return new Branch(branchName, bank, province);
  }
}
