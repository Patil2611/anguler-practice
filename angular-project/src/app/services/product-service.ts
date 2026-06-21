import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../entity/product';

// Interface for paginated API response
interface PaginatedResponse {
  content: Product[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products/';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<PaginatedResponse>(this.apiUrl).pipe(
      map((response) => response.content)
    );
  }

  getProductList(): Observable<Product[]> {
    return this.getProducts();
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${updatedProduct.id}`, updatedProduct);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  refreshProducts(): void {
    this.getProducts().subscribe({
      next: (products) => this.productsSubject.next(products),
      error: (error) => console.error('Error fetching products:', error),
    });
  }
}
