package com.hospital.management.service;

import com.hospital.management.dto.DoctorDTO;
import com.hospital.management.model.Doctor;
import com.hospital.management.model.Role;
import com.hospital.management.model.Specialization;
import com.hospital.management.model.User;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.SpecializationRepository;
import com.hospital.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getDoctorsBySpecialization(Long specializationId) {
        return doctorRepository.findBySpecializationId(specializationId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doc = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        return mapToDTO(doc);
    }

    @Transactional
    public DoctorDTO createDoctor(DoctorDTO dto) {
        Specialization specialization = specializationRepository.findById(dto.getSpecializationId())
                .orElseThrow(() -> new RuntimeException("Specialization not found"));

        User user = new User(
                dto.getName(),
                dto.getEmail(),
                passwordEncoder.encode("doctor123"),
                dto.getPhone(),
                Role.ROLE_DOCTOR
        );
        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor(
                savedUser,
                specialization,
                dto.getQualification() != null ? dto.getQualification() : "MBBS, MD",
                dto.getExperienceYears() != null ? dto.getExperienceYears() : 5,
                dto.getConsultationFee() != null ? dto.getConsultationFee() : 500.0,
                dto.getAvailableDays() != null ? dto.getAvailableDays() : "Mon-Fri",
                dto.getAvailableHours() != null ? dto.getAvailableHours() : "09:00 AM - 05:00 PM",
                dto.getAvatarUrl() != null ? dto.getAvatarUrl() : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
        );

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDTO(savedDoctor);
    }

    @Transactional
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (dto.getSpecializationId() != null) {
            Specialization spec = specializationRepository.findById(dto.getSpecializationId())
                    .orElseThrow(() -> new RuntimeException("Specialization not found"));
            doctor.setSpecialization(spec);
        }

        if (dto.getName() != null) doctor.getUser().setName(dto.getName());
        if (dto.getPhone() != null) doctor.getUser().setPhone(dto.getPhone());
        if (dto.getQualification() != null) doctor.setQualification(dto.getQualification());
        if (dto.getExperienceYears() != null) doctor.setExperienceYears(dto.getExperienceYears());
        if (dto.getConsultationFee() != null) doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getAvailableDays() != null) doctor.setAvailableDays(dto.getAvailableDays());
        if (dto.getAvailableHours() != null) doctor.setAvailableHours(dto.getAvailableHours());
        if (dto.getIsAvailable() != null) doctor.setIsAvailable(dto.getIsAvailable());
        if (dto.getAvatarUrl() != null) doctor.setAvatarUrl(dto.getAvatarUrl());

        userRepository.save(doctor.getUser());
        Doctor updated = doctorRepository.save(doctor);
        return mapToDTO(updated);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public List<DoctorDTO> getAllDoctorsWithSupervisorJoinFetch() {
        return doctorRepository.findAllWithSupervisorJoinFetch().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DoctorDTO assignSupervisor(Long doctorId, Long supervisorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        Doctor supervisor = doctorRepository.findById(supervisorId)
                .orElseThrow(() -> new RuntimeException("Supervisor Doctor not found with id: " + supervisorId));

        doctor.setSupervisor(supervisor);
        Doctor updated = doctorRepository.save(doctor);
        return mapToDTO(updated);
    }

    public DoctorDTO mapToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setUserId(doctor.getUser().getId());
        dto.setName(doctor.getUser().getName());
        dto.setEmail(doctor.getUser().getEmail());
        dto.setPhone(doctor.getUser().getPhone());
        dto.setSpecializationId(doctor.getSpecialization().getId());
        dto.setSpecializationName(doctor.getSpecialization().getName());
        dto.setQualification(doctor.getQualification());
        dto.setExperienceYears(doctor.getExperienceYears());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setAvailableDays(doctor.getAvailableDays());
        dto.setAvailableHours(doctor.getAvailableHours());
        dto.setIsAvailable(doctor.getIsAvailable());
        dto.setAvatarUrl(doctor.getAvatarUrl());

        if (doctor.getSupervisor() != null) {
            dto.setSupervisorId(doctor.getSupervisor().getId());
            dto.setSupervisorName("Dr. " + doctor.getSupervisor().getUser().getName());
        }

        return dto;
    }

}
