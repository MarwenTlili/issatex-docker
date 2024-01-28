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
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;

#[ORM\Entity(repositoryClass: ManufacturingOrderRepository::class)]
#[ApiResource(paginationClientItemsPerPage: true)]
#[ApiResource(
    uriTemplate: '/clients/{clientId}/manufacturing_orders',
    uriVariables: [
        'clientId' => new Link(fromClass: Client::class, toProperty: 'client')
    ],
    operations: [new GetCollection(paginationClientItemsPerPage: true)]
)]
#[ApiFilter(
    RangeFilter::class,
    properties: [
        'unitTime',
        'unitPrice',
        'totalPrice'
    ]
)]
#[ApiFilter(
    DateFilter::class,
    properties: ['createdAt']
)]
#[ApiFilter(
    BooleanFilter::class,
    properties: ['urgent', 'launched', 'denied']
)]
#[ApiFilter(
    OrderFilter::class,
    properties: [
        'createdAt', 'totalQuantity', 'unitTime',
        'unitPrice', 'totalPrice', 'urgent', 'launched',
        'denied',
    ]
)]
// ?exists[weeklySchedule]=false
#[ApiFilter(
    ExistsFilter::class,
    properties: ['weeklySchedule']
)]
class ManufacturingOrder {
    #[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
    private ?Ulid $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?int $totalQuantity = null;

    #[ApiProperty(types: ['https://schema.org/documentation'])]
    #[Groups(['order:read', 'order:create', 'order:update'])]
    #[ORM\OneToOne(cascade: ['persist', 'remove'])] // (fetch: "EAGER")
    private ?TechnicalDocument $technicalDocument = null;

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

    #[ORM\OneToOne(mappedBy: 'manufacturingOrder', cascade: ['persist', 'remove'])]
    private ?WeeklySchedule $weeklySchedule = null;

    #[ORM\OneToMany(mappedBy: 'manufacturingOrder', targetEntity: ManufacturingOrderSize::class, cascade: ['persist'], orphanRemoval: true)]
    private Collection $manufacturingOrderSize;

    public function __construct() {
        $this->palettes = new ArrayCollection();
        $this->manufacturingOrderSize = new ArrayCollection();
    }

    public function getId(): ?Ulid {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getTotalQuantity(): ?int {
        return $this->totalQuantity;
    }

    public function setTotalQuantity(int $totalQuantity): self {
        $this->totalQuantity = $totalQuantity;

        return $this;
    }

    public function getTechnicalDocument(): ?TechnicalDocument {
        return $this->technicalDocument;
    }

    public function setTechnicalDocument(?TechnicalDocument $technicalDocument): self {
        $this->technicalDocument = $technicalDocument;

        return $this;
    }

    public function getUnitTime(): ?int {
        return $this->unitTime;
    }

    public function setUnitTime(int $unitTime): self {
        $this->unitTime = $unitTime;

        return $this;
    }

    public function getUnitPrice(): ?string {
        return $this->unitPrice;
    }

    public function setUnitPrice(string $unitPrice): self {
        $this->unitPrice = $unitPrice;

        return $this;
    }

    public function getTotalPrice(): ?string {
        return $this->totalPrice;
    }

    public function setTotalPrice(?string $totalPrice): self {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getObservation(): ?string {
        return $this->observation;
    }

    public function setObservation(?string $observation): self {
        $this->observation = $observation;

        return $this;
    }

    public function isUrgent(): ?bool {
        return $this->urgent;
    }

    public function setUrgent(bool $urgent): self {
        $this->urgent = $urgent;

        return $this;
    }

    public function isLaunched(): ?bool {
        return $this->launched;
    }

    public function setLaunched(bool $launched): self {
        $this->launched = $launched;

        return $this;
    }

    public function isDenied(): ?bool {
        return $this->denied;
    }

    public function setDenied(bool $denied): self {
        $this->denied = $denied;

        return $this;
    }

    public function getClient(): ?Client {
        return $this->client;
    }

    public function setClient(?Client $client): self {
        $this->client = $client;

        return $this;
    }

    /**
     * @return Collection<int, Palette>
     */
    public function getPalettes(): Collection {
        return $this->palettes;
    }

    public function addPalette(Palette $palette): self {
        if (!$this->palettes->contains($palette)) {
            $this->palettes->add($palette);
            $palette->setManufacturingOrder($this);
        }

        return $this;
    }

    public function removePalette(Palette $palette): self {
        if ($this->palettes->removeElement($palette)) {
            // set the owning side to null (unless already changed)
            if ($palette->getManufacturingOrder() === $this) {
                $palette->setManufacturingOrder(null);
            }
        }

        return $this;
    }

    public function getArticle(): ?Article {
        return $this->article;
    }

    public function setArticle(?Article $article): self {
        $this->article = $article;

        return $this;
    }

    public function getInvoice(): ?Invoice {
        return $this->invoice;
    }

    public function setInvoice(?Invoice $invoice): self {
        $this->invoice = $invoice;

        return $this;
    }

    public function getWeeklySchedule(): ?WeeklySchedule {
        return $this->weeklySchedule;
    }

    public function setWeeklySchedule(WeeklySchedule $weeklySchedule): self {
        // set the owning side of the relation if necessary
        if ($weeklySchedule->getManufacturingOrder() !== $this) {
            $weeklySchedule->setManufacturingOrder($this);
        }

        $this->weeklySchedule = $weeklySchedule;

        return $this;
    }

    /**
     * @return Collection<int, ManufacturingOrderSize>
     */
    public function getManufacturingOrderSize(): Collection {
        return $this->manufacturingOrderSize;
    }

    public function addManufacturingOrderSize(ManufacturingOrderSize $manufacturingOrderSize): self {
        if (!$this->manufacturingOrderSize->contains($manufacturingOrderSize)) {
            $this->manufacturingOrderSize->add($manufacturingOrderSize);
            $manufacturingOrderSize->setManufacturingOrder($this);
        }

        return $this;
    }

    public function removeManufacturingOrderSize(ManufacturingOrderSize $manufacturingOrderSize): self {
        if ($this->manufacturingOrderSize->removeElement($manufacturingOrderSize)) {
            // set the owning side to null (unless already changed)
            if ($manufacturingOrderSize->getManufacturingOrder() === $this) {
                $manufacturingOrderSize->setManufacturingOrder(null);
            }
        }

        return $this;
    }
}
