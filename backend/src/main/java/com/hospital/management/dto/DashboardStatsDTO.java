package com.hospital.management.dto;

import java.util.List;

public class DashboardStatsDTO {

    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long todayAppointments;
    private long pendingAppointments;
    private List<AppointmentDTO> upcomingAppointments;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalDoctors, long totalPatients, long totalAppointments, long todayAppointments, long pendingAppointments, List<AppointmentDTO> upcomingAppointments) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.todayAppointments = todayAppointments;
        this.pendingAppointments = pendingAppointments;
        this.upcomingAppointments = upcomingAppointments;
    }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }
    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }
    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }
    public long getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; }
    public long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(long pendingAppointments) { this.pendingAppointments = pendingAppointments; }
    public List<AppointmentDTO> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<AppointmentDTO> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
}
