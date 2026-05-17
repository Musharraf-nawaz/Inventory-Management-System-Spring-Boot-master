package com.example.service;

import com.example.entity.Stock;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.StockRepository;
import com.example.util.AuditHelper;
import com.example.util.EntityAudit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public Stock insert(Stock stock) {
        Date now = AuditHelper.now();
        if (stock.getCreatedDateTime() == null) {
            stock.setCreatedDateTime(now);
        }
        EntityAudit.stampCreate(stock::setCreatedUser, stock::setCreatedDateTime, stock::setVersion,
                stock.getCreatedUser(), now);
        return stockRepository.save(stock);
    }

    @Transactional(readOnly = true)
    public Stock findById(int id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Stock> findAll() {
        return (List<Stock>) stockRepository.findAll();
    }

    public Stock updateStock(Stock stock) {
        findById(stock.getRefId());
        Date now = AuditHelper.now();
        EntityAudit.stampUpdate(stock::setLastModifiedUser, stock::setLastModifiedDateTime,
                stock.getLastModifiedUser(), now);
        return stockRepository.save(stock);
    }

    public void deleteStock(Stock stock) {
        stockRepository.delete(stock);
    }
}
