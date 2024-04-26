package com.projetointegrador.projetointegrador.services;

import com.projetointegrador.projetointegrador.models.Address;
import com.projetointegrador.projetointegrador.repositories.AddressRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
public class AddressServiceTests {

    private final AddressRepository addressRepository = mock(AddressRepository.class);
    private final AddressService addressService = new AddressService(addressRepository);

    @Test
    public void testFindOneAddress() {
        Address address = new Address();
        address.setId(1L);
        when(addressRepository.findById(1L)).thenReturn(Optional.of(address));

        ResponseEntity<?> responseEntity = addressService.findOneAddress(1L);

        Optional<Address> optionalAddress = (Optional<Address>) responseEntity.getBody();
        assert optionalAddress != null;
        Address actualAddress = optionalAddress.orElse(null);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(address, actualAddress);
        System.out.println("Expected address: " + address);
        System.out.println("Actual address: " + actualAddress);
    }
}
