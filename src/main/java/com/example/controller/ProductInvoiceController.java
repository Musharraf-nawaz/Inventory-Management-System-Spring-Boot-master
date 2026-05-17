package com.example.controller;

import com.example.entity.ProductInvoice;
import com.example.service.ProductInvoiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-invoices")
public class ProductInvoiceController {

    private final ProductInvoiceService productInvoiceService;

    public ProductInvoiceController(ProductInvoiceService productInvoiceService) {
        this.productInvoiceService = productInvoiceService;
    }

    @GetMapping
    public List<ProductInvoice> getAllProductInvoice() {
        return productInvoiceService.findAll();
    }

    @GetMapping("/{id}")
    public ProductInvoice getProductInvoice(@PathVariable int id) {
        return productInvoiceService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ProductInvoice> addProductInvoice(@RequestBody ProductInvoice productInvoice) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productInvoiceService.insert(productInvoice));
    }

    @PutMapping("/{id}")
    public ProductInvoice updateProductInvoice(@PathVariable int id, @RequestBody ProductInvoice productInvoice) {
        productInvoice.setRefId(id);
        return productInvoiceService.updateProductInvoice(productInvoice);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProductInvoice(@PathVariable int id) {
        productInvoiceService.deleteProductInvoice(productInvoiceService.findById(id));
    }
}
