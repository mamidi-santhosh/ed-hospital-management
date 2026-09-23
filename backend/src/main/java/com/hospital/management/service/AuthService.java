package com.hospital.management.service;

import com.hospital.management.config.JwtUtils;
import com.hospital.management.config.UserDetailsImpl;
import com.hospital.management.dto.AuthDTOs;
import com.hospital.management.model.Patient;
import com.hospital.management.model.Role;
import com.hospital.management.model.User;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthDTOs.JwtResponse authenticateUser(AuthDTOs.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new AuthDTOs.JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail(),
                role);
    }

    @Transactional
    public User registerUser(AuthDTOs.SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Role role = signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.ROLE_PATIENT;

        User user = new User(
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getPhone(),
                role
        );

        User savedUser = userRepository.save(user);

        // If user is PATIENT, create Patient profile
        if (role == Role.ROLE_PATIENT) {
            Patient patient = new Patient(
                    savedUser,
                    signUpRequest.getAge() != null ? signUpRequest.getAge() : 30,
                    signUpRequest.getGender() != null ? signUpRequest.getGender() : "Not specified",
                    signUpRequest.getBloodGroup() != null ? signUpRequest.getBloodGroup() : "O+",
                    signUpRequest.getAddress() != null ? signUpRequest.getAddress() : "",
                    signUpRequest.getPhone()
            );
            patientRepository.save(patient);
        }

        return savedUser;
    }
}
