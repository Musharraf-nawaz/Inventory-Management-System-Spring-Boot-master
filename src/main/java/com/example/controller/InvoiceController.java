package com.example.controller;

import com.example.entity.Invoice;
import com.example.service.InvoiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public List<Invoice> getAllInvoice() {
        return invoiceService.findAll();
    }

    @GetMapping("/{id}")
    public Invoice getInvoice(@PathVariable int id) {
        return invoiceService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Invoice> addInvoice(@RequestBody Invoice invoice) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.insert(invoice));
    }

    @PutMapping("/{id}")
    public Invoice updateInvoice(@PathVariable int id, @RequestBody Invoice invoice) {
        invoice.setInvoiceId(id);
        return invoiceService.updateInvoice(invoice);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(@PathVariable int id) {
        invoiceService.deleteInvoice(invoiceService.findById(id));
    }
}
