export interface ProductionSuggestionItemResponse {
  productId: number;
  productCode: number;
  productName: string;
  unitPrice: number;
  quantityToProduce: number;
  totalValue: number;
}

export interface ProductionSuggestionResponse {
  items: ProductionSuggestionItemResponse[];
  grandTotalValue: number;
}
