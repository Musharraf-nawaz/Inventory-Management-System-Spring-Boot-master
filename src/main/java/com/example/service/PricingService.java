package com.example.service;

import com.example.entity.Pricing;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.PricingRepository;
import com.example.util.AuditHelper;
import com.example.util.EntityAudit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class PricingService {

    private final PricingRepository pricingRepository;

    public PricingService(PricingRepository pricingRepository) {
        this.pricingRepository = pricingRepository;
    }

    public Pricing insert(Pricing pricing) {
        Date now = AuditHelper.now();
        if (pricing.getCreatedDateTime() == null) {
            pricing.setCreatedDateTime(now);
        }
        EntityAudit.stampCreate(pricing::setCreatedUser, pricing::setCreatedDateTime, pricing::setVersion,
                pricing.getCreatedUser(), now);
        return pricingRepository.save(pricing);
    }

    @Transactional(readOnly = true)
    public List<Pricing> findAll() {
        return (List<Pricing>) pricingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Pricing findById(int id) {
        return pricingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing not found: " + id));
    }

    public Pricing updatePricing(Pricing pricing) {
        findById(pricing.getPricingId());
        Date now = AuditHelper.now();
        EntityAudit.stampUpdate(pricing::setLastModifiedUser, pricing::setLastModifiedDateTime,
                pricing.getLastModifiedUser(), now);
        return pricingRepository.save(pricing);
    }

    public void deletePricing(Pricing pricing) {
        pricingRepository.delete(pricing);
    }
}
