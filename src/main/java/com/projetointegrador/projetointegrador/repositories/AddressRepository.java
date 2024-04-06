package com.projetointegrador.projetointegrador.repositories;

import com.projetointegrador.projetointegrador.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
