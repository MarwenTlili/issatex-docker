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

#[ORM\Entity(repositoryClass: IlotRepository::class)]
#[ApiResource]
class Ilot
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: IlotMachine::class, orphanRemoval: true)]
    private Collection $ilotMachines;

    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: IlotEmployee::class, orphanRemoval: true)]
    private Collection $ilotEmployees;

    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: DailyProduction::class, orphanRemoval: true)]
    private Collection $dailyProductions;

    #[ORM\OneToMany(mappedBy: 'ilot', targetEntity: WeeklySchedule::class, orphanRemoval: true)]
    private Collection $weeklySchedules;

    public function __construct()
    {
        $this->ilotMachines = new ArrayCollection();
        $this->ilotEmployees = new ArrayCollection();
        $this->dailyProductions = new ArrayCollection();
        $this->weeklySchedules = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, IlotMachine>
     */
    public function getIlotMachines(): Collection
    {
        return $this->ilotMachines;
    }

    public function addIlotMachine(IlotMachine $ilotMachine): self
    {
        if (!$this->ilotMachines->contains($ilotMachine)) {
            $this->ilotMachines->add($ilotMachine);
            $ilotMachine->setIlot($this);
        }

        return $this;
    }

    public function removeIlotMachine(IlotMachine $ilotMachine): self
    {
        if ($this->ilotMachines->removeElement($ilotMachine)) {
            // set the owning side to null (unless already changed)
            if ($ilotMachine->getIlot() === $this) {
                $ilotMachine->setIlot(null);
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
            $ilotEmployee->setIlot($this);
        }

        return $this;
    }

    public function removeIlotEmployee(IlotEmployee $ilotEmployee): self
    {
        if ($this->ilotEmployees->removeElement($ilotEmployee)) {
            // set the owning side to null (unless already changed)
            if ($ilotEmployee->getIlot() === $this) {
                $ilotEmployee->setIlot(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, DailyProduction>
     */
    public function getDailyProductions(): Collection
    {
        return $this->dailyProductions;
    }

    public function addDailyProduction(DailyProduction $dailyProduction): self
    {
        if (!$this->dailyProductions->contains($dailyProduction)) {
            $this->dailyProductions->add($dailyProduction);
            $dailyProduction->setIlot($this);
        }

        return $this;
    }

    public function removeDailyProduction(DailyProduction $dailyProduction): self
    {
        if ($this->dailyProductions->removeElement($dailyProduction)) {
            // set the owning side to null (unless already changed)
            if ($dailyProduction->getIlot() === $this) {
                $dailyProduction->setIlot(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, WeeklySchedule>
     */
    public function getWeeklySchedules(): Collection
    {
        return $this->weeklySchedules;
    }

    public function addWeeklySchedule(WeeklySchedule $weeklySchedule): self
    {
        if (!$this->weeklySchedules->contains($weeklySchedule)) {
            $this->weeklySchedules->add($weeklySchedule);
            $weeklySchedule->setIlot($this);
        }

        return $this;
    }

    public function removeWeeklySchedule(WeeklySchedule $weeklySchedule): self
    {
        if ($this->weeklySchedules->removeElement($weeklySchedule)) {
            // set the owning side to null (unless already changed)
            if ($weeklySchedule->getIlot() === $this) {
                $weeklySchedule->setIlot(null);
            }
        }

        return $this;
    }
}
