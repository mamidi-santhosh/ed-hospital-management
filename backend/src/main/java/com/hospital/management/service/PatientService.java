package com.hospital.management.service;

import com.hospital.management.dto.PatientDTO;
import com.hospital.management.model.Patient;

import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return mapToDTO(patient);
    }

    public PatientDTO getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found for user: " + userId));
        return mapToDTO(patient);
    }

    @Transactional
    public PatientDTO updatePatient(Long id, PatientDTO dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (dto.getName() != null) patient.getUser().setName(dto.getName());
        if (dto.getPhone() != null) patient.getUser().setPhone(dto.getPhone());
        if (dto.getAge() != null) patient.setAge(dto.getAge());
        if (dto.getGender() != null) patient.setGender(dto.getGender());
        if (dto.getBloodGroup() != null) patient.setBloodGroup(dto.getBloodGroup());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
        if (dto.getEmergencyContact() != null) patient.setEmergencyContact(dto.getEmergencyContact());

        userRepository.save(patient.getUser());
        Patient updated = patientRepository.save(patient);
        return mapToDTO(updated);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public PatientDTO mapToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setUserId(patient.getUser().getId());
        dto.setName(patient.getUser().getName());
        dto.setEmail(patient.getUser().getEmail());
        dto.setPhone(patient.getUser().getPhone());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setAddress(patient.getAddress());
        dto.setEmergencyContact(patient.getEmergencyContact());
        return dto;
    }
}
