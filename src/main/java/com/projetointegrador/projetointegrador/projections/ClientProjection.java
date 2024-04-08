package com.projetointegrador.projetointegrador.projections;

public interface ClientProjection {
    Long getId();

    String getName();

    String getCompany();

    String getCpf();

    String getCnpj();

    String getStreet();

    Integer getNumber();

    String getZip_code();

    Long getCity_id();

    String getCity_name();

    Long getState_id();

    String getState_name();

}
