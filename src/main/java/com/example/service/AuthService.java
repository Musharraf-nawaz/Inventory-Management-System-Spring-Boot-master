package com.example.service;

import com.example.dto.AuthResponse;
import com.example.dto.LoginRequest;
import com.example.dto.RegisterRequest;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.entity.UserRole;
import com.example.exception.ApiException;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;
import com.example.security.InventoryUserDetails;
import com.example.security.JwtService;
import com.example.util.AuditHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUserName(request.username())) {
            throw new ApiException("Username already exists");
        }
        if (userRepository.existsByUserEmail(request.email())) {
            throw new ApiException("Email already exists");
        }

        Role userRole = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new ApiException("Default USER role not configured"));

        Date now = AuditHelper.now();
        User user = new User();
        user.setUserName(request.username());
        user.setUserFname(request.firstName());
        user.setUserLname(request.lastName());
        user.setUserEmail(request.email());
        user.setUserAddress(request.address());
        user.setUserContactNumber(request.contactNumber());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setCreatedUser("self-registration");
        user.setCreatedDateTime(now);
        user.setVersion(AuditHelper.initialVersion());
        user = userRepository.save(user);

        UserRole link = new UserRole();
        link.setUser(user);
        link.setRole(userRole);
        user.addUserRole(link);
        userRepository.save(user);

        return login(new LoginRequest(request.username(), request.password()));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        InventoryUserDetails principal = (InventoryUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(principal);
        List<String> roles = principal.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .collect(Collectors.toList());

        return new AuthResponse(token, principal.getUsername(), roles);
    }
}
