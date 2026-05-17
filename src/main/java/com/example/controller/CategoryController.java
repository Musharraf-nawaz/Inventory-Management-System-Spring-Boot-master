package com.example.controller;

import com.example.entity.Category;
import com.example.entity.TheLogConverter;
import com.example.service.CategoryLogService;
import com.example.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryLogService categoryLogService;

    public CategoryController(CategoryService categoryService, CategoryLogService categoryLogService) {
        this.categoryService = categoryService;
        this.categoryLogService = categoryLogService;
    }

    @GetMapping
    public List<Category> getAllCategory() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public Category getCategory(@PathVariable int id) {
        return categoryService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        Category saved = categoryService.insert(category);
        categoryLogService.insert(TheLogConverter.categoryLogConverter(saved));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable int id, @RequestBody Category category) {
        category.setCategoryId(id);
        Category updated = categoryService.updateCategory(category);
        categoryLogService.insert(TheLogConverter.categoryLogConverter(updated));
        return updated;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable int id) {
        Category category = categoryService.findById(id);
        categoryService.deleteCategory(category);
        categoryLogService.insert(TheLogConverter.categoryLogConverter(category));
    }
}
