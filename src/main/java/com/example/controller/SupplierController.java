package com.example.controller;

import com.example.entity.Supplier;
import com.example.entity.TheLogConverter;
import com.example.service.SupplierLogService;
import com.example.service.SupplierService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    private final SupplierService supplierService;
    private final SupplierLogService supplierLogService;

    public SupplierController(SupplierService supplierService, SupplierLogService supplierLogService) {
        this.supplierService = supplierService;
        this.supplierLogService = supplierLogService;
    }

    @GetMapping
    public List<Supplier> getAllSupplier() {
        return supplierService.findAll();
    }

    @GetMapping("/{id}")
    public Supplier getSupplier(@PathVariable int id) {
        return supplierService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Supplier> addSupplier(@RequestBody Supplier supplier) {
        Supplier saved = supplierService.insert(supplier);
        supplierLogService.insert(TheLogConverter.supplierLogConverter(saved));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable int id, @RequestBody Supplier supplier) {
        supplier.setSupplierId(id);
        Supplier updated = supplierService.updateSupplier(supplier);
        supplierLogService.insert(TheLogConverter.supplierLogConverter(updated));
        return updated;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSupplier(@PathVariable int id) {
        Supplier supplier = supplierService.findById(id);
        supplierService.deleteSupplier(supplier);
        supplierLogService.insert(TheLogConverter.supplierLogConverter(supplier));
    }
}
