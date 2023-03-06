<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\InvoiceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource]
class Invoice
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 3, nullable: true)]
    private ?string $totalAmount = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $invoicedAt = null;

    #[ORM\OneToMany(mappedBy: 'invoice', targetEntity: ManufacturingOrder::class)]
    private Collection $manufacturingOrders;

    public function __construct()
    {
        $this->manufacturingOrders = new ArrayCollection();
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

    public function getTotalAmount(): ?string
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(?string $totalAmount): self
    {
        $this->totalAmount = $totalAmount;

        return $this;
    }

    public function getInvoicedAt(): ?\DateTimeImmutable
    {
        return $this->invoicedAt;
    }

    public function setInvoicedAt(?\DateTimeImmutable $invoicedAt): self
    {
        $this->invoicedAt = $invoicedAt;

        return $this;
    }

    /**
     * @return Collection<int, ManufacturingOrder>
     */
    public function getManufacturingOrders(): Collection
    {
        return $this->manufacturingOrders;
    }

    public function addManufacturingOrder(ManufacturingOrder $manufacturingOrder): self
    {
        if (!$this->manufacturingOrders->contains($manufacturingOrder)) {
            $this->manufacturingOrders->add($manufacturingOrder);
            $manufacturingOrder->setInvoice($this);
        }

        return $this;
    }

    public function removeManufacturingOrder(ManufacturingOrder $manufacturingOrder): self
    {
        if ($this->manufacturingOrders->removeElement($manufacturingOrder)) {
            // set the owning side to null (unless already changed)
            if ($manufacturingOrder->getInvoice() === $this) {
                $manufacturingOrder->setInvoice(null);
            }
        }

        return $this;
    }
}
