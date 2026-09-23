package com.hospital.management.service;

import com.hospital.management.config.UserDetailsImpl;
import com.hospital.management.dto.AppointmentDTO;
import com.hospital.management.dto.DashboardStatsDTO;
import com.hospital.management.model.Appointment;
import com.hospital.management.model.AppointmentStatus;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    public DashboardStatsDTO getDashboardStatsForUser(UserDetailsImpl userDetails, boolean isAdmin, boolean isDoctor, boolean isPatient) {
        if (isAdmin) {
            long totalDoctors = doctorRepository.count();
            long totalPatients = patientRepository.count();
            long totalAppointments = appointmentRepository.count();
            long todayAppointments = appointmentRepository.countByAppointmentDate(LocalDate.now());
            long pendingAppointments = appointmentRepository.findByStatus(AppointmentStatus.PENDING).size();

            List<AppointmentDTO> upcoming = appointmentRepository.findAll().stream()
                    .sorted((a1, a2) -> a2.getAppointmentDate().compareTo(a1.getAppointmentDate()))
                    .limit(5)
                    .map(appointmentService::mapToDTO)
                    .collect(Collectors.toList());

            return new DashboardStatsDTO(totalDoctors, totalPatients, totalAppointments, todayAppointments, pendingAppointments, upcoming);
        } else if (isPatient) {
            Long userId = userDetails.getId();
            List<Appointment> userAppts = appointmentRepository.findByPatientUserId(userId);

            long totalDoctors = doctorRepository.count();
            long totalPatients = 1;
            long totalAppointments = userAppts.size();
            long todayAppointments = userAppts.stream().filter(a -> LocalDate.now().equals(a.getAppointmentDate())).count();
            long pendingAppointments = userAppts.stream().filter(a -> AppointmentStatus.PENDING.equals(a.getStatus())).count();

            List<AppointmentDTO> upcoming = userAppts.stream()
                    .sorted((a1, a2) -> a2.getAppointmentDate().compareTo(a1.getAppointmentDate()))
                    .limit(5)
                    .map(appointmentService::mapToDTO)
                    .collect(Collectors.toList());

            return new DashboardStatsDTO(totalDoctors, totalPatients, totalAppointments, todayAppointments, pendingAppointments, upcoming);
        } else if (isDoctor) {
            Long userId = userDetails.getId();
            List<Appointment> docAppts = appointmentRepository.findByDoctorUserId(userId);

            long totalDoctors = doctorRepository.count();
            long totalPatients = docAppts.stream().map(a -> a.getPatient().getId()).distinct().count();
            long totalAppointments = docAppts.size();
            long todayAppointments = docAppts.stream().filter(a -> LocalDate.now().equals(a.getAppointmentDate())).count();
            long pendingAppointments = docAppts.stream().filter(a -> AppointmentStatus.PENDING.equals(a.getStatus())).count();

            List<AppointmentDTO> upcoming = docAppts.stream()
                    .sorted((a1, a2) -> a2.getAppointmentDate().compareTo(a1.getAppointmentDate()))
                    .limit(5)
                    .map(appointmentService::mapToDTO)
                    .collect(Collectors.toList());

            return new DashboardStatsDTO(totalDoctors, totalPatients, totalAppointments, todayAppointments, pendingAppointments, upcoming);
        }

        return getDashboardStatsForUser(userDetails, true, false, false);
    }
}
