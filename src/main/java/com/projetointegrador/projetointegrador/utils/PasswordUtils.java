package com.projetointegrador.projetointegrador.utils;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class PasswordUtils {
    public static String encryptPassword(String password) {
        try {
            // Criar uma instância do algoritmo de hash SHA-256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Calcular o hash da senha
            byte[] hashBytes = digest.digest(password.getBytes());

            // Converter o hash em uma representação legível
            String hashedPassword = Base64.getEncoder().encodeToString(hashBytes);

            return hashedPassword;
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            // Em caso de erro, retorna null ou lança uma exceção, dependendo do seu caso
            return null;
        }
    }

    public static boolean verifyPassword(String password, String hashedPassword) {
        try {
            // Criar uma instância do algoritmo de hash SHA-256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Calcular o hash da senha fornecida
            byte[] hashBytes = digest.digest(password.getBytes());

            // Converter o hash em uma representação legível
            String hashedInputPassword = Base64.getEncoder().encodeToString(hashBytes);
            // Comparar o hash da senha fornecida com o hash armazenado
            return hashedInputPassword.equals(hashedPassword);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            // Em caso de erro, você pode lidar com isso de acordo com suas necessidades
            return false;
        }
    }

}
