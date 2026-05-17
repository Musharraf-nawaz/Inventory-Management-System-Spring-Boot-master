package com.example.service;

import com.example.entity.Invoice;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public Invoice insert(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @Transactional(readOnly = true)
    public Invoice findById(int id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Invoice> findAll() {
        return (List<Invoice>) invoiceRepository.findAll();
    }

    public Invoice updateInvoice(Invoice invoice) {
        findById(invoice.getInvoiceId());
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Invoice invoice) {
        invoiceRepository.delete(invoice);
    }
}
