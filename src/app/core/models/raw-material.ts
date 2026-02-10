export interface RawMaterialResponse {
  id: number;
  code: number;
  name: string;
  stockQuantity: number; // BigDecimal
}

export interface RawMaterialRequest {
  code: number;
  name: string;
  stockQuantity: number;
}
