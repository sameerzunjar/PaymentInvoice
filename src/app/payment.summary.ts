export class PaymentSummary{
    public id: number;
    public valueDate: Date;
    totalAmount: number;
    currency: String;
    invoiceNumber: String;
    supplierName: String;
    invoiceDate: Date;
    status: String;
    receiverAddress: String;
    supplierAddress: String;
    receiverName: String;
    supplierAccountNumber: String;
    supplierBankName: String;
    supplierBic: String;
  
    constructor(id:number, valueDate: Date,totalAmount: number,currency: 
        String,invoiceNumber: String,supplierName: 
        String,invoiceDate: Date,status: String, receiverAddress: String,
        supplierAddress: String, receiverName: String, supplierAccountNumber: String,
        supplierBankName: String, supplierBic: String){
        this.id=id;
        this.valueDate=valueDate;
        this.totalAmount=totalAmount;
        this.currency = currency;
        this.invoiceNumber=invoiceNumber;
        this.supplierName=supplierName;
        this.invoiceDate=invoiceDate;
        this.status=status;
        this.receiverAddress=receiverAddress;
        this.supplierAddress=supplierAddress;
        this.receiverName=receiverName;
        this.supplierAccountNumber=supplierAccountNumber;
        this.supplierBankName=supplierBankName;
        this.supplierBic=supplierBic;
    }
  }