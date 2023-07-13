export class    PaymentSummary{
    public id: number;
    public valueDate: Date;
    totalAmount: number;
    currency: String;
    invoiceNumber: String;
    supplierName: String;
    invoiceDate: Date;
    status: String;
  
    constructor(id:number, valueDate: Date,totalAmount: number,currency: String,invoiceNumber: String,supplierName: String,invoiceDate: Date,status: String){
        this.id=id;
        this.valueDate=valueDate;
        this.totalAmount=totalAmount;
        this.currency = currency;
        this.invoiceNumber=invoiceNumber;
        this.supplierName=supplierName;
        this.invoiceDate=invoiceDate;
        this.status=status;
    }
  }