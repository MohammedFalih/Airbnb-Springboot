package fr.airbnb.airbnb_backend.user.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import fr.airbnb.airbnb_backend.sharedkernal.domain.AbstractAuditingEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "airbnb_user")
public class User extends AbstractAuditingEntity<Long> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userSequenceGenerator")
    @SequenceGenerator(name = "userSequenceGenerator", sequenceName = "user_generator", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "public_id", nullable = false)
    private UUID publicId;

    @ManyToMany
    @JoinTable(name = "user_authority", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "id") }, inverseJoinColumns = {
                    @JoinColumn(name = "authority_name", referencedColumnName = "name") })
    private Set<Authority> authorities = new HashSet<>();

    @Override
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImage_url() {
        return this.imageUrl;
    }

    public void setImage_url(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public UUID getPublicId() {
        return this.publicId;
    }

    public void setPublicId(UUID publicId) {
        this.publicId = publicId;
    }

    public Set<Authority> getAuthorities() {
        return this.authorities;
    }

    public void setAuthorities(Set<Authority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        User user = (User) o;
        return Objects.equals(lastName, user.lastName) && Objects.equals(firstName, user.firstName)
                && Objects.equals(email, user.email) && Objects.equals(imageUrl, user.imageUrl)
                && Objects.equals(publicId, user.publicId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(lastName, firstName, email, imageUrl, publicId);
    }

    @Override
    public String toString() {
        return "User{" +
                "lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", email='" + email + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", publicId=" + publicId +
                '}';
    }

}
