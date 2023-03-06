<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ManufacturingOrderSizeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UlidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Ulid;

#[ORM\Entity(repositoryClass: ManufacturingOrderSizeRepository::class)]
#[ApiResource]
class ManufacturingOrderSize
{
    #[Groups(['user:read'])]
	#[ORM\Id]
    #[ORM\Column(type: UlidType::NAME, unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.ulid_generator')]
	private ?Ulid $id = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\ManyToOne(inversedBy: 'manufacturingOrderSize')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ManufacturingOrder $manufacturingOrder = null;

    #[ORM\ManyToOne(inversedBy: 'manufacturingOrderSizes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Size $size = null;

    public function getId(): ?Ulid
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

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

    public function getSize(): ?Size
    {
        return $this->size;
    }

    public function setSize(?Size $size): self
    {
        $this->size = $size;

        return $this;
    }
}
