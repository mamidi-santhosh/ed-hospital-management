package com.hospital.management.service;

import com.hospital.management.dto.SpecializationDTO;
import com.hospital.management.model.Specialization;
import com.hospital.management.repository.SpecializationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecializationService {

    @Autowired
    private SpecializationRepository specializationRepository;

    public List<SpecializationDTO> getAllSpecializations() {
        return specializationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SpecializationDTO getSpecializationById(Long id) {
        Specialization spec = specializationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialization not found with id: " + id));
        return mapToDTO(spec);
    }

    public SpecializationDTO createSpecialization(SpecializationDTO dto) {
        Specialization spec = new Specialization(dto.getName(), dto.getDescription(), dto.getIconName());
        Specialization saved = specializationRepository.save(spec);
        return mapToDTO(saved);
    }

    public SpecializationDTO updateSpecialization(Long id, SpecializationDTO dto) {
        Specialization spec = specializationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialization not found with id: " + id));
        spec.setName(dto.getName());
        spec.setDescription(dto.getDescription());
        spec.setIconName(dto.getIconName());
        return mapToDTO(specializationRepository.save(spec));
    }

    public void deleteSpecialization(Long id) {
        specializationRepository.deleteById(id);
    }

    public SpecializationDTO mapToDTO(Specialization spec) {
        return new SpecializationDTO(spec.getId(), spec.getName(), spec.getDescription(), spec.getIconName());
    }
}
