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
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;

#[ORM\Entity(repositoryClass: AttendanceRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
#[GetCollection(normalizationContext: ['groups' => ['Attendance_Collection']])]
#[Get(normalizationContext: ['groups' => 'Attendance_Get'])]
#[Post()]
#[Put()]
#[Delete()]
class Attendance {
    #[Groups(['Attendance_Collection', 'Attendance_Get'])]
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups([
        'Attendance_Collection', 'Attendance_Get',
        'IsletEmployeeAttendance_GetCollection', 'IsletEmployeeAttendance_Get'
    ])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $dateAt = null;

    #[Groups([
        'Attendance_Collection', 'Attendance_Get',
        'IsletEmployeeAttendance_GetCollection', 'IsletEmployeeAttendance_Get'
    ])]
    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $startAt = null;

    #[Groups([
        'Attendance_Collection', 'Attendance_Get',
        'IsletEmployeeAttendance_GetCollection', 'IsletEmployeeAttendance_Get'
    ])]
    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $endAt = null;

    #[Groups([
        'Attendance_Collection', 'Attendance_Get'
    ])]
    #[ORM\OneToMany(mappedBy: 'attendance', targetEntity: IsletEmployeeAttendance::class, orphanRemoval: true)]
    private Collection $isletEmployeeAttendances;

    public function __construct() {
        $this->isletEmployeeAttendances = new ArrayCollection();
    }

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getDateAt(): ?\DateTimeImmutable {
        return $this->dateAt;
    }

    public function setDateAt(\DateTimeImmutable $dateAt): self {
        $this->dateAt = $dateAt;

        return $this;
    }

    public function getStartAt(): ?\DateTimeInterface {
        return $this->startAt;
    }

    public function setStartAt(\DateTimeInterface $startAt): self {
        $this->startAt = $startAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeInterface {
        return $this->endAt;
    }

    public function setEndAt(\DateTimeInterface $endAt): self {
        $this->endAt = $endAt;

        return $this;
    }

    /**
     * @return Collection<int, IsletEmployeeAttendance>
     */
    public function getIsletEmployeeAttendances(): Collection {
        return $this->isletEmployeeAttendances;
    }

    public function addIsletEmployeeAttendance(IsletEmployeeAttendance $isletEmployeeAttendance): self {
        if (!$this->isletEmployeeAttendances->contains($isletEmployeeAttendance)) {
            $this->isletEmployeeAttendances->add($isletEmployeeAttendance);
            $isletEmployeeAttendance->setAttendance($this);
        }

        return $this;
    }

    public function removeIsletEmployeeAttendance(IsletEmployeeAttendance $isletEmployeeAttendance): self {
        if ($this->isletEmployeeAttendances->removeElement($isletEmployeeAttendance)) {
            // set the owning side to null (unless already changed)
            if ($isletEmployeeAttendance->getAttendance() === $this) {
                $isletEmployeeAttendance->setAttendance(null);
            }
        }

        return $this;
    }
}
