<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IsletEmployeeAttendanceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: IsletEmployeeAttendanceRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
#[GetCollection(normalizationContext: ['groups' => ['IsletEmployeeAttendance_GetCollection']])]
#[Get(normalizationContext: ['groups' => 'IsletEmployeeAttendance_Get'])]
#[Post()]
#[Put()]
#[Delete()]
class IsletEmployeeAttendance {
    #[Groups(['IsletEmployeeAttendance_GetCollection', 'IsletEmployeeAttendance_Get'])]
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups([
        'IsletEmployeeAttendance_GetCollection', 'IsletEmployeeAttendance_Get',
        'Attendance_Collection', 'Attendance_Get'
    ])]
    #[ORM\ManyToOne(inversedBy: 'isletEmployeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Islet $islet = null;

    #[Groups([
        'IsletEmployeeAttendance_GetCollection', 'IsletEmployeeAttendance_Get',
        'Attendance_Collection', 'Attendance_Get'
    ])]
    #[ORM\ManyToOne(inversedBy: 'isletEmployeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Employee $employee = null;
    
    #[Groups([
        'IsletEmployeeAttendance_GetCollection', 'IsletEmployeeAttendance_Get'
    ])]
    #[ORM\ManyToOne(inversedBy: 'isletEmployeeAttendances')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Attendance $attendance = null;

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getIslet(): ?Islet {
        return $this->islet;
    }

    public function setIslet(?Islet $islet): self {
        $this->islet = $islet;

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
