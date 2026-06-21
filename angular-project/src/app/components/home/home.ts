import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../services/product-service';
import { Product } from '../../entity/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'pName', 'price', 'category', 'status', 'actions'];
  isLoading = false;

  newProduct: Product = {
    pName: '',
    price: 0,
    category: '',
    status: 'Active',
  };

  editingProduct: Product | null = null;
  isAddMode = true;
  private destroy$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.showSnackBar('Error loading products!');
          this.isLoading = false;
        },
      });
  }

  onAddProduct(): void {
    if (this.newProduct.pName && this.newProduct.price && this.newProduct.category) {
      this.isLoading = true;
      this.productService
        .addProduct({ ...this.newProduct })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSnackBar('Product added successfully!');
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error adding product:', error);
            this.showSnackBar('Error adding product!');
            this.isLoading = false;
          },
        });
    } else {
      this.showSnackBar('Please fill all fields!');
    }
  }

  onEditProduct(product: Product): void {
    this.isAddMode = false;
    this.editingProduct = { ...product };
    this.newProduct = { ...product };
  }

  onUpdateProduct(): void {
    if (this.editingProduct && this.newProduct.pName && this.newProduct.price && this.newProduct.category) {
      this.isLoading = true;
      this.productService
        .updateProduct({ ...this.newProduct, id: this.editingProduct.id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSnackBar('Product updated successfully!');
            this.resetForm();
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.showSnackBar('Error updating product!');
            this.isLoading = false;
          },
        });
    } else {
      this.showSnackBar('Please fill all fields!');
    }
  }

  onDeleteProduct(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      this.productService
        .deleteProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSnackBar('Product deleted successfully!');
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.showSnackBar('Error deleting product!');
            this.isLoading = false;
          },
        });
    }
  }

  onCancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.newProduct = {
      pName: '',
      price: 0,
      category: '',
      status: 'Active',
    };
    this.editingProduct = null;
    this.isAddMode = true;
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
