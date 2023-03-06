<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AttendanceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: AttendanceRepository::class)]
#[ApiResource]
class Attendance
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $dateAt = null;

    #[ORM\OneToMany(mappedBy: 'attendance', targetEntity: EmployeeAttendance::class, orphanRemoval: true)]
    private Collection $employeeAttendances;

    public function __construct()
    {
        $this->employeeAttendances = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getDateAt(): ?\DateTimeImmutable
    {
        return $this->dateAt;
    }

    public function setDateAt(\DateTimeImmutable $dateAt): self
    {
        $this->dateAt = $dateAt;

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
            $employeeAttendance->setAttendance($this);
        }

        return $this;
    }

    public function removeEmployeeAttendance(EmployeeAttendance $employeeAttendance): self
    {
        if ($this->employeeAttendances->removeElement($employeeAttendance)) {
            // set the owning side to null (unless already changed)
            if ($employeeAttendance->getAttendance() === $this) {
                $employeeAttendance->setAttendance(null);
            }
        }

        return $this;
    }
}
