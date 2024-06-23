package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{
}
