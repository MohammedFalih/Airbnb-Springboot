package fr.codecake.airbnb_clone_back.user.application.dto;

import java.util.Set;

public record ReadUserDTO(
        String firstName,
        String lastName,
        String email,
        String imageUrl,
        Set<String> authorities) {

}
