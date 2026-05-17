package com.example.service;

import com.example.entity.ProductInvoice;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.ProductInvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductInvoiceService {

    private final ProductInvoiceRepository productInvoiceRepository;

    public ProductInvoiceService(ProductInvoiceRepository productInvoiceRepository) {
        this.productInvoiceRepository = productInvoiceRepository;
    }

    public ProductInvoice insert(ProductInvoice productInvoice) {
        return productInvoiceRepository.save(productInvoice);
    }

    @Transactional(readOnly = true)
    public ProductInvoice findById(int id) {
        return productInvoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product invoice not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<ProductInvoice> findAll() {
        return (List<ProductInvoice>) productInvoiceRepository.findAll();
    }

    public ProductInvoice updateProductInvoice(ProductInvoice productInvoice) {
        findById(productInvoice.getRefId());
        return productInvoiceRepository.save(productInvoice);
    }

    public void deleteProductInvoice(ProductInvoice productInvoice) {
        productInvoiceRepository.delete(productInvoice);
    }
}
