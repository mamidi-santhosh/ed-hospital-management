package com.hospital.management.controller;

import com.hospital.management.dto.DoctorDTO;
import com.hospital.management.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/specialization/{specId}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(@PathVariable Long specId) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specId));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<DoctorDTO> createDoctor(@RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(doctorService.createDoctor(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, dto));
    }

    @GetMapping("/with-supervisors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctorsWithSupervisor() {
        return ResponseEntity.ok(doctorService.getAllDoctorsWithSupervisorJoinFetch());
    }

    @PutMapping("/{id}/assign-supervisor/{supervisorId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<DoctorDTO> assignSupervisor(
            @PathVariable Long id,
            @PathVariable Long supervisorId) {
        return ResponseEntity.ok(doctorService.assignSupervisor(id, supervisorId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }
}

