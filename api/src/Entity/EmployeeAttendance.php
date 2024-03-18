<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\EmployeeAttendanceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: EmployeeAttendanceRepository::class)]
#[ApiResource]
class EmployeeAttendance {
    #[Groups(['user:read'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $startAt = null;

    #[ORM\Column(type: Types::TIME_IMMUTABLE)]
    private ?\DateTimeImmutable $endAt = null;

    #[ORM\ManyToOne(inversedBy: 'employeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Employee $employee = null;

    #[ORM\ManyToOne(inversedBy: 'employeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Attendance $attendance = null;

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getStartAt(): ?\DateTimeImmutable {
        return $this->startAt;
    }

    public function setStartAt(\DateTimeImmutable $startAt): self {
        $this->startAt = $startAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeImmutable {
        return $this->endAt;
    }

    public function setEndAt(\DateTimeImmutable $endAt): self {
        $this->endAt = $endAt;

        return $this;
    }

    public function getEmployee(): ?Employee {
        return $this->employee;
    }

    public function setEmployee(?Employee $employee): self {
        $this->employee = $employee;

        return $this;
    }

    public function getAttendance(): ?Attendance {
        return $this->attendance;
    }

    public function setAttendance(?Attendance $attendance): self {
        $this->attendance = $attendance;

        return $this;
    }
}
