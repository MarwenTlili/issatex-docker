<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IlotEmployeeAttendanceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: IlotEmployeeAttendanceRepository::class)]
#[ApiResource]
class IlotEmployeeAttendance {
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\ManyToOne(inversedBy: 'ilotEmployeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ilot $ilot = null;

    #[ORM\ManyToOne(inversedBy: 'ilotEmployeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Employee $employee = null;

    #[ORM\ManyToOne(inversedBy: 'ilotEmployeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Attendance $attendance = null;

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getIlot(): ?Ilot {
        return $this->ilot;
    }

    public function setIlot(?Ilot $ilot): self {
        $this->ilot = $ilot;

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
