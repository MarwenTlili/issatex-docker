<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IsletRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ORM\Entity(repositoryClass: IsletRepository::class)]
#[ApiResource]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'name' => 'iexact',
    ]
)]
class Islet {
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[Groups(['Schedule_Collection', 'Schedule_Get', 'DailyProduction_Collection', 'DailyProduction_Get'])]
    #[ORM\Column(length: 255, unique: true)]
    private ?string $name = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToMany(mappedBy: 'islet', targetEntity: Machine::class)]
    private Collection $machines;

    #[ORM\OneToMany(mappedBy: 'islet', targetEntity: IsletEmployeeAttendance::class, orphanRemoval: true)]
    private Collection $isletEmployeeAttendances;

    #[ORM\OneToMany(mappedBy: 'islet', targetEntity: WeeklySchedule::class, orphanRemoval: true)]
    private Collection $weeklySchedules;

    public function __construct() {
        $this->machines = new ArrayCollection();
        $this->isletEmployeeAttendances = new ArrayCollection();
        $this->weeklySchedules = new ArrayCollection();
    }

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self {
        $this->createdAt = $createdAt;

        return $this;
    }


    /**
     * @return Collection<int, Machine>
     */
    public function getMachines(): Collection {
        return $this->machines;
    }

    public function addMachine(Machine $machine): self {
        if (!$this->machines->contains($machine)) {
            $this->machines->add($machine);
            $machine->setIslet($this);
        }

        return $this;
    }

    public function removeMachine(Machine $machine): self {
        if ($this->machines->removeElement($machine)) {
            // set the owning side to null (unless already changed)
            if ($machine->getIslet() === $this) {
                $machine->setIslet(null);
            }
        }

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
            $isletEmployeeAttendance->setIslet($this);
        }

        return $this;
    }

    public function removeIsletEmployeeAttendance(IsletEmployeeAttendance $isletEmployeeAttendance): self {
        if ($this->isletEmployeeAttendances->removeElement($isletEmployeeAttendance)) {
            // set the owning side to null (unless already changed)
            if ($isletEmployeeAttendance->getIslet() === $this) {
                $isletEmployeeAttendance->setIslet(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, WeeklySchedule>
     */
    public function getWeeklySchedules(): Collection {
        return $this->weeklySchedules;
    }

    public function addWeeklySchedule(WeeklySchedule $weeklySchedule): self {
        if (!$this->weeklySchedules->contains($weeklySchedule)) {
            $this->weeklySchedules->add($weeklySchedule);
            $weeklySchedule->setIslet($this);
        }

        return $this;
    }

    public function removeWeeklySchedule(WeeklySchedule $weeklySchedule): self {
        if ($this->weeklySchedules->removeElement($weeklySchedule)) {
            // set the owning side to null (unless already changed)
            if ($weeklySchedule->getIslet() === $this) {
                $weeklySchedule->setIslet(null);
            }
        }

        return $this;
    }
}
