export interface ProductRawMaterialRequest {
  rawMaterialId: number;
  quantityRequired: number;
}

export interface ProductRawMaterialResponse {
  rawMaterialId: number;
  rawMaterialCode: number;
  rawMaterialName: string;
  quantityRequired: number;
}

export interface ProductRequest {
  code: number;
  name: string;
  price: number;
  rawMaterials: ProductRawMaterialRequest[];
}

export interface ProductResponse {
  id: number;
  code: number;
  name: string;
  price: number;
  rawMaterials: ProductRawMaterialResponse[];
}
