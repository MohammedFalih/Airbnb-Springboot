package fr.airbnb.airbnb_backend.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories({
                "fr.airbnb.airbnb_backend.user.repository",
                "fr.airbnb.airbnb_backend.listing.repository",
                "fr.airbnb.airbnb_backend.booking.repository" })
@EnableTransactionManagement
@EnableJpaAuditing
public class DatabaseConfiguration {

}
