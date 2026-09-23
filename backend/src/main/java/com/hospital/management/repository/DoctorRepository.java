package com.hospital.management.repository;

import com.hospital.management.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findBySpecializationId(Long specializationId);

    // Self-Join JOIN FETCH query to fetch Doctor along with their Supervisor (which is also a Doctor in the same doctors table)
    @Query("SELECT d FROM Doctor d " +
           "JOIN FETCH d.user " +
           "JOIN FETCH d.specialization " +
           "LEFT JOIN FETCH d.supervisor s " +
           "LEFT JOIN FETCH s.user")
    List<Doctor> findAllWithSupervisorJoinFetch();
}

