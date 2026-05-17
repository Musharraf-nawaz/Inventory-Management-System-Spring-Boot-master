package com.example.service;

import com.example.entity.Supplier;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.SupplierRepository;
import com.example.util.AuditHelper;
import com.example.util.EntityAudit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public Supplier insert(Supplier supplier) {
        Date now = AuditHelper.now();
        if (supplier.getCreatedDateTime() == null) {
            supplier.setCreatedDateTime(now);
        }
        EntityAudit.stampCreate(supplier::setCreatedUser, supplier::setCreatedDateTime, supplier::setVersion,
                supplier.getCreatedUser(), now);
        return supplierRepository.save(supplier);
    }

    @Transactional(readOnly = true)
    public Supplier findById(int id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Supplier> findAll() {
        return (List<Supplier>) supplierRepository.findAll();
    }

    public Supplier updateSupplier(Supplier supplier) {
        findById(supplier.getSupplierId());
        Date now = AuditHelper.now();
        EntityAudit.stampUpdate(supplier::setLastModifiedUser, supplier::setLastModifiedDateTime,
                supplier.getLastModifiedUser(), now);
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Supplier supplier) {
        supplierRepository.delete(supplier);
    }
}
