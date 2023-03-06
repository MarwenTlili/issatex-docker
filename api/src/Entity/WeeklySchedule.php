<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\WeeklyScheduleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: WeeklyScheduleRepository::class)]
#[ApiResource]
class WeeklySchedule
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $startAt = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private ?\DateTimeImmutable $endAt = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $observation = null;

    #[ORM\ManyToOne(inversedBy: 'weeklySchedules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ManufacturingOrder $manufacturingOrder = null;

    #[ORM\ManyToOne(inversedBy: 'weeklySchedules')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ilot $ilot = null;

    #[ORM\OneToMany(mappedBy: 'weeklySchedule', targetEntity: DailyProduction::class, orphanRemoval: true)]
    private Collection $dailyProductions;

    public function __construct()
    {
        $this->dailyProductions = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getStartAt(): ?\DateTimeImmutable
    {
        return $this->startAt;
    }

    public function setStartAt(\DateTimeImmutable $startAt): self
    {
        $this->startAt = $startAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeImmutable
    {
        return $this->endAt;
    }

    public function setEndAt(\DateTimeImmutable $endAt): self
    {
        $this->endAt = $endAt;

        return $this;
    }

    public function getObservation(): ?string
    {
        return $this->observation;
    }

    public function setObservation(?string $observation): self
    {
        $this->observation = $observation;

        return $this;
    }

    public function getManufacturingOrder(): ?ManufacturingOrder
    {
        return $this->manufacturingOrder;
    }

    public function setManufacturingOrder(?ManufacturingOrder $manufacturingOrder): self
    {
        $this->manufacturingOrder = $manufacturingOrder;

        return $this;
    }

    public function getIlot(): ?Ilot
    {
        return $this->ilot;
    }

    public function setIlot(?Ilot $ilot): self
    {
        $this->ilot = $ilot;

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
            $dailyProduction->setWeeklySchedule($this);
        }

        return $this;
    }

    public function removeDailyProduction(DailyProduction $dailyProduction): self
    {
        if ($this->dailyProductions->removeElement($dailyProduction)) {
            // set the owning side to null (unless already changed)
            if ($dailyProduction->getWeeklySchedule() === $this) {
                $dailyProduction->setWeeklySchedule(null);
            }
        }

        return $this;
    }
}
