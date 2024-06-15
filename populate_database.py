import random
import re
import string
from datetime import datetime

import mysql.connector
from faker import Faker

fake = Faker('pt_BR')

data_inicial = datetime(2023, 1, 1)
data_final = datetime(2024, 6, 1)

projetointegradorpopulado = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    port=3306,
    database="projetointegrador"
)


# Gerar um código aleatório de 50 dígitos
def generate_code(length=50):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))


# Gerar times
def generate_teams():
    for i in range(1, 101):
        code = generate_code()
        name = fake.company()
        my_cursor.execute("INSERT INTO team(id, code, name) VALUES(%s, %s, %s)",
                          (i, code, name))


def generate_phone_number():
    # DDD é um número entre 11 e 99 (código de área do Brasil)
    ddd = random.randint(11, 99)

    # Gera os 9 dígitos restantes
    numero = ''.join(random.choices('0123456789', k=9))

    # Junta o DDD, o nono dígito (se aplicável) e o número
    telefone = f"{ddd}{numero[:5]}{numero[5:]}"
    return telefone


# Gerar endereços
def generate_client_and_address():
    for i in range(1, 1001):
        street = fake.street_name()
        zip_code = re.sub(r'\D', '', fake.postcode())
        number = fake.building_number()
        city_id = random.randint(1, 5595)
        my_cursor.execute("INSERT INTO address(id, street, zip_code, number, city_id) VALUES(%s, %s, %s, %s, %s)",
                          (i, street, zip_code, number, city_id))

        cellphone = generate_phone_number()

        if random.choice([True, False]):
            cnpj = re.sub(r'\D', '', fake.cnpj())
            cpf = None
            name = fake.company()
        else:
            cnpj = None
            cpf = re.sub(r'\D', '', fake.cpf())
            name = fake.name()

        email = fake.email()
        inactive = 0
        telephone = generate_phone_number()
        whatsapp = generate_phone_number()
        team_id = random.randint(1, 100)
        my_cursor.execute("INSERT INTO client(id, cellphone, cnpj, cpf, email, inactive, name, telephone, whatsapp, "
                          "address_id, team_id) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                          (i, cellphone, cnpj, cpf, email, inactive, name, telephone, whatsapp, i, team_id))


# Gerar propostas
def generate_proposals():

    for i in range(1, 1001):
        description = fake.text()
        inactive = 0

        offer_date = fake.date_between_dates(data_inicial, data_final)

        service_type = random.randint(1, 3)
        status = random.randint(1, 4)
        value = round(random.uniform(100.0, 10000.0), 2)
        client_id = random.randint(1, 1000)
        my_cursor.execute(
            "INSERT INTO proposal(id, description, inactive, offer_date, service_type, status, value, client_id) "
            "VALUES(%s, %s, %s, %s, %s, %s, %s, %s)",
            (i, description, inactive, offer_date, service_type, status, value, client_id))


# Gerar propostas
def generate_interactions():
    for i in range(1, 10001):
        contact = random.randint(1, 3)
        date = fake.date_between_dates(data_inicial, data_final)
        description = fake.text()

        duration_hours = random.randint(0, 1)
        duration_minutes = random.randint(0, 59)
        duration = f"{duration_hours:02}:{duration_minutes:02}"

        time_hour = random.randint(8, 18)
        time_minute = random.randint(0, 59)
        time = f"{time_hour:02}:{time_minute:02}"

        inactive = 0
        result = random.randint(1, 4)
        proposal_id = random.randint(1, 1000)
        my_cursor.execute(
            "INSERT INTO interaction(id, contact, date, description, duration, inactive, result, time, proposal_id) "
            "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (i, contact, date, description, duration, inactive, result, time, proposal_id))


my_cursor = projetointegradorpopulado.cursor()

# Times
generate_teams()
print("Inserção de times concluída.")

# Clientes e endereços
generate_client_and_address()
print("Inserção de clientes/endereços concluída.")

# Propostas
generate_proposals()
print("Inserção de propostas concluída.")

# Interações
generate_interactions()
print("Inserção de interações concluída.")

projetointegradorpopulado.commit()
projetointegradorpopulado.close()
