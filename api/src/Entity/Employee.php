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

#[ORM\Entity(repositoryClass: EmployeeRepository::class)]
#[ApiResource]
class Employee
{
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
    private ?\DateTimeImmutable $recuruitmentAt = null;

    #[ORM\OneToMany(mappedBy: 'employee', targetEntity: EmployeeAttendance::class, orphanRemoval: true)]
    private Collection $employeeAttendances;

    #[ORM\OneToMany(mappedBy: 'employee', targetEntity: IlotEmployee::class, orphanRemoval: true)]
    private Collection $ilotEmployees;

    public function __construct()
    {
        $this->employeeAttendances = new ArrayCollection();
        $this->ilotEmployees = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getRegistrationCode(): ?string
    {
        return $this->registrationCode;
    }

    public function setRegistrationCode(string $registrationCode): self
    {
        $this->registrationCode = $registrationCode;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(?string $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getRecuruitmentAt(): ?\DateTimeImmutable
    {
        return $this->recuruitmentAt;
    }

    public function setRecuruitmentAt(?\DateTimeImmutable $recuruitmentAt): self
    {
        $this->recuruitmentAt = $recuruitmentAt;

        return $this;
    }

    /**
     * @return Collection<int, EmployeeAttendance>
     */
    public function getEmployeeAttendances(): Collection
    {
        return $this->employeeAttendances;
    }

    public function addEmployeeAttendance(EmployeeAttendance $employeeAttendance): self
    {
        if (!$this->employeeAttendances->contains($employeeAttendance)) {
            $this->employeeAttendances->add($employeeAttendance);
            $employeeAttendance->setEmployee($this);
        }

        return $this;
    }

    public function removeEmployeeAttendance(EmployeeAttendance $employeeAttendance): self
    {
        if ($this->employeeAttendances->removeElement($employeeAttendance)) {
            // set the owning side to null (unless already changed)
            if ($employeeAttendance->getEmployee() === $this) {
                $employeeAttendance->setEmployee(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, IlotEmployee>
     */
    public function getIlotEmployees(): Collection
    {
        return $this->ilotEmployees;
    }

    public function addIlotEmployee(IlotEmployee $ilotEmployee): self
    {
        if (!$this->ilotEmployees->contains($ilotEmployee)) {
            $this->ilotEmployees->add($ilotEmployee);
            $ilotEmployee->setEmployee($this);
        }

        return $this;
    }

    public function removeIlotEmployee(IlotEmployee $ilotEmployee): self
    {
        if ($this->ilotEmployees->removeElement($ilotEmployee)) {
            // set the owning side to null (unless already changed)
            if ($ilotEmployee->getEmployee() === $this) {
                $ilotEmployee->setEmployee(null);
            }
        }

        return $this;
    }
}
