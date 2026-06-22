package com.example.authbackend.infrastructure.adapter.out.persistence;

import com.example.authbackend.application.port.out.UserRepositoryPort;
import com.example.authbackend.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserPersistenceAdapter implements UserRepositoryPort {

    private final UserJpaRepository jpaRepository;

    @Autowired
    public UserPersistenceAdapter(UserJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public User save(User user) {
        UserEntity entity = UserEntity.builder()
                .id(user.getId()).username(user.getUsername()).email(user.getEmail())
                .password(user.getPassword()).role(user.getRole()).build();
        return mapToDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaRepository.findByUsername(username).map(this::mapToDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(this::mapToDomain);
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    private User mapToDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId()).username(entity.getUsername()).email(entity.getEmail())
                .password(entity.getPassword()).role(entity.getRole()).build();
    }
}
