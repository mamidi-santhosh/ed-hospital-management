package com.hospital.management.config;

import com.hospital.management.model.*;
import com.hospital.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println("--- Seeding Initial Hospital Management Data ---");

        // 1. Create Admin
        User adminUser = new User("System Admin", "admin@hospital.com", passwordEncoder.encode("admin123"), "9876543210", Role.ROLE_ADMIN);
        userRepository.save(adminUser);

        // 2. Create Specializations
        Specialization cardiology = specializationRepository.save(new Specialization("Cardiology", "Heart and cardiovascular system care", "Heart"));
        Specialization neurology = specializationRepository.save(new Specialization("Neurology", "Brain and nervous system disorders", "Brain"));
        Specialization pediatrics = specializationRepository.save(new Specialization("Pediatrics", "Infant, child, and adolescent medical care", "Baby"));
        Specialization orthopedics = specializationRepository.save(new Specialization("Orthopedics", "Bone, joint, and muscle treatments", "Bone"));
        Specialization genMedicine = specializationRepository.save(new Specialization("General Medicine", "Primary healthcare and diagnostic treatments", "Stethoscope"));
        Specialization dermatology = specializationRepository.save(new Specialization("Dermatology", "Skin, hair, and nail health", "Sun"));

        // 3. Create Doctors
        Doctor drPriya = createDoctor("Priya Sharma", "dr.priya@hospital.com", "9876543211", cardiology, "MBBS, MD (Cardiology)", 12, 800.0, "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150");
        Doctor drKumar = createDoctor("Kumar Swamy", "dr.kumar@hospital.com", "9876543212", neurology, "MBBS, DM (Neurology)", 15, 1000.0, "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150");
        Doctor drNikhil = createDoctor("Nikhil Verma", "dr.nikhil@hospital.com", "9876543213", pediatrics, "MBBS, MD (Pediatrics)", 8, 600.0, "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150");
        Doctor drSarah = createDoctor("Sarah Jenkins", "dr.sarah@hospital.com", "9876543214", orthopedics, "MBBS, MS (Orthopedics)", 10, 750.0, "https://images.unsplash.com/photo-1594824813566-78a9364f7b60?w=150");
        Doctor drRajesh = createDoctor("Rajesh Gupta", "dr.rajesh@hospital.com", "9876543215", genMedicine, "MBBS, MD", 14, 500.0, "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150");

        // 4. Create Patients
        Patient rahul = createPatient("Rahul Sharma", "rahul@gmail.com", "9123456780", 28, "Male", "B+", "Mumbai, India");
        Patient sneha = createPatient("Sneha Reddy", "sneha@gmail.com", "9123456781", 25, "Female", "A+", "Hyderabad, India");
        Patient amit = createPatient("Amit Verma", "amit@gmail.com", "9123456782", 34, "Male", "O+", "Delhi, India");
        Patient pooja = createPatient("Pooja Patel", "pooja@gmail.com", "9123456783", 31, "Female", "AB+", "Ahmedabad, India");
        Patient vikram = createPatient("Vikram Singh", "vikram@gmail.com", "9123456784", 45, "Male", "O-", "Bangalore, India");

        // 5. Create Appointments matching screenshot
        appointmentRepository.save(new Appointment(rahul, drPriya, LocalDate.now(), "10:00 AM", "Routine Cardiac Checkup", AppointmentStatus.CONFIRMED));
        appointmentRepository.save(new Appointment(sneha, drKumar, LocalDate.now(), "03:30 PM", "Migraine Consultation", AppointmentStatus.PENDING));
        appointmentRepository.save(new Appointment(amit, drNikhil, LocalDate.now().plusDays(1), "09:00 AM", "Child Vaccination", AppointmentStatus.CONFIRMED));
        appointmentRepository.save(new Appointment(pooja, drSarah, LocalDate.now().plusDays(2), "11:30 AM", "Knee Joint Pain", AppointmentStatus.PENDING));
        appointmentRepository.save(new Appointment(vikram, drRajesh, LocalDate.now().plusDays(3), "02:00 PM", "Annual Health Checkup", AppointmentStatus.CONFIRMED));

        System.out.println("--- Hospital Data Initialized Successfully! ---");
    }

    private Doctor createDoctor(String name, String email, String phone, Specialization spec, String qual, int exp, double fee, String avatar) {
        User user = userRepository.save(new User(name, email, passwordEncoder.encode("doctor123"), phone, Role.ROLE_DOCTOR));
        return doctorRepository.save(new Doctor(user, spec, qual, exp, fee, "Mon-Fri", "09:00 AM - 05:00 PM", avatar));
    }

    private Patient createPatient(String name, String email, String phone, int age, String gender, String blood, String addr) {
        User user = userRepository.save(new User(name, email, passwordEncoder.encode("patient123"), phone, Role.ROLE_PATIENT));
        return patientRepository.save(new Patient(user, age, gender, blood, addr, phone));
    }
}
