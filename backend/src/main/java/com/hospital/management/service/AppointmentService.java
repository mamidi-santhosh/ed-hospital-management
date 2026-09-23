package com.hospital.management.service;

import com.hospital.management.dto.AppointmentDTO;
import com.hospital.management.model.*;
import com.hospital.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAllAppointmentsWithJoinFetch() {
        return appointmentRepository.findAllWithJoinFetch().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public AppointmentDTO getAppointmentByIdWithJoinFetch(Long id) {
        Appointment appt = appointmentRepository.findByIdWithJoinFetch(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        return mapToDTO(appt);
    }


    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByPatientUserId(Long userId) {
        return appointmentRepository.findByPatientUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByDoctorUserId(Long userId) {
        return appointmentRepository.findByDoctorUserIdWithJoinFetch(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return mapToDTO(appt);
    }

    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO dto) {
        Patient patient;
        if (dto.getPatientId() != null) {
            patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found with id: " + dto.getPatientId()));
        } else {
            throw new RuntimeException("Patient ID is required for booking");
        }

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + dto.getDoctorId()));

        Appointment appointment = new Appointment(
                patient,
                doctor,
                dto.getAppointmentDate() != null ? dto.getAppointmentDate() : LocalDate.now().plusDays(1),
                dto.getTimeSlot() != null ? dto.getTimeSlot() : "10:00 AM",
                dto.getReason() != null ? dto.getReason() : "General Consultation",
                AppointmentStatus.PENDING
        );

        Appointment saved = appointmentRepository.save(appointment);
        return mapToDTO(saved);
    }

    @Transactional
    public AppointmentDTO updateStatus(Long id, AppointmentStatus status, String notes) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        if (notes != null) {
            appointment.setNotes(notes);
        }

        Appointment updated = appointmentRepository.save(appointment);
        return mapToDTO(updated);
    }

    public void cancelAppointment(Long id) {
        updateStatus(id, AppointmentStatus.CANCELLED, "Cancelled by user");
    }

    public AppointmentDTO mapToDTO(Appointment appt) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appt.getId());
        dto.setPatientId(appt.getPatient().getId());
        dto.setPatientName(appt.getPatient().getUser().getName());
        dto.setDoctorId(appt.getDoctor().getId());
        dto.setDoctorName("Dr. " + appt.getDoctor().getUser().getName());
        dto.setSpecializationName(appt.getDoctor().getSpecialization().getName());
        dto.setAppointmentDate(appt.getAppointmentDate());
        dto.setTimeSlot(appt.getTimeSlot());
        dto.setReason(appt.getReason());
        dto.setStatus(appt.getStatus());
        dto.setNotes(appt.getNotes());
        return dto;
    }
}
