package com.gym.member.repository;

import com.gym.member.model.GoiTap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoiTapRepository extends JpaRepository<GoiTap, Integer> {
}
