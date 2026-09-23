package com.hospital.management.repository;

import com.hospital.management.model.Appointment;
import com.hospital.management.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByPatientUserId(Long userId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByDoctorUserId(Long userId);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);
    long countByAppointmentDate(LocalDate date);

    // JOIN FETCH to retrieve data from all 3 tables (Appointment bridge table, Doctor table, Patient table) in 1 single SQL query
    @Query("SELECT a FROM Appointment a JOIN FETCH a.doctor d JOIN FETCH d.user JOIN FETCH d.specialization JOIN FETCH a.patient p JOIN FETCH p.user")
    List<Appointment> findAllWithJoinFetch();

    @Query("SELECT a FROM Appointment a JOIN FETCH a.doctor d JOIN FETCH d.user JOIN FETCH d.specialization JOIN FETCH a.patient p JOIN FETCH p.user WHERE a.id = :id")
    Optional<Appointment> findByIdWithJoinFetch(@Param("id") Long id);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.doctor d JOIN FETCH d.user du JOIN FETCH d.specialization JOIN FETCH a.patient p JOIN FETCH p.user WHERE du.id = :userId")
    List<Appointment> findByDoctorUserIdWithJoinFetch(@Param("userId") Long userId);
}


