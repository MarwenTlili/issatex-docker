<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ManufacturingOrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: ManufacturingOrderRepository::class)]
#[ApiResource]
class ManufacturingOrder
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?int $totalQuantity = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $technicalDocument = null;

    #[ORM\Column]
    private ?int $unitTime = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 3)]
    private ?string $unitPrice = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 3, nullable: true)]
    private ?string $totalPrice = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $observation = null;

    #[ORM\Column]
    private ?bool $urgent = null;

    #[ORM\Column]
    private ?bool $launched = null;

    #[ORM\Column]
    private ?bool $denied = null;

    #[ORM\ManyToOne(inversedBy: 'manufacturingOrders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;

    #[ORM\OneToMany(mappedBy: 'manufacturingOrder', targetEntity: Palette::class)]
    private Collection $palettes;

    #[ORM\ManyToOne(inversedBy: 'manufacturingOrders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Article $article = null;

    #[ORM\ManyToOne(inversedBy: 'manufacturingOrders')]
    private ?Invoice $invoice = null;

    #[ORM\OneToMany(mappedBy: 'manufacturingOrder', targetEntity: WeeklySchedule::class)]
    private Collection $weeklySchedules;

    #[ORM\OneToMany(mappedBy: 'manufacturingOrder', targetEntity: ManufacturingOrderSize::class)]
    private Collection $manufacturingOrderSize;

    public function __construct()
    {
        $this->palettes = new ArrayCollection();
        $this->weeklySchedules = new ArrayCollection();
        $this->manufacturingOrderSize = new ArrayCollection();
    }

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getTotalQuantity(): ?int
    {
        return $this->totalQuantity;
    }

    public function setTotalQuantity(int $totalQuantity): self
    {
        $this->totalQuantity = $totalQuantity;

        return $this;
    }

    public function getTechnicalDocument(): ?string
    {
        return $this->technicalDocument;
    }

    public function setTechnicalDocument(?string $technicalDocument): self
    {
        $this->technicalDocument = $technicalDocument;

        return $this;
    }

    public function getUnitTime(): ?int
    {
        return $this->unitTime;
    }

    public function setUnitTime(int $unitTime): self
    {
        $this->unitTime = $unitTime;

        return $this;
    }

    public function getUnitPrice(): ?string
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(string $unitPrice): self
    {
        $this->unitPrice = $unitPrice;

        return $this;
    }

    public function getTotalPrice(): ?string
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(?string $totalPrice): self
    {
        $this->totalPrice = $totalPrice;

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

    public function isUrgent(): ?bool
    {
        return $this->urgent;
    }

    public function setUrgent(bool $urgent): self
    {
        $this->urgent = $urgent;

        return $this;
    }

    public function isLaunched(): ?bool
    {
        return $this->launched;
    }

    public function setLaunched(bool $launched): self
    {
        $this->launched = $launched;

        return $this;
    }

    public function isDenied(): ?bool
    {
        return $this->denied;
    }

    public function setDenied(bool $denied): self
    {
        $this->denied = $denied;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return Collection<int, Palette>
     */
    public function getPalettes(): Collection
    {
        return $this->palettes;
    }

    public function addPalette(Palette $palette): self
    {
        if (!$this->palettes->contains($palette)) {
            $this->palettes->add($palette);
            $palette->setManufacturingOrder($this);
        }

        return $this;
    }

    public function removePalette(Palette $palette): self
    {
        if ($this->palettes->removeElement($palette)) {
            // set the owning side to null (unless already changed)
            if ($palette->getManufacturingOrder() === $this) {
                $palette->setManufacturingOrder(null);
            }
        }

        return $this;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): self
    {
        $this->article = $article;

        return $this;
    }

    public function getInvoice(): ?Invoice
    {
        return $this->invoice;
    }

    public function setInvoice(?Invoice $invoice): self
    {
        $this->invoice = $invoice;

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
            $weeklySchedule->setManufacturingOrder($this);
        }

        return $this;
    }

    public function removeWeeklySchedule(WeeklySchedule $weeklySchedule): self
    {
        if ($this->weeklySchedules->removeElement($weeklySchedule)) {
            // set the owning side to null (unless already changed)
            if ($weeklySchedule->getManufacturingOrder() === $this) {
                $weeklySchedule->setManufacturingOrder(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ManufacturingOrderSize>
     */
    public function getManufacturingOrderSize(): Collection
    {
        return $this->manufacturingOrderSize;
    }

    public function addManufacturingOrderSize(ManufacturingOrderSize $manufacturingOrderSize): self
    {
        if (!$this->manufacturingOrderSize->contains($manufacturingOrderSize)) {
            $this->manufacturingOrderSize->add($manufacturingOrderSize);
            $manufacturingOrderSize->setManufacturingOrder($this);
        }

        return $this;
    }

    public function removeManufacturingOrderSize(ManufacturingOrderSize $manufacturingOrderSize): self
    {
        if ($this->manufacturingOrderSize->removeElement($manufacturingOrderSize)) {
            // set the owning side to null (unless already changed)
            if ($manufacturingOrderSize->getManufacturingOrder() === $this) {
                $manufacturingOrderSize->setManufacturingOrder(null);
            }
        }

        return $this;
    }
}
