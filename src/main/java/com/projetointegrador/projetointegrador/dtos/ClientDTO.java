package com.projetointegrador.projetointegrador.dtos;

public class ClientDTO {
    private String name;
    private String company;
    private String cpf;
    private String cnpj;
    private String street;
    private Integer number;
    private String zip_code;
    private Long city_id;
    private Long state_id;

    public String getName() {
        return name;
    }

    public String getCompany() {
        return company;
    }

    public String getCpf() {
        return cpf;
    }

    public String getCnpj() {
        return cnpj;
    }

    public String getStreet() {
        return street;
    }

    public Integer getNumber() {
        return number;
    }

    public String getZip_code() {
        return zip_code;
    }

    public Long getCity_id() {
        return city_id;
    }
}
