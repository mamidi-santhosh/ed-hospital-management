package com.hospital.management;

import com.hospital.management.model.Role;
import com.hospital.management.model.User;
import com.hospital.management.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("h2")
@Transactional
public class AuditingIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @WithMockUser(username = "admin_user")
    @DisplayName("Should automatically populate audit fields (@CreatedDate, @CreatedBy, @LastModifiedDate, @LastModifiedBy) on entity creation")
    public void testAuditFieldsOnCreation() {
        User user = new User("John Doe", "john.audit@hospital.com", "password123", "9998887770", Role.ROLE_PATIENT);
        User savedUser = userRepository.saveAndFlush(user);

        assertNotNull(savedUser.getCreatedAt(), "createdAt should be automatically populated");
        assertNotNull(savedUser.getLastModifiedAt(), "lastModifiedAt should be automatically populated");
        assertEquals("admin_user", savedUser.getCreatedBy(), "createdBy should match current authenticated user");
        assertEquals("admin_user", savedUser.getLastModifiedBy(), "lastModifiedBy should match current authenticated user");
    }

    @Test
    @WithMockUser(username = "creator_user")
    @DisplayName("Should update @LastModifiedDate and @LastModifiedBy on entity update while preserving @CreatedDate and @CreatedBy")
    public void testAuditFieldsOnUpdate() throws InterruptedException {
        User user = new User("Jane Smith", "jane.audit@hospital.com", "password123", "9998887771", Role.ROLE_DOCTOR);
        User savedUser = userRepository.saveAndFlush(user);

        String initialCreatedBy = savedUser.getCreatedBy();
        var initialCreatedAt = savedUser.getCreatedAt();

        assertEquals("creator_user", initialCreatedBy);
        assertNotNull(initialCreatedAt);

        // Sleep briefly to ensure timestamp difference
        Thread.sleep(50);

        // Perform update under a different user context
        savedUser.setName("Jane Smith MD");
        User updatedUser = userRepository.saveAndFlush(savedUser);

        assertEquals(initialCreatedBy, updatedUser.getCreatedBy(), "createdBy must be immutable (updatable = false)");
        assertEquals(initialCreatedAt, updatedUser.getCreatedAt(), "createdAt must be immutable (updatable = false)");
        assertNotNull(updatedUser.getLastModifiedAt(), "lastModifiedAt should be updated");
        assertEquals("creator_user", updatedUser.getLastModifiedBy());
    }

    @Test
    @DisplayName("Should default createdBy to 'SYSTEM' when no security context exists")
    public void testAuditFieldsWithoutSecurityContext() {
        User user = new User("System User", "system.audit@hospital.com", "password123", "9998887772", Role.ROLE_ADMIN);
        User savedUser = userRepository.saveAndFlush(user);

        assertNotNull(savedUser.getCreatedAt());
        assertEquals("SYSTEM", savedUser.getCreatedBy(), "createdBy should fallback to SYSTEM when unauthenticated");
    }
}
