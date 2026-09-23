package com.hospital.management.controller;

import com.hospital.management.dto.SpecializationDTO;
import com.hospital.management.service.SpecializationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/specializations")
public class SpecializationController {

    @Autowired
    private SpecializationService specializationService;

    @GetMapping
    public ResponseEntity<List<SpecializationDTO>> getAllSpecializations() {
        return ResponseEntity.ok(specializationService.getAllSpecializations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecializationDTO> getSpecializationById(@PathVariable Long id) {
        return ResponseEntity.ok(specializationService.getSpecializationById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SpecializationDTO> createSpecialization(@RequestBody SpecializationDTO dto) {
        return ResponseEntity.ok(specializationService.createSpecialization(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SpecializationDTO> updateSpecialization(@PathVariable Long id, @RequestBody SpecializationDTO dto) {
        return ResponseEntity.ok(specializationService.updateSpecialization(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteSpecialization(@PathVariable Long id) {
        specializationService.deleteSpecialization(id);
        return ResponseEntity.ok().build();
    }
}
