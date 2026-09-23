package com.hospital.management.controller;

import com.hospital.management.config.UserDetailsImpl;
import com.hospital.management.dto.AppointmentDTO;
import com.hospital.management.model.AppointmentStatus;
import com.hospital.management.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT')")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isDoctor = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_DOCTOR"));
        boolean isPatient = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));

        if (isAdmin) {
            return ResponseEntity.ok(appointmentService.getAllAppointments());
        } else if (isDoctor) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorUserId(userDetails.getId()));
        } else if (isPatient) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByPatientUserId(userDetails.getId()));
        }

        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/fetch-all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT')")
    public ResponseEntity<List<AppointmentDTO>> getAllAppointmentsJoinFetch() {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsWithJoinFetch());
    }

    @GetMapping("/{id}/fetch")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT')")
    public ResponseEntity<AppointmentDTO> getAppointmentByIdJoinFetch(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentByIdWithJoinFetch(id));
    }


    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PATIENT')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByPatient(
            @PathVariable Long patientId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            // For patients, strictly enforce returning only their own appointments
            return ResponseEntity.ok(appointmentService.getAppointmentsByPatientUserId(userDetails.getId()));
        }

        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctor(
            @PathVariable Long doctorId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorUserId(userDetails.getId()));
        }

        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PATIENT')")
    public ResponseEntity<AppointmentDTO> bookAppointment(@RequestBody AppointmentDTO dto) {
        return ResponseEntity.ok(appointmentService.bookAppointment(dto));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT')")
    public ResponseEntity<AppointmentDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        AppointmentStatus status = AppointmentStatus.valueOf(body.get("status"));
        String notes = body.get("notes");
        return ResponseEntity.ok(appointmentService.updateStatus(id, status, notes));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PATIENT')")
    public ResponseEntity<AppointmentDTO> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, AppointmentStatus.CANCELLED, "Cancelled by user"));
    }
}
