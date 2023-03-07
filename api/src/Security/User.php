<?php
namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;

final class User implements JWTUserInterface {
    // Your own logic
	private string $username;
	private array $roles = [];
	private string $email;

    public function __construct($username, array $roles, $email) {
        $this->username = $username;
        $this->roles = $roles;
        $this->email = $email;
    }

    public static function createFromPayload($username, array $payload) {
        return new self(
            $username,
            $payload['roles'], // Added by default
            $payload['email']  // Custom
        );
    }
	/**
	 * Returns the roles granted to the user.
	 *
	 * public function getRoles()
	 * {
	 * return ['ROLE_USER'];
	 * }
	 *
	 * Alternatively, the roles might be stored in a ``roles`` property,
	 * and populated in any number of different ways when the user object
	 * is created.
	 * @return array<string>
	 */
	public function getRoles(): array {
		if (!$this->roles) {
			return [];
		}
		return $this->roles;
	}
	
	/**
	 * Removes sensitive data from the user.
	 *
	 * This is important if, at any given point, sensitive information like
	 * the plain-text password is stored on this object.
	 * @return mixed
	 */
	public function eraseCredentials() {
	}
	
	/**
	 * Returns the identifier for this user (e.g. username or email address).
	 * @return string
	 */
	public function getUserIdentifier(): string {
		if (!$this->username) {
			return '';
		}
		return $this->username;
	}

	/**
	 * @return string
	 */
	public function getEmail(): string{
		if (!$this->email) {
			return '';
		}
		return $this->email;
	}
}