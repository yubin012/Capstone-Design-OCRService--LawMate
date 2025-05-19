package com.lawmate.lawmate.Repository;

import com.lawmate.lawmate.Domain.Mypage;
import com.lawmate.lawmate.Domain.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MypageRepository extends JpaRepository<Mypage, Long> {
    Optional<Mypage> findByUser(User user);
}