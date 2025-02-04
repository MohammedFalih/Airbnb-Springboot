package fr.codecake.airbnb_clone_back.listing.presentation;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fasterxml.jackson.databind.ObjectMapper;

import fr.codecake.airbnb_clone_back.listing.application.LandlordService;
import fr.codecake.airbnb_clone_back.listing.application.dto.CreatedListingDTO;
import fr.codecake.airbnb_clone_back.listing.application.dto.SaveListingDTO;
import fr.codecake.airbnb_clone_back.listing.application.dto.sub.PictureDTO;
import fr.codecake.airbnb_clone_back.user.application.UserException;
import fr.codecake.airbnb_clone_back.user.application.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

@RestController
@RequestMapping("/api/landlord-listing")
public class LandlordResource {

    private final LandlordService landlordService;

    private final UserService userService;

    private final Validator validator;

    private ObjectMapper objectMapper = new ObjectMapper();

    public LandlordResource(LandlordService landlordService, UserService userService, Validator validator) {
        this.landlordService = landlordService;
        this.userService = userService;
        this.validator = validator;
    }

    public ResponseEntity<CreatedListingDTO> create(
            MultipartHttpServletRequest request,
            @RequestPart(name = "dto") String saveListingDTOString) throws IOException {
        List<PictureDTO> pictures = request.getFileMap().values().stream()
                .map(mapMultipartFileToPictureDTO()).toList();

        SaveListingDTO saveListingDTO = objectMapper.readValue(saveListingDTOString, SaveListingDTO.class);
        saveListingDTO.setPictures(pictures);

        Set<ConstraintViolation<SaveListingDTO>> violations = validator.validate(saveListingDTO);
        if (!violations.isEmpty()) {
            String violationsJoined = violations.stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());

            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, violationsJoined);
            return ResponseEntity.of(problemDetail).build();
        } else {
            return ResponseEntity.ok(landlordService.create(saveListingDTO));
        }
    }

    public static Function<MultipartFile, PictureDTO> mapMultipartFileToPictureDTO() {
        return multipartFile -> {
            try {
                return new PictureDTO(multipartFile.getBytes(), multipartFile.getContentType(), false);
            } catch (IOException e) {
                throw new UserException(
                        String.format("Cannot parse multipart file: %s", multipartFile.getOriginalFilename()));
            }
        };
    }

}
