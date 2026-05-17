package com.example.service;

import com.example.entity.Category;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.CategoryRepository;
import com.example.util.AuditHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category insert(Category category) {
        applyCreateAudit(category);
        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public Category findById(int id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return (List<Category>) categoryRepository.findAll();
    }

    public Category updateCategory(Category category) {
        findById(category.getCategoryId());
        applyUpdateAudit(category);
        return categoryRepository.save(category);
    }

    public void deleteCategory(Category category) {
        categoryRepository.delete(category);
    }

    private void applyCreateAudit(Category category) {
        Date now = AuditHelper.now();
        if (category.getCreatedDateTime() == null) {
            category.setCreatedDateTime(now);
        }
        category.setCreatedUser(AuditHelper.actor(category.getCreatedUser()));
        if (category.getVersion() == null) {
            category.setVersion(AuditHelper.initialVersion());
        }
    }

    private void applyUpdateAudit(Category category) {
        category.setLastModifiedDateTime(AuditHelper.now());
        category.setLastModifiedUser(AuditHelper.actor(category.getLastModifiedUser()));
    }
}
