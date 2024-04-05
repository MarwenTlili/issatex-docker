<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EmployeeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;

#[ORM\Entity(repositoryClass: EmployeeRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'firstName' => 'ipartial',
        'lastName' => 'ipartial',
        'registrationCode' => 'ipartial',
        'category' => 'ipartial',
    ]
)]
#[ApiFilter(
    DateFilter::class,
    properties: ['recuruitmentAt' => DateFilter::EXCLUDE_NULL]
)]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(ExistsFilter::class, properties: ['ilot'])] // ?exists[ilot]=false
class Employee {
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\Column(length: 255)]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    private ?string $lastName = null;

    #[ORM\Column(length: 255)]
    private ?string $registrationCode = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $category = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $recruitmentAt = null;

    #[ORM\OneToMany(mappedBy: 'employee', targetEntity: IlotEmployeeAttendance::class, orphanRemoval: true)]
    private Collection $ilotEmployeeAttendances;

    public function __construct() {
        $this->ilotEmployeeAttendances = new ArrayCollection();
    }

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getFirstName(): ?string {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self {
        $this->lastName = $lastName;

        return $this;
    }

    public function getRegistrationCode(): ?string {
        return $this->registrationCode;
    }

    public function setRegistrationCode(string $registrationCode): self {
        $this->registrationCode = $registrationCode;

        return $this;
    }

    public function getCategory(): ?string {
        return $this->category;
    }

    public function setCategory(?string $category): self {
        $this->category = $category;

        return $this;
    }

    public function getRecruitmentAt(): ?\DateTimeImmutable {
        return $this->recruitmentAt;
    }

    public function setRecruitmentAt(?\DateTimeImmutable $recruitmentAt): self {
        $this->recruitmentAt = $recruitmentAt;

        return $this;
    }

    /**
     * @return Collection<int, IlotEmployeeAttendance>
     */
    public function getIlotEmployeeAttendances(): Collection {
        return $this->ilotEmployeeAttendances;
    }

    public function addIlotEmployeeAttendance(IlotEmployeeAttendance $ilotEmployeeAttendance): self {
        if (!$this->ilotEmployeeAttendances->contains($ilotEmployeeAttendance)) {
            $this->ilotEmployeeAttendances->add($ilotEmployeeAttendance);
            $ilotEmployeeAttendance->setEmployee($this);
        }

        return $this;
    }

    public function removeIlotEmployeeAttendance(IlotEmployeeAttendance $ilotEmployeeAttendance): self {
        if ($this->ilotEmployeeAttendances->removeElement($ilotEmployeeAttendance)) {
            // set the owning side to null (unless already changed)
            if ($ilotEmployeeAttendance->getEmployee() === $this) {
                $ilotEmployeeAttendance->setEmployee(null);
            }
        }

        return $this;
    }
}
