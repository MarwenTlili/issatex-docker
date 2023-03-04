<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\State\UserPasswordHasher;
use Symfony\Component\Uid\Ulid;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(processor: UserPasswordHasher::class, validationContext: ['groups' => ['Default', 'user:create']]),
        new Get(),
        new Put(processor: UserPasswordHasher::class),
        // new Put(false), // or remove this line to disable PUT request
        new Patch(processor: UserPasswordHasher::class),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:create', 'user:update']],
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
	#[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
	#[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

	#[Assert\NotBlank(groups: ['user:create'])]
    #[Assert\Email]
    #[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

	#[Assert\NotBlank(groups: ['user:create'])]
	#[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(length: 180, unique: true)]
	private ?string $username = null;

	#[Groups(['user:read', 'user:create', 'user:update'])]
    #[ORM\Column(type: 'json')]
    private array $roles = [];

	#[Groups(['user:read', 'user:create', 'user:update'])]
	#[ORM\Column(length:180, unique: true, nullable: true)]
	private ?string $avatar = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

	#[Assert\NotBlank(groups: ['user:create'])]
	#[Groups(['user:create', 'user:update'])]
	private ?string $plainPassword = null;

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        if (empty($roles)) {
			$roles[] = 'ROLE_USER';
		}

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
		if (empty($roles)) {
			$roles[] = ['ROLE_USER'];
		}
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }
	
	/**
	 * @return string|null
	 */
	public function getPlainPassword(): ?string {
		return $this->plainPassword;
	}
	
	/**
	 * @param string|null $plainPassword 
	 * @return self
	 */
	public function setPlainPassword(?string $plainPassword): self {
		$this->plainPassword = $plainPassword;
		return $this;
	}

	/**
	 * @return string|null
	 */
	public function getUsername(): ?string {
		return $this->username;
	}
	
	/**
	 * @param string|null $username 
	 * @return self
	 */
	public function setUsername(?string $username): self {
		$this->username = $username;
		return $this;
	}

	/**
	 * @return string|null
	 */
	public function getAvatar(): ?string {
		return $this->avatar;
	}
	
	/**
	 * @param string|null $avatar 
	 * @return self
	 */
	public function setAvatar(?string $avatar): self {
		$this->avatar = $avatar;
		return $this;
	}
}
