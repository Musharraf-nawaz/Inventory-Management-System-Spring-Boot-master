package com.example.controller;

import com.example.entity.Product;
import com.example.entity.TheLogConverter;
import com.example.service.ProductLogService;
import com.example.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final ProductLogService productLogService;

    public ProductController(ProductService productService, ProductLogService productLogService) {
        this.productService = productService;
        this.productLogService = productLogService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable int id) {
        return productService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product saved = productService.insert(product);
        productLogService.insert(TheLogConverter.productLogConverter(saved));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable int id, @RequestBody Product product) {
        product.setProductId(id);
        Product updated = productService.updateProduct(product);
        productLogService.insert(TheLogConverter.productLogConverter(updated));
        return updated;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable int id) {
        Product product = productService.findById(id);
        productService.deleteProduct(product);
        productLogService.insert(TheLogConverter.productLogConverter(product));
    }
}
