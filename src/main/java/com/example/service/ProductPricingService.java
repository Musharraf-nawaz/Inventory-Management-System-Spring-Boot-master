package com.example.service;

import com.example.entity.ProductPricing;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.ProductPricingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductPricingService {

    private final ProductPricingRepository productPricingRepository;

    public ProductPricingService(ProductPricingRepository productPricingRepository) {
        this.productPricingRepository = productPricingRepository;
    }

    public ProductPricing insert(ProductPricing productPricing) {
        return productPricingRepository.save(productPricing);
    }

    @Transactional(readOnly = true)
    public ProductPricing findById(int id) {
        return productPricingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product pricing not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<ProductPricing> findAll() {
        return (List<ProductPricing>) productPricingRepository.findAll();
    }

    public ProductPricing updateProductPricing(ProductPricing productPricing) {
        findById(productPricing.getRefId());
        return productPricingRepository.save(productPricing);
    }

    public void deleteProductPricing(ProductPricing productPricing) {
        productPricingRepository.delete(productPricing);
    }
}
