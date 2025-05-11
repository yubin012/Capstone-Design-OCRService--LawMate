package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//이메일로 사용자 조회 
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}