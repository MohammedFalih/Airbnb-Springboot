package fr.airbnb.airbnb_backend.user.mapper;

import org.mapstruct.Mapper;

import fr.airbnb.airbnb_backend.user.application.dto.ReadUserDTO;
import fr.airbnb.airbnb_backend.user.domain.Authority;
import fr.airbnb.airbnb_backend.user.domain.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    ReadUserDTO readUserDTOToUser(User user);

    default String mapAuthoritiesToString(Authority authority) {
        return authority.getName();
    }
}
