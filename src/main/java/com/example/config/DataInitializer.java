package com.example.config;

import com.example.entity.Role;
import com.example.entity.User;
import com.example.entity.UserRole;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;
import com.example.util.AuditHelper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Date;

@Configuration
@Profile("!test")
public class DataInitializer {

    @Bean
    CommandLineRunner seedAdminUser(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUserName("admin").isPresent()) {
                return;
            }

            Role adminRole = roleRepository.findByRoleName("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ADMIN role missing; run Flyway migrations"));

            Date now = AuditHelper.now();
            User admin = new User();
            admin.setUserName("admin");
            admin.setUserFname("System");
            admin.setUserLname("Administrator");
            admin.setUserEmail("admin@inventory.local");
            admin.setUserAddress("N/A");
            admin.setUserContactNumber(new BigDecimal("10000000000"));
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setCreatedUser("system");
            admin.setCreatedDateTime(now);
            admin.setVersion(AuditHelper.initialVersion());
            admin = userRepository.save(admin);

            UserRole userRole = new UserRole();
            userRole.setUser(admin);
            userRole.setRole(adminRole);
            admin.addUserRole(userRole);
            userRepository.save(admin);
        };
    }
}
