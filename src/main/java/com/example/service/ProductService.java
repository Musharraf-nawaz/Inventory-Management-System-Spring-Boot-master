package com.example.service;

import com.example.entity.Product;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.ProductRepository;
import com.example.util.AuditHelper;
import com.example.util.EntityAudit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product insert(Product product) {
        Date now = AuditHelper.now();
        if (product.getCreatedDateTime() == null) {
            product.setCreatedDateTime(now);
        }
        EntityAudit.stampCreate(product::setCreatedUser, product::setCreatedDateTime, product::setVersion,
                product.getCreatedUser(), now);
        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public Product findById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Product> findAll() {
        return (List<Product>) productRepository.findAll();
    }

    public Product updateProduct(Product product) {
        findById(product.getProductId());
        Date now = AuditHelper.now();
        EntityAudit.stampUpdate(product::setLastModifiedUser, product::setLastModifiedDateTime,
                product.getLastModifiedUser(), now);
        return productRepository.save(product);
    }

    public void deleteProduct(Product product) {
        productRepository.delete(product);
    }
}
