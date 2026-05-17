package com.example.controller;

import com.example.entity.ProductPricing;
import com.example.service.ProductPricingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-pricings")
public class ProductPricingController {

    private final ProductPricingService productPricingService;

    public ProductPricingController(ProductPricingService productPricingService) {
        this.productPricingService = productPricingService;
    }

    @GetMapping
    public List<ProductPricing> getAllProductPricing() {
        return productPricingService.findAll();
    }

    @GetMapping("/{id}")
    public ProductPricing getProductPricing(@PathVariable int id) {
        return productPricingService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ProductPricing> addProductPricing(@RequestBody ProductPricing productPricing) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productPricingService.insert(productPricing));
    }

    @PutMapping("/{id}")
    public ProductPricing updateProductPricing(@PathVariable int id, @RequestBody ProductPricing productPricing) {
        productPricing.setRefId(id);
        return productPricingService.updateProductPricing(productPricing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProductPricing(@PathVariable int id) {
        productPricingService.deleteProductPricing(productPricingService.findById(id));
    }
}
