package com.projetointegrador.projetointegrador.repository;

import com.projetointegrador.projetointegrador.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
