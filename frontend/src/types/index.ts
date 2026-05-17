export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
  roles: string[];
}

export interface Category {
  categoryId?: number;
  categoryName: string;
  createdUser?: string;
  createdDateTime?: string;
}

export interface Product {
  productId?: number;
  productName: string;
  productbuyingPrice: number;
  productsellingPrice: number;
  productIsService: number;
  category?: { categoryId: number };
}

export interface Supplier {
  supplierId?: number;
  supplierName: string;
  supplierContact?: number;
  supplierCompany?: string;
  createdUser?: string;
}

export interface Stock {
  refId?: number;
  quantity: number;
  dateStock?: string;
  branchId?: string;
  product?: { productId: number };
  supplier?: { supplierId: number };
  category?: { categoryId: number };
  createdUser?: string;
}

export interface Pricing {
  pricingId?: number;
  pricingName: string;
  pricingDiscountPrecentage?: number;
  pricingEffectiveDate?: string;
  pricingExpireDate?: string;
  createdUser?: string;
}

export interface Invoice {
  invoiceId?: number;
  productId?: number;
  productName?: string;
  quantity: number;
  lineTotal: number;
  total: number;
}

export interface ProductPricing {
  refId?: number;
  pricing?: { pricingId: number };
  product?: { productId: number };
}

export interface ProductInvoice {
  refId?: number;
  invoice?: { invoiceId: number };
  product?: { productId: number };
}

export interface User {
  userId: number;
  userName: string;
  userFname: string;
  userLname: string;
  userEmail: string;
  userAddress: string;
}

export interface Role {
  roleId: number;
  roleName: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
