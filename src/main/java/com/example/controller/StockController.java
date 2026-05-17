package com.example.controller;

import com.example.entity.Stock;
import com.example.entity.TheLogConverter;
import com.example.service.StockLogService;
import com.example.service.StockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stocks")
public class StockController {

    private final StockService stockService;
    private final StockLogService stockLogService;

    public StockController(StockService stockService, StockLogService stockLogService) {
        this.stockService = stockService;
        this.stockLogService = stockLogService;
    }

    @GetMapping
    public List<Stock> getAllStock() {
        return stockService.findAll();
    }

    @GetMapping("/{id}")
    public Stock getStock(@PathVariable int id) {
        return stockService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Stock> addStock(@RequestBody Stock stock) {
        Stock saved = stockService.insert(stock);
        stockLogService.insert(TheLogConverter.stockLogConverter(saved));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Stock updateStock(@PathVariable int id, @RequestBody Stock stock) {
        stock.setRefId(id);
        Stock updated = stockService.updateStock(stock);
        stockLogService.insert(TheLogConverter.stockLogConverter(updated));
        return updated;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStock(@PathVariable int id) {
        Stock stock = stockService.findById(id);
        stockService.deleteStock(stock);
        stockLogService.insert(TheLogConverter.stockLogConverter(stock));
    }
}
