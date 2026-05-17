package com.example.controller;

import com.example.entity.Pricing;
import com.example.entity.TheLogConverter;
import com.example.service.PricingLogService;
import com.example.service.PricingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pricings")
public class PricingController {

    private final PricingService pricingService;
    private final PricingLogService pricingLogService;

    public PricingController(PricingService pricingService, PricingLogService pricingLogService) {
        this.pricingService = pricingService;
        this.pricingLogService = pricingLogService;
    }

    @GetMapping
    public List<Pricing> getAllPricing() {
        return pricingService.findAll();
    }

    @GetMapping("/{id}")
    public Pricing getPricing(@PathVariable int id) {
        return pricingService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Pricing> addPricing(@RequestBody Pricing pricing) {
        Pricing saved = pricingService.insert(pricing);
        pricingLogService.insert(TheLogConverter.pricingLogLogConverter(saved));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Pricing updatePricing(@PathVariable int id, @RequestBody Pricing pricing) {
        pricing.setPricingId(id);
        Pricing updated = pricingService.updatePricing(pricing);
        pricingLogService.insert(TheLogConverter.pricingLogLogConverter(updated));
        return updated;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePricing(@PathVariable int id) {
        Pricing pricing = pricingService.findById(id);
        pricingService.deletePricing(pricing);
        pricingLogService.insert(TheLogConverter.pricingLogLogConverter(pricing));
    }
}
