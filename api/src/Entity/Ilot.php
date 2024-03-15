<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IlotRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ORM\Entity(repositoryClass: IlotRepository::class)]
#[ApiResource]
#[ApiFilter(
    SearchFilter::class,
    properties: [
        'name' => 'iexact',
    ]
)]
class Ilot {
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

    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: Machine::class)]
    private Collection $machines;

    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: Employee::class)]
    private Collection $employees;

    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: WeeklySchedule::class, orphanRemoval: true)]
    private Collection $weeklySchedules;

    public function __construct() {
        $this->machines = new ArrayCollection();
        $this->employees = new ArrayCollection();
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
            $machine->setIlot($this);
        }

        return $this;
    }

    public function removeMachine(Machine $machine): self {
        if ($this->machines->removeElement($machine)) {
            // set the owning side to null (unless already changed)
            if ($machine->getIlot() === $this) {
                $machine->setIlot(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Employee>
     */
    public function getEmployees(): Collection {
        return $this->employees;
    }

    public function addEmployee(Employee $employee): self {
        if (!$this->employees->contains($employee)) {
            $this->employees->add($employee);
            $employee->setIlot($this);
        }

        return $this;
    }

    public function removeEmployee(Employee $employee): self {
        if ($this->employees->removeElement($employee)) {
            // set the owning side to null (unless already changed)
            if ($employee->getIlot() === $this) {
                $employee->setIlot(null);
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
            $weeklySchedule->setIlot($this);
        }

        return $this;
    }

    public function removeWeeklySchedule(WeeklySchedule $weeklySchedule): self {
        if ($this->weeklySchedules->removeElement($weeklySchedule)) {
            // set the owning side to null (unless already changed)
            if ($weeklySchedule->getIlot() === $this) {
                $weeklySchedule->setIlot(null);
            }
        }

        return $this;
    }
}
